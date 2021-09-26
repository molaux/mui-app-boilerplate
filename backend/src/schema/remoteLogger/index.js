'use strict'
import util from 'util'
import graphql from 'graphql'

const { GraphQLNonNull, GraphQLString, GraphQLBoolean } = graphql

export const log = (message) => {
  try {
    const json = JSON.parse(message)
    console.log((new Date()).toLocaleString())
    console.log(util.inspect(json, false, null, true /* enable colors */))
  } catch (e) {
    console.log(`${(new Date()).toLocaleString()} - ${message}`)
  }
}

export const mutations = () => ({
  remoteLog: {
    namespace: 'Logger',
    type: GraphQLBoolean,
    args: {
      message: {
        type: new GraphQLNonNull(GraphQLString)
      }
    },
    resolve: async (_, { message }) => {
      log(message)
      return true
    }
  }
})
