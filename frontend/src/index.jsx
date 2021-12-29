import React, { useState, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client'
import { ThemeProvider } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// V5 temporary migration fix
import StyledEngineProvider from '@mui/material/StyledEngineProvider'

import { v4 as generateUUID } from 'uuid'

import { CRUDFProvider } from '@molaux/mui-crudf'

import './index.css'
import App from './App'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'

import { ProfileProvider } from './components/login/Context'

import { ConfigurationProvider, ConfigurationContext } from './components/configuration/Context'

import buildApolloClient from './apollo'
import { StyledLogin } from './components/login/Login'
import { default as normalTheme, lightThemeDense as denseTheme, darkTheme, darkThemeDense } from './ui/theme'
import ErrorHandler from './ui/ErrorHandler'

import pkg from '../package.json'

let basePath = process.env.PUBLIC_URL
basePath = basePath.length > 0 && basePath[basePath.count - 1] === '/' ? basePath.substring(0, -1) : basePath
const uuid = generateUUID()

const ThemizedApp = ({ onNewToken, token, error, onDisconnect }) => {
  const {
    configuration
  } = useContext(ConfigurationContext)

  const isMobile = useMediaQuery(normalTheme.breakpoints.down('sm'))

  const theme = isMobile
    ? configuration.theme
      ? configuration.theme === 'dark'
        ? darkThemeDense
        : denseTheme
      : denseTheme
    : configuration.theme === 'dark'
      ? configuration.theme
        ? darkTheme
        : normalTheme
      : normalTheme

  return (
    <ThemeProvider theme={theme}>
      <StyledEngineProvider injectFirst>
        <ErrorHandler error={error}>
          <ProfileProvider disconnect={onDisconnect}>
            <BrowserRouter basename={basePath}>
              <CRUDFProvider>
                <Routes>
                  <Route path="*" element={<App module="home" onDisconnect={onDisconnect} />} />
                  <Route exact path="/:module" element={<App onDisconnect={onDisconnect} />} />
                </Routes>
              </CRUDFProvider>
            </BrowserRouter>
          </ProfileProvider>
        </ErrorHandler>
      </StyledEngineProvider>
    </ThemeProvider>
  )
}

ThemizedApp.propTypes = {
  token: PropTypes.string,
  onNewToken: PropTypes.func.isRequired,
  error: PropTypes.shape({}),
  onDisconnect: PropTypes.func.isRequired
}

ThemizedApp.defaultProps = {
  token: null,
  error: undefined
}

const AuthenticatedApp = () => {
  const [token, setToken] = useState(window.localStorage.getItem('auth-token'))
  const [error, setError] = useState(null)

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

  return (
    <ApolloProvider client={apolloClient}>
      { !token
        ? <StyledLogin onNewToken={onNewToken} />
        : (
          <ConfigurationProvider>
            <ThemizedApp
              token={token}
              onNewToken={onNewToken}
              onDisconnect={onDisconnect}
              error={error}
            />
          </ConfigurationProvider>
          )}
    </ApolloProvider>
  )
}

ReactDOM.render(
  <AuthenticatedApp />
  , document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register()
