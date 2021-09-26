import { gql } from '@apollo/client'

export const SERVER_INFOS_QUERY = gql`
  query serverInfos {
    serverInfos {
      version
      env
    }
  }
`

export default SERVER_INFOS_QUERY
