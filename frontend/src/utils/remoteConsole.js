import { useMutation } from '@apollo/client'
import { gql } from '@apollo/client'

const useRemoteConsole = () => {
  const [remoteLogger] = useMutation(gql`
    mutation remoteLog($message: String!) {
      remoteLog(message: $message)
    }
  `)
  return (message) => remoteLogger(({ variables: { message: typeof message === 'object' ? JSON.stringify(message) : message } }))
}

export default useRemoteConsole
