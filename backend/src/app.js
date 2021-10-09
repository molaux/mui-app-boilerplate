'use strict'
import dotenv from 'dotenv-flow'
import schema from './schema'
import expressJwt from 'express-jwt'
import express from 'express'
import loadModels from './models'
import apolloServerExpress from 'apollo-server-express'
import graphqlSubscriptions from 'graphql-subscriptions'
import jwt from 'jsonwebtoken'
import graphqlModule from 'graphql'
import sTWSodule from 'subscriptions-transport-ws'
import UmzugModule from 'umzug'

const { Umzug, SequelizeStorage } = UmzugModule
const { execute, subscribe } = graphqlModule
const { SubscriptionServer } = sTWSodule

dotenv.config()

const { PubSub } = graphqlSubscriptions
const pubSub = new PubSub()

const { ApolloServer, AuthenticationError } = apolloServerExpress

export default async () => {
  const databases = await loadModels()

  // Manage own db migrations
  const umzug = new Umzug({
    migrations: { glob: 'migrations/own/*.cjs' },
    context: databases.own,
    storage: new SequelizeStorage({ sequelize: databases.own })
    // logger: console
  })

  umzug.on('migrating', ev => console.log(`Database migration (${ev.name}) : Executing...`))
  umzug.on('migrated', ev => console.log(`Database migration (${ev.name}) : Done.`))

  await umzug.up()

  // console.log(await databases.own.models.User.findOne())

  console.log('Building Apollo server...')
  const finalSchema = schema(databases)
  const apolloServer = new ApolloServer({
    schema: finalSchema,
    formatResponse (body) {
      if (body.errors && body.errors.find(err => err.extensions && err.extensions.code === 'UNAUTHENTICATED')) {
        return {
          ...body,
          data: undefined
        }
      }
      return body
    },
    plugins: [
      {
        requestDidStart () {
          return {
            didEncounterErrors ({ response, errors }) {
              if (errors.find(err => err instanceof AuthenticationError || err.originalError instanceof AuthenticationError)) {
                response.data = undefined
                response.http.status = 401
              }
            }
          }
        }
      }
    ],
    context: async ({ req, res, connection }) => ({ // add your own context here
      ...(connection ? connection.context : {}),
      databases,
      pubSub,
      req: {
        ip: connection ? connection.context.req.ip : req.socket.remoteAddress
      },
      user: {
        ...req?.user
          ? { ...req?.user, model: req.user.uid ? await databases.own.models.User.findOne({ where: { login: req.user.uid } }) : null }
          : connection?.context?.user
      }
    }),
    uploads: false, // Disable the upload support provided by the older `graphql-upload` version
    formatErrors: error => {
      console.error(error)
      return error
    }
  })
  const app = express()

  // Create our express app
  // Graphql endpoint
  app.use(process.env.API_APOLLO_PATH,
    expressJwt({
      secret: process.env.JWT_SECRET,
      algorithms: ['HS256'],
      credentialsRequired: false
    }))

  // Handle uuid
  app.use(process.env.API_APOLLO_PATH, function (req, res, next) {
    if (req.headers && req.user) {
      req.user.uuid = req.headers.uuid
    }
    next()
  })

  // Handle errors
  app.use(function (err, req, res, next) {
    res.header('Access-Control-Allow-Headers', '*')
    res.header('Access-Control-Allow-Origin', '*')
    return next(err)
  })

  await apolloServer.start()
  apolloServer.applyMiddleware({ app, path: process.env.API_APOLLO_PATH })

  const buildSubscriptionServer = server => SubscriptionServer.create({
    schema: finalSchema,
    execute,
    subscribe,
    onOperation: (message, params, webSocket) => {
      return {
        ...params,
        context: {
          ...params.context,
          databases,
          pubSub
        }
      }
    },
    onConnect: async (connectionParams, webSocket, connection) => {
      if (connectionParams.authToken) {
        return Promise.resolve({
          req: { ip: connection.request.socket.remoteAddress },
          user: {
            model: await databases.own.models.User.findOne({ where: { login: jwt.verify(connectionParams.authToken, process.env.JWT_SECRET).uid } }),
            uuid: connectionParams.uuid
          }
        })
      }

      throw new Error('Missing auth token!')
    }
  }, {
    server,
    path: process.env.API_APOLLO_PATH
  })

  return { app, apolloServer, buildSubscriptionServer }
}
