/* eslint-disable no-console */
import React, { useState, useEffect, useCallback } from 'react'
import { ApolloProvider } from '@apollo/client'
import { ThemeProvider } from '@mui/material/styles'
import { PropTypes } from 'prop-types'
// import useMediaQuery from '@mui/material/useMediaQuery'

// V5 temporary migration fix
import StyledEngineProvider from '@mui/material/StyledEngineProvider'

import { v4 as generateUUID } from 'uuid'
// import pkg from '../package.json'
import buildApolloClient from './apollo'
import { lightThemeDense as denseTheme } from './ui/theme'
import ErrorHandler from './ui/ErrorHandler'
import ContentApp from './ContentApp'
import { ProfileProvider } from './components/login/Context'

const uuid = generateUUID()

const ProfiledApp = ({ url, onDisconnect, linkEl }) => {
  try {
    return (
      <ProfileProvider disconnect={onDisconnect}>
        <ContentApp url={url} linkEl={linkEl} />
      </ProfileProvider>
    )
  } catch (e) {
    console.log('err', e)
  }
  return null
}

ProfiledApp.propTypes = {
  url: PropTypes.string.isRequired,
  linkEl: PropTypes.instanceOf(window.Element).isRequired,
  onDisconnect: PropTypes.func.isRequired
}

function Content ({ url, linkEl }) {
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
    setApolloClient(buildApolloClient(message?.token || null, uuid, onError))
    setToken(message?.token || null)
  }, [setApolloClient, buildApolloClient, setToken])

  useEffect(() => {
    if (!token) {
      // eslint-disable-next-line no-undef
      browser.runtime.sendMessage({
        ask: 'token'
      })
        .then(onNewToken)
        .catch((err) => console.error('Message answer error', err))
    }
    // eslint-disable-next-line no-undef
    browser.runtime.onMessage.addListener(onNewToken)
    // eslint-disable-next-line no-undef
    return () => browser.runtime.onMessage.removeListener(onNewToken)
  }, [onNewToken, token])

  // const isMobile = useMediaQuery(normalTheme.breakpoints.down('sm'))
  try {
    return (
      <ThemeProvider theme={denseTheme}>
        <StyledEngineProvider injectFirst>
          <ErrorHandler error={error}>
            <ApolloProvider client={apolloClient}>
              { !token
                ? 'NOT AUTHENTICATED'
                : <ProfiledApp onDisconnect={onDisconnect} url={url} linkEl={linkEl} />}
            </ApolloProvider>
          </ErrorHandler>
        </StyledEngineProvider>
      </ThemeProvider>
    )
  } catch (e) {
    console.log('err', e)
  }
}

Content.propTypes = {
  url: PropTypes.string.isRequired,
  linkEl: PropTypes.instanceOf(window.Element).isRequired
}

export default Content
