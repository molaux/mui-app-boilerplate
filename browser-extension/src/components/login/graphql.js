import { propType as graphQLPropType } from 'graphql-anywhere'
import { gql } from '@apollo/client'

export const PROFILE_DETAILS_FRAGMENT = gql`
  fragment ProfileDetails on User {
    id
    enabled
    name
    firstName
    lastName
    Permissions {
      id
      name
    }
    Groups {
      id
      name
      Permissions {
        id
        name
      }
    }
  }
`

PROFILE_DETAILS_FRAGMENT.propTypes = graphQLPropType(PROFILE_DETAILS_FRAGMENT)

export const PROFILE_QUERY = gql`
  query {
    profile {
      ...ProfileDetails
    }
  }
  ${PROFILE_DETAILS_FRAGMENT}
`

PROFILE_QUERY.propTypes = graphQLPropType(PROFILE_QUERY)

export default PROFILE_QUERY

export const PROFILE_UPDATE_SUBSCRIPTION = gql`
  subscription {
    profileUpdated  {
      ...ProfileDetails
    }
  }
  ${PROFILE_DETAILS_FRAGMENT}
`
