import { gql } from '@apollo/client'

export const CONFIGURATION_QUERY = gql`
query {
  generalConfiguration
}
`

export default CONFIGURATION_QUERY
