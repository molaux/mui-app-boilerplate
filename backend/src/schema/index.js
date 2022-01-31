'use strict'
import dotenv from 'dotenv'
import packageJsonData from '../../package.json'
import graphql from 'graphql'
import sequelizeGraphQLSchemaBuilder from '@molaux/sequelize-graphql-schema-builder'
import Sequelize from 'sequelize'
import _GraphQLJSON from 'graphql-type-json'

import {
  securizeAllResolvers,
  mutations as authenticationMutations,
  queries as authenticationQueries,
  subscriptions as authenticationSubscriptions
} from './authentication'

import { mutations as remoteLoggerMutations } from './remoteLogger'
import {
  mutations as configurationMutations,
  queries as configurationQueries
} from './configuration'

import { extraFields as countryExtraFields } from './country'

const { GraphQLJSON } = _GraphQLJSON
const { QueryTypes } = Sequelize

dotenv.config({
  silent: true
})
const packageJson = Object.assign({}, {
  version: 'Unknown'
}, packageJsonData)

const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLSchema,
  GraphQLList
} = graphql

const { schemaBuilder } = sequelizeGraphQLSchemaBuilder

const schema = dbs => {
  console.log('Building API Schema...')
  const {
    modelsTypes,
    queries,
    mutations,
    subscriptions,
    nameFormatter,
    logger
  } = schemaBuilder(dbs.own, {
    extraModelFields: (...args) => ({
      ...countryExtraFields(...args)
      // ...Add other extraFields hooks here
    })
  })

  return new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'RootQueryType',
      fields: () => ({
        ...securizeAllResolvers({
          // sql: {
          //   name: 'Raw SQL query',
          //   type: new GraphQLList(GraphQLJSON),
          //   args: {
          //     request: { type: GraphQLString }
          //   },
          //   resolve: (_, { request }, { databases }) => {
          //     return databases.own.query(request, { raw: true, type: QueryTypes.SELECT })
          //   }
          // },
          ...queries,
          ...authenticationQueries({ modelsTypes, nameFormatter, logger }),
          ...configurationQueries()
        }, 'query'),
        // non secured query
        serverInfos: {
          type: new GraphQLNonNull(new GraphQLObjectType({
            name: 'ServerInfos',
            description: 'Server infos',
            fields: {
              version: { type: new GraphQLNonNull(GraphQLString) },
              env: { type: new GraphQLNonNull(GraphQLString) }
            }
          })),
          resolve: () => ({
            version: packageJson.version,
            env: process.env.NODE_ENV
          })
        }
      })
    }),
    subscription: new GraphQLObjectType({
      name: 'RootSubscriptionType',
      fields: () => securizeAllResolvers({
        ...subscriptions,
        ...authenticationSubscriptions({ modelsTypes, nameFormatter, logger })
      }, 'subscription')
    }),
    mutation: new GraphQLObjectType({
      name: 'RootMutationType',
      fields: () => ({
        ...authenticationMutations,
        ...securizeAllResolvers({
          ...mutations,
          ...remoteLoggerMutations(),
          ...configurationMutations()
          // ...otherMutations()
        }, 'mutation')
      })
    })
  })
}
export default schema
