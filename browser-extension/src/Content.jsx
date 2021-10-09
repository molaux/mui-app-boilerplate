/* eslint-disable no-console */
import React, { useState, useEffect, useCallback } from 'react'
import { ApolloProvider } from '@apollo/client'
import { ThemeProvider } from '@mui/material/styles'
// import useMediaQuery from '@mui/material/useMediaQuery'

// V5 temporary migration fix
import StyledEngineProvider from '@mui/material/StyledEngineProvider'

import { v4 as generateUUID } from 'uuid'
// import pkg from '../package.json'
import { ReactComponent as Logo } from './ui/logo.svg'
import buildApolloClient from './apollo'
import { lightThemeDense as denseTheme } from './ui/theme'
import ErrorHandler from './ui/ErrorHandler'

const uuid = generateUUID()

function Content ({ url }) {
  const [error, setError] = useState(null)
  const [token, setToken] = useState(window.localStorage.getItem('auth-token'))

  const onDisconnect = () => {
    window.localStorage.removeItem('auth-token')
    setToken(null)
    setApolloClient(buildApolloClient(null, uuid, onError))
  }

  const onError = (e) => {
    if (!e || ['invalid token', 'invalid signature'].includes(e.message)) {
      onDisconnect()
    } else {
      setError(e)
    }
  }
  const [apolloClient, setApolloClient] = useState(buildApolloClient(token, uuid, onError))

  const onNewToken = useCallback((message) => {
    console.log('Content : received new message', message)
    console.log('Content : rebuilding apollo')
    setApolloClient(buildApolloClient(message?.token || null, uuid, onError))
    setToken(message?.token || null)
  }, [setApolloClient, buildApolloClient, setToken])

  useEffect(() => {
    if (!token) {
      console.log('Asking for token')
      // eslint-disable-next-line no-undef
      browser.runtime.sendMessage({
        ask: 'token'
      })
        .then(onNewToken)
        .catch((err) => console.error('Message answer error', err))
    }
    console.log('Listening to new tokens')
    // eslint-disable-next-line no-undef
    browser.runtime.onMessage.addListener(onNewToken)
    // eslint-disable-next-line no-undef
    return () => browser.runtime.onMessage.removeListener(onNewToken)
  }, [onNewToken, token])

  // const isMobile = useMediaQuery(normalTheme.breakpoints.down('sm'))
  return (
    <ThemeProvider theme={denseTheme}>
      <StyledEngineProvider injectFirst>
        <ErrorHandler error={error}>
          <ApolloProvider client={apolloClient}>
            { !token
              ? 'NOT AUTHENTICATED'
              : (
                <>
                  <Logo height="4em" width="4em" />
                  {url}
                </>
                ) }
          </ApolloProvider>
        </ErrorHandler>
      </StyledEngineProvider>
    </ThemeProvider>
  )
}

export default Content
