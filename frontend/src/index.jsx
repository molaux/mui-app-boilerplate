import React, { useState, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import { BrowserRouter, Routes, Route, HashRouter } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client'
import { ThemeProvider } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Button } from '@mui/material'
import isElectron from 'is-electron'

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

const isElectronProd = isElectron() && process.env.NODE_ENV !== 'development'
const Router = isElectronProd
  ? HashRouter
  : BrowserRouter

let basePath = process.env.PUBLIC_URL
basePath = basePath.length > 0 && basePath[basePath.count - 1] === '/' ? basePath.substring(0, -1) : basePath
const uuid = generateUUID()

const ThemizedApp = ({ onNewToken, token, error, onDisconnect, updaterStatus }) => {
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
            <Router {...!isElectronProd ? { basename: basePath } : {}}>
              <CRUDFProvider>
                <Routes>
                  <Route path="*" element={<App module="home" onDisconnect={onDisconnect} updaterStatus={updaterStatus} />} />
                  <Route exact path="/:module" element={<App onDisconnect={onDisconnect} updaterStatus={updaterStatus} />} />
                </Routes>
              </CRUDFProvider>
            </Router>
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
  onDisconnect: PropTypes.func.isRequired,
  updaterStatus: PropTypes.string
}

ThemizedApp.defaultProps = {
  token: null,
  error: undefined,
  updaterStatus: null
}

const AuthenticatedApp = () => {
  const [token, setToken] = useState(window.localStorage.getItem('auth-token'))
  const [error, setError] = useState(null)
  const [updaterStatus, setUpdaterStatus] = useState(null)

  useEffect(() => {
    document.title = pkg.build.productName
  }, [])

  useEffect(() => {
    window.electron?.onMessage('checking-for-update', () => {
      setUpdaterStatus({ status: 'checking-for-update', message: 'Checking for updates...' })
    })

    window.electron?.onMessage('update-available', ({ payload }) => {
      setUpdaterStatus({ status: 'update-available', message: 'An update is available.' })
    })

    window.electron?.onMessage('update-not-available', ({ payload }) => {
      setUpdaterStatus({ status: 'update-not-available', message: 'Application is up to date.' })
    })

    window.electron?.onMessage('update-error', ({ payload }) => {
      setUpdaterStatus({ status: 'update-error', message: 'Sorry, an error occured during update...' })
    })

    window.electron?.onMessage('download-progress', ({ payload }) => {
      setUpdaterStatus({ status: 'download-progress', message: 'Downloading update...' })
    })

    window.electron?.onMessage('update-downloaded', ({ payload }) => {
      setUpdaterStatus({
        status: 'update-downloaded',
        message: (
          <>
            Update downloaded, You need to restart application to apply it : <Button onClick={() => window.electron?.sendMessage({ action: 'quit-and-update' })}>Restart and install</Button>
          </>
        )
      })
    })
  }, [setUpdaterStatus])

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
        ? <StyledLogin onNewToken={onNewToken} updaterStatus={updaterStatus} />
        : (
          <ConfigurationProvider>
            <ThemizedApp
              token={token}
              onNewToken={onNewToken}
              onDisconnect={onDisconnect}
              error={error}
              updaterStatus={updaterStatus}
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
