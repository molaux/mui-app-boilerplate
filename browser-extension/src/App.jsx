import React, { useState, useEffect } from 'react'
import { ApolloProvider } from '@apollo/client'
import { ThemeProvider } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// V5 temporary migration fix
import StyledEngineProvider from '@mui/material/StyledEngineProvider'

import { v4 as generateUUID } from 'uuid'
import pkg from '../package.json'
import { ReactComponent as Logo } from './ui/logo.svg'
import buildApolloClient from './apollo'
import { Login } from './components/login/Login'
import { default as normalTheme, lightThemeDense as denseTheme } from './ui/theme'

const uuid = generateUUID()

function App () {
  const [error, setError] = useState(null)
  const [token, setToken] = useState(window.localStorage.getItem('auth-token'))

  useEffect(() => {
    document.title = pkg.build.productName
  }, [])

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

  const onNewToken = (newToken) => {
    window.localStorage.setItem('auth-token', newToken)
    setApolloClient(buildApolloClient(newToken, uuid, onError))
    setToken(newToken)
  }

  const isMobile = useMediaQuery(normalTheme.breakpoints.down('sm'))

  return (
    <ThemeProvider theme={isMobile ? denseTheme : normalTheme}>
      <StyledEngineProvider injectFirst>
        <ApolloProvider client={apolloClient}>
          { !token
            ? <Login onNewToken={onNewToken} />
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
              )}
        </ApolloProvider>
      </StyledEngineProvider>
    </ThemeProvider>
  )
}

export default App
