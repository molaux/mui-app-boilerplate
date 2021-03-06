/**
 *  @fileOverview Here is the start of application
 *
 *  @author       Marc-Olivier Laux
 */

import React, { useCallback, useEffect, useContext, useState, Suspense, lazy } from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import 'typeface-roboto'
import Hidden from '@mui/material/Hidden'
import { withStyles } from '@mui/styles'
import PropTypes from 'prop-types'
import CircularProgress from '@mui/material/CircularProgress'

import { CRUDFContext } from '@molaux/mui-crudf'
import { Center } from '@molaux/mui-utils'

import AppLoadingAnimation from './ui/AppLoadingAnimation'

import Greetings from './components/home/Greetings'
import AppTopBar from './AppTopBar'
import { AppDesktopMenu, AppMobileMenu } from './AppMenu'

import { ProfileContext } from './components/login/Context'

import { withRouter } from './utils/router'

import { requiredPropsCheck } from './utils/props'
import UserIntrospection from './introspections/User.json'
import GroupIntrospection from './introspections/Group.json'
import PermissionIntrospection from './introspections/Permission.json'
import AddressIntrospection from './introspections/Address.json'

import './App.css'

const Configuration = lazy(() => import('./components/configuration/Configuration'))
const Bookmarks = lazy(() => import('./components/bookmarks/Bookmarks'))

const AppContent = ({ classes, match, module, onLoaded, updaterStatus }) => (
  module === 'bookmarks' || match.params.module === 'bookmarks'
    ? <Bookmarks className={classes.content} />
    : module === 'configuration' || match.params.module === 'configuration'
      ? <Configuration className={classes.content} />
      : (
        <Greetings
          className={classes.content}
          onLoaded={onLoaded}
          updaterStatus={updaterStatus}
        />
        )
)

AppContent.propTypes = {
  module: requiredPropsCheck(['module', 'match']),
  match: requiredPropsCheck(['module', 'match']),
  updaterStatus: PropTypes.string,
  onLoaded: PropTypes.func,
  classes: PropTypes.shape({
    content: PropTypes.string
  })
}

AppContent.defaultProps = {
  module: undefined,
  match: undefined,
  updaterStatus: null,
  onLoaded: () => {},
  classes: {
    root: null
  }
}

/**
 * Main application entry point
 */
const App = ({ classes, module, onDisconnect, match, updaterStatus }) => {
  const [initialLoad, setInitialLoad] = useState(true)
  const { profile } = useContext(ProfileContext)

  /**
   * handle an initialLoad flag in order to manage loader
   */
  const onLoaded = useCallback(() => {
    setInitialLoad(false)
  }, [setInitialLoad])

  useEffect(
    () => setInitialLoad(initialLoad && (module === 'home' || match.params.module === 'home')),
    [module, match.params.module, setInitialLoad]
  )

  const { registerIntrospection } = useContext(CRUDFContext)

  useEffect(() => {
    registerIntrospection(UserIntrospection)
    registerIntrospection(GroupIntrospection)
    registerIntrospection(PermissionIntrospection)
    registerIntrospection(AddressIntrospection)
  }, [])

  return (
    <>
      {profile
        ? (
          <>
            <div className={classes.root}>
              <CssBaseline />
              <AppTopBar />
              <Hidden mdDown>
                <AppDesktopMenu module={module} onDisconnect={onDisconnect} />
              </Hidden>
              <Suspense fallback={<Center><CircularProgress color="secondary" /></Center>}>
                <AppContent
                  classes={classes}
                  module={module}
                  onDisconnect={onDisconnect}
                  match={match}
                  onLoaded={onLoaded}
                  updaterStatus={updaterStatus}
                />
              </Suspense>
            </div>
            <Hidden mdUp>
              <AppMobileMenu module={module} onDisconnect={onDisconnect} />
            </Hidden>
          </>
          )
        : null}
      <AppLoadingAnimation open={initialLoad || !profile} />
    </>
  )
}

App.propTypes = {
  module: requiredPropsCheck(['module', 'match']),
  match: requiredPropsCheck(['module', 'match']),
  onDisconnect: PropTypes.func,
  updaterStatus: PropTypes.string,
  classes: PropTypes.shape({
    root: PropTypes.string
  })
}

App.defaultProps = {
  module: undefined,
  match: undefined,
  updaterStatus: null,
  onDisconnect: () => {},
  classes: {
    root: null
  }
}

export default withRouter(withStyles((theme) => ({
  root: {
    display: 'flex',
    flex: 1,
    minWidth: '0px',
    height: '100%',
    width: '100%',
    maxWidth: '100%',
    paddingTop: '4.5em',
    paddingBottom: '1em',
    overflowX: 'hidden'
  },
  content: {
    flexGrow: 0,
    flexShrink: 1,
    overflow: 'hidden',
    padding: theme.spacing(3),
    flexBasis: '100%',
    display: 'block',
    [theme.breakpoints.down('md')]: {
      maxWidth: '100%',
      padding: theme.spacing(12, 6, 18, 6)
    }
  }
}), { withTheme: true })(App))
