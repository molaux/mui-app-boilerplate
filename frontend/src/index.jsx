import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client'
import { ThemeProvider } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// V5 temporary migration fix
import StyledEngineProvider from '@mui/material/StyledEngineProvider'

import { v4 as generateUUID } from 'uuid'

import { CRUDFProvider } from '@molaux/mui-crudf'

import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'

import { ProfileProvider } from './components/login/Context'

import buildApolloClient from './apollo'
import { Login } from './components/login/Login'
import { default as normalTheme, lightThemeDense as denseTheme } from './ui/theme'
import ErrorHandler from './ui/ErrorHandler'

import { build } from '../package.json'

let basePath = process.env.PUBLIC_URL
basePath = basePath.length > 0 && basePath[basePath.count - 1] === '/' ? basePath.substring(0, -1) : basePath
const uuid = generateUUID()

const AuthenticatedApp = () => {
  const [error, setError] = useState(null)
  const [token, setToken] = useState(window.localStorage.getItem('auth-token'))

  useEffect(() => {
    document.title = build.productName
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
              <ErrorHandler error={error}>
                <ProfileProvider disconnect={onDisconnect}>
                  <BrowserRouter basename={basePath}>
                    <CRUDFProvider>
                      <Switch>
                        <Route exact path="/" render={(props) => <App {...props} module="home" onDisconnect={onDisconnect} />} />
                      </Switch>
                    </CRUDFProvider>
                  </BrowserRouter>
                </ProfileProvider>
              </ErrorHandler>
              ) }
        </ApolloProvider>
      </StyledEngineProvider>
    </ThemeProvider>
  )
}

ReactDOM.render(
  <AuthenticatedApp />
  , document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
