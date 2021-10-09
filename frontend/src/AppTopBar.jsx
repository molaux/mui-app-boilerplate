import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@mui/styles'

import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Hidden from '@mui/material/Hidden'
import AppBar from '@mui/material/AppBar'
import MinimizeIcon from '@mui/icons-material/Minimize'
import MaximizeIcon from '@mui/icons-material/Maximize'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import isElectron from 'is-electron'

// import Notifications from './components/notifications/Notifications'
import BugReport from './ui/BugReport'
import pkg from '../package.json'
import icon from './ui/logo.svg'

class AppTopBar extends Component {
  state = {
    showFilters: false
  }

  handleShowFilters = (event) => {
    this.setState((state) => ({ showFilters: !state.showFilters }))
  }

  render () {
    const { classes, theme } = this.props
    return (
      <AppBar position="fixed" className={classes.appBarRoot}>
        <Toolbar className={classes.toolbar}>
          <BugReport />
          {/* <Notifications className={classes.notificationIcon} /> */}
          <Hidden smDown implementation="css">
            <div>
              <Typography className={classes.title} variant="h6" color="inherit" noWrap>
                <img width={32} src={icon} alt="logo" style={{ verticalAlign: 'middle', marginRight: '0.5em', marginTop: '-0.2em', color: 'white' }} />
                {pkg.build.productName}
              </Typography>
            </div>
          </Hidden>
          <div className={classes.grow} />
          {isElectron() && (process.env.REACT_APP_DESKTOP_FRAMED || 'no') === 'no'
            ? (
              <Box style={{
                display: 'block',
                textAlign: 'right'
              }}
              >

                <IconButton
                  aria-label="Minimize"
                  aria-haspopup="true"
                  style={{ color: theme.palette.common.white, WebkitAppRegion: 'no-drag', margin: theme.spacing(1) }}
                  onClick={() => window.electronRemote.getCurrentWindow().minimize()}
                  size="small"
                >
                  <MinimizeIcon />
                </IconButton>
                <IconButton
                  aria-label="Maximize"
                  aria-haspopup="true"
                  style={{ color: theme.palette.common.white, WebkitAppRegion: 'no-drag', margin: theme.spacing(1) }}
                  onClick={() => {
                    const win = window.electronRemote.getCurrentWindow()
                    win.isMaximized() ? win.unmaximize() : win.maximize()
                  }}
                  size="small"
                >
                  <MaximizeIcon />
                </IconButton>
                <IconButton
                  aria-label="Close"
                  aria-haspopup="true"
                  style={{ color: theme.palette.common.white, WebkitAppRegion: 'no-drag', margin: theme.spacing(1) }}
                  onClick={() => window.electronRemote.getCurrentWindow().close()}
                  size="small"
                >
                  <CloseIcon />
                </IconButton>
              </Box>
              )
            : null}
        </Toolbar>
      </AppBar>
    )
  }
}

AppTopBar.propTypes = {
  classes: PropTypes.shape({
    notificationIcon: PropTypes.string,
    appBarRoot: PropTypes.string,
    toolbar: PropTypes.string,
    title: PropTypes.string,
    grow: PropTypes.string,
    subTitle: PropTypes.string
  }).isRequired,
  theme: PropTypes.shape({
    palette: PropTypes.shape({
      common: PropTypes.shape({
        white: PropTypes.string
      })
    }),
    spacing: PropTypes.func
  }).isRequired
}

export default withStyles((theme) => ({
  toolbar: {
    WebkitUserSelect: 'none',
    ...((process.env.REACT_APP_DESKTOP_FRAMED || 'no') === 'no'
      ? {
          WebkitAppRegion: 'drag',
          '& > *': {
            WebkitAppRegion: 'no-drag'
          }
        }
      : {}
    )
  },
  appBarRoot: {
    width: '100%',
    zIndex: theme.zIndex.drawer + 1
  },
  grow: {
    flexGrow: 1
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block'
    }
  },
  notificationIcon: {
    marginRight: theme.spacing(1)
  }
}), { withTheme: true })(AppTopBar)
