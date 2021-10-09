import { gql } from '@apollo/client'

export const CONFIGURATION_QUERY = gql`
query {
  configuration
}
`

export default CONFIGURATION_QUERY
