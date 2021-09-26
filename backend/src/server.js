'use strict'
import dotenv from 'dotenv-flow'
// import json5 from 'json5'
import colors from 'colors'
import https from 'https'
import http from 'http'
import fs from 'fs'
import appBuilder from './app'

dotenv.config()

const SECURED = process.env.SECURED === 'yes'

const credentials = {
  key: SECURED ? fs.readFileSync(process.env.SECURED_PRIVKEY) : null,
  cert: SECURED ? fs.readFileSync(process.env.SECURED_CERT) : null
}

const startServer = async () => {
  console.log(`Server starting in ${colors.red(process.env.NODE_ENV || 'development')} mode...`)

  const { app, apolloServer, buildSubscriptionServer } = await appBuilder()

  if (SECURED) {
    const httpsServer = https.createServer(credentials, app)
    const subscriptionServer = buildSubscriptionServer(httpsServer)

    httpsServer.listen({ host: process.env.HOST, port: process.env.PORT }, () => {
      console.log(`  ${colors.brightGreen('✱')} ${colors.grey('Graphql API ready at')}           ${colors.brightGreen('https')}://${colors.brightWhite(process.env.HOST)}:${colors.brightWhite(process.env.PORT)}${colors.brightCyan(apolloServer.graphqlPath)}`)
      console.log(`  ${colors.brightGreen('✱')} ${colors.grey('Graphql subscriptions ready at')} ${colors.brightGreen('wss')}://${colors.brightWhite(process.env.HOST)}:${colors.brightWhite(process.env.PORT)}${colors.brightCyan(subscriptionServer.wsServer.options.path)}`)
    })
  } else {
    const httpServer = http.createServer(app)
    const subscriptionServer = buildSubscriptionServer(httpServer)

    httpServer.listen({ host: process.env.HOST, port: process.env.PORT }, () => {
      console.log(`  ${colors.yellow('✱')} ${colors.grey('Graphql API ready at')}           ${colors.yellow('http')}://${colors.brightWhite(process.env.HOST)}:${colors.brightWhite(process.env.PORT)}${colors.brightCyan(apolloServer.graphqlPath)}`)
      console.log(`  ${colors.yellow('✱')} ${colors.grey('Graphql subscriptions ready at')} ${colors.yellow('ws')}://${colors.brightWhite(process.env.HOST)}:${colors.brightWhite(process.env.PORT)}${colors.brightCyan(subscriptionServer.wsServer.options.path)}`)
    })
  }

  function exitHandler (options, err) {
    if (options.cleanup) {
      // cleanly close other connections here
    }

    if (err && err.stack) {
      console.log(err.stack)
    }

    if (options.exit) {
      process.exit()
    }
  }

  process.on('exit', exitHandler.bind(null, { cleanup: true, exit: true }))
  process.on('SIGINT', exitHandler.bind(null, { exit: true }))
  process.on('SIGUSR1', exitHandler.bind(null, { exit: true }))
  process.on('SIGUSR2', exitHandler.bind(null, { exit: true }))
  process.on('uncaughtException', exitHandler.bind(null, { exit: true }))
}

startServer()
