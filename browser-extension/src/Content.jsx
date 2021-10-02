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

function Content () {
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
    if (message?.token) {
      console.log('Content : rebuilding apollo')
      setApolloClient(buildApolloClient(message.token, uuid, onError))
      setToken(message.token)
    }
  }, [setApolloClient, buildApolloClient, setToken])

  useEffect(() => {
    // console.log('Listening to new tokens')
    // browser.runtime.onMessage.addListener(onNewToken)
    // return () => browser.runtime.onMessage.removeListener(onNewToken)
    // eslint-disable-next-line no-undef
    browser.runtime.sendMessage({
      ask: 'token'
    })
      .then(onNewToken)
      .catch((err) => console.error('Message answer error', err))
  }, [onNewToken])

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
                  Test
                  <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Learn React
                  </a>
                </>
                ) }
          </ApolloProvider>
        </ErrorHandler>
      </StyledEngineProvider>
    </ThemeProvider>
  )
}

export default Content
