import fetch from 'node-fetch'
import _GraphQLJSON from 'graphql-type-json'
const { GraphQLJSON } = _GraphQLJSON

// Use a register to not overwhelm foreign API
const register = new Map()

export const extraFields = ({ modelsTypes, nameFormatter }, model) => {
  const extraFields = {}

  if (nameFormatter.namespace === '' && model.name === 'Country') {
    extraFields.infos = {
      type: GraphQLJSON,
      /**
       * A regular GraphQL resolver
       *
       * Here you can link your model to whatever you want.
       * You can pass services handlers through the graphQLContext, like other
       * Sequelize instances (to build fake links between two databases), or mongo, ...
       *
       * @param {*} parent The parent node resolved against a Country Sequelize model instance
       * @param {*} args optional args to your fields
       * @param {*} graphQLContext the GraphQL context
       */
      resolve: async (parent, args, graphQLContext) => {
        if (!register.has(parent.country)) {
          register.set(
            parent.country,
            await fetch(`https://restcountries.eu/rest/v2/name/${parent.country}`)
              .then(response => {
                if (response.ok) {
                  return response
                } else {
                  throw Error(response.statusText)
                }
              })
              .then(response => response.json())
              .catch(() => null)
          )
        }

        return register.get(parent.country)
      }
    }
  }
  return extraFields
}
