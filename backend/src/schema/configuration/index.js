'use strict'
import graphql from 'graphql'
import graphqlTypeJson from 'graphql-type-json'

const { GraphQLNonNull, GraphQLBoolean } = graphql
const { GraphQLJSON } = graphqlTypeJson

let configuration = {}

export const getConfiguration = () => Promise.resolve(configuration)

export const queries = () => ({
  configuration: {
    namespace: 'Configuration',
    type: GraphQLJSON,
    resolve: () => getConfiguration()
  }
})

export const mutations = () => ({
  saveConfiguration: {
    namespace: 'Configuration',
    type: new GraphQLNonNull(GraphQLBoolean),
    args: {
      configuration: {
        type: GraphQLJSON
      }
    },
    resolve: (_, { configuration: newConfiguration }) => {
      configuration = newConfiguration
      return true
    }
  }
})
