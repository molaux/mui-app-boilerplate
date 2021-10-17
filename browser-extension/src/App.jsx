/* eslint-disable no-console */
import React, { useState } from 'react'
import { ApolloProvider } from '@apollo/client'
import { ThemeProvider } from '@mui/material/styles'
// import useMediaQuery from '@mui/material/useMediaQuery'

// V5 temporary migration fix
import StyledEngineProvider from '@mui/material/StyledEngineProvider'

import { v4 as generateUUID } from 'uuid'
import { Box, Button } from '@mui/material'
// import pkg from '../package.json'
import { ReactComponent as Logo } from './ui/logo.svg'
import buildApolloClient from './apollo'
import { StyledLogin } from './components/login/Login'
import { reversedThemeDense as theme } from './ui/theme'
import ErrorHandler from './ui/ErrorHandler'

const uuid = generateUUID()

// eslint-disable-next-line no-undef
const sendToken = (token) => browser.tabs.query({})
  .then((tabs) => tabs.map(({ id }) => {
    console.log('Sending disconnect to ', id)
    // eslint-disable-next-line no-undef
    return browser.tabs.sendMessage(id, { token })
      .catch((err) => console.error('sendMessage', err))
  }))
  .catch((err) => console.error('query', err))

function App () {
  const [error, setError] = useState(null)
  const [token, setToken] = useState(window.localStorage.getItem('auth-token'))

  const onDisconnect = () => {
    window.localStorage.removeItem('auth-token')
    setToken(null)
    setApolloClient(buildApolloClient(null, uuid, onError))
    // eslint-disable-next-line no-undef
    sendToken(null)
  }

  const onError = (e) => {
    if (!e || ['invalid token', 'invalid signature'].includes(e.message)) {
      onDisconnect()
    } else {
      setError(e)
    }
  }
  const [apolloClient, setApolloClient] = useState(buildApolloClient(token, uuid, onError))

  const onNewToken = (newToken) => {
    console.log('Recieving new token', newToken)
    window.localStorage.setItem('auth-token', newToken)

    console.log('Sending new token')
    sendToken(newToken)

    setApolloClient(buildApolloClient(newToken, uuid, onError))
    setToken(newToken)
  }

  // const isMobile = useMediaQuery(normalTheme.breakpoints.down('sm'))
  return (
    <ThemeProvider theme={theme}>
      <StyledEngineProvider injectFirst>
        <ErrorHandler error={error}>
          <ApolloProvider client={apolloClient}>
            { !token
              ? <StyledLogin onNewToken={onNewToken} />
              : (
                <Box
                  sx={{
                    padding: theme.spacing(4),
                    backgroundColor: theme.palette.background.default
                  }}
                >
                  <Box style={{ textAlign: 'center', fontSize: '1.5em', marginBottom: theme.spacing(4) }}>
                    <Logo height="1.5em" width="1.5em" style={{ marginBottom: '-0.3em', marginRight: theme.spacing(2) }} />
                    <span style={{ color: 'white' }}>MUI Boilerplate App extension</span>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'right' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={onDisconnect}
                    >
                      Disconnect
                    </Button>
                  </Box>
                </Box>
                ) }
          </ApolloProvider>
        </ErrorHandler>
      </StyledEngineProvider>
    </ThemeProvider>
  )
}

export default App
