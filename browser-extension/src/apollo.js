import { InMemoryCache } from '@apollo/client/cache'
import { WebSocketLink } from '@apollo/client/link/ws'
import { split, from } from '@apollo/client'
import { ApolloClient } from '@apollo/client/core'
import { getMainDefinition } from '@apollo/client/utilities'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'

import { createUploadLink } from 'apollo-upload-client'

const buildApolloClient = (token, uuid, onAuthError) => {
  const errorLink = onError((operation) => {
    const { graphQLErrors, networkError } = operation
    if (graphQLErrors) {
      // eslint-disable-next-line no-console
      graphQLErrors.map(({ message, locations, path }) => console.log(
          `[##GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      ))
      for (const err of graphQLErrors) {
        if (err.extensions.code === 'UNAUTHENTICATED') {
          onAuthError()
        }
      }
    }

    if (networkError) {
      onAuthError(networkError)
      // eslint-disable-next-line no-console
      console.log('[##Network error]:', networkError, { uri: `ws${process.env.REACT_APP_GRAPHQL_IS_SECURED === 'yes' ? 's' : ''}://${process.env.REACT_APP_GRAPHQL_HOST}:${process.env.REACT_APP_GRAPHQL_PORT}${process.env.REACT_APP_GRAPHQL_ENDPOINT_PATH}`, token })
    }
  })

  const wsLink = token
    ? new WebSocketLink({
      uri: `ws${process.env.REACT_APP_GRAPHQL_IS_SECURED === 'yes' ? 's' : ''}://${process.env.REACT_APP_GRAPHQL_HOST}:${process.env.REACT_APP_GRAPHQL_PORT}${process.env.REACT_APP_GRAPHQL_ENDPOINT_PATH}`,
      options: {
        reconnect: true,
        connectionParams: {
          authToken: token,
          uuid
        }
      }
    })
    : null

  const httpLink = createUploadLink({ uri: `http${process.env.REACT_APP_GRAPHQL_IS_SECURED === 'yes' ? 's' : ''}://${process.env.REACT_APP_GRAPHQL_HOST}:${process.env.REACT_APP_GRAPHQL_PORT}${process.env.REACT_APP_GRAPHQL_ENDPOINT_PATH}` })

  const link = wsLink
    ? split(
      // split based on operation type
      ({ query }) => {
        const definition = getMainDefinition(query)
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        )
      },
      wsLink,
      httpLink
    )
    : httpLink

  const authLink = setContext((_, { headers }) => ({
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
      uuid
    }
  }))

  // Optims disabled since I mutate articles (decorates
  // with post computed ventes, etc) in ShopData, etc...
  return new ApolloClient({
    link: from([authLink, errorLink, link]),
    cache: new InMemoryCache({
      // freezeResults: true
      typePolicies: {
        Query: {
          fields: {
            Notifications: {
              keyFields: ['notificationId'],
              merge: (existing, incoming) => incoming
            },
            NotTrackedArticles: {
              merge: (existing, incoming) => incoming
            }
          }
        }
      }
    })
    // assumeImmutableResults: true
  })
}

export default buildApolloClient
