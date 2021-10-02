/* eslint-disable no-console */
import React, { useState } from 'react'
import { ApolloProvider } from '@apollo/client'
import { ThemeProvider } from '@mui/material/styles'
// import useMediaQuery from '@mui/material/useMediaQuery'

// V5 temporary migration fix
import StyledEngineProvider from '@mui/material/StyledEngineProvider'

import { v4 as generateUUID } from 'uuid'
import { Button } from '@mui/material'
// import pkg from '../package.json'
import { ReactComponent as Logo } from './ui/logo.svg'
import buildApolloClient from './apollo'
import { Login } from './components/login/Login'
import { lightThemeDense as denseTheme } from './ui/theme'
import ErrorHandler from './ui/ErrorHandler'

const uuid = generateUUID()

function App () {
  const [error, setError] = useState(null)
  const [token, setToken] = useState(window.localStorage.getItem('auth-token'))

  const onDisconnect = () => {
    window.localStorage.removeItem('auth-token')
    setToken(null)
    setApolloClient(buildApolloClient(null, uuid, onError))
    // eslint-disable-next-line no-undef
    browser.tabs.query({
      currentWindow: true,
      active: true
    }).then((tabs) => tabs.map(({ id }) => {
      console.log('Sending disconnect to ', id)
      // eslint-disable-next-line no-undef
      return browser.tabs.sendMessage(id, { token: null })
        .catch((err) => console.error('sendMessage', err))
    }))
      .catch((err) => console.error('query', err))
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
    window.localStorage.setItem('auth-token', newToken)
    setApolloClient(buildApolloClient(newToken, uuid, onError))
    setToken(newToken)
    // eslint-disable-next-line no-undef
    console.log({ waitingTokenListeners })
    // eslint-disable-next-line no-undef
    for (const sendToken of waitingTokenListeners) {
      console.log('sending token')
      sendToken({ token: newToken })
    }
    // eslint-disable-next-line no-undef
    waitingTokenListeners = []
  }

  // const isMobile = useMediaQuery(normalTheme.breakpoints.down('sm'))
  return (
    <ThemeProvider theme={denseTheme}>
      <StyledEngineProvider injectFirst>
        <ErrorHandler error={error}>
          <ApolloProvider client={apolloClient}>
            { !token
              ? <Login onNewToken={onNewToken} />
              : (
                <>
                  <Logo height="4em" width="4em" />
                  <Button onClick={onDisconnect}>
                    Disconnect
                  </Button>
                </>
                ) }
          </ApolloProvider>
        </ErrorHandler>
      </StyledEngineProvider>
    </ThemeProvider>
  )
}

export default App
