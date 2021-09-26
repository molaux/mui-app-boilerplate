import React, { Component } from 'react'
import PropTypes from 'prop-types'
import IconButton from '@mui/material/IconButton'
import AddIcon from '@mui/icons-material/AddCircle'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Slide from '@mui/material/Slide'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import SwipeableViews from 'react-swipeable-views'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'

import { withStyles } from '@mui/styles'

import { ResponsiveDialog, Tab, Tabs } from '@molaux/mui-utils'

import { AddReminder } from './AddReminder'
import { DLCUpdater } from '../dlc/DLCManager'

const Transition = React.forwardRef((props, ref) => <Slide direction="up" {...props} ref={ref} />)

function TabContainer ({ children, dir, ...props }) {
  return (
    <Typography component="div" dir={dir} {...props}>
      {children}
    </Typography>
  )
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired
}

class NotificationWizard extends Component {
  state = {
    dialogOpened: false,
    selectedTab: 0
  }

  componentDidMount () {
    const { tab } = this.props
    if (tab !== undefined) {
      this.setState({ selectedTab: tab })
    }
  }

  handleChangeTab (event, selectedTab) {
    this.setState({ selectedTab })
  }

  handleChangeTabIndex (index) {
    this.setState({ selectedTab: index > 1 ? 1 : index })
  }

  handleClickAdd () {
    this.setState((state) => ({ dialogOpened: !state.dialogOpened }))
  }

  handleClickCancel () {
    this.setState((state) => ({
      dialogOpened: false
    }))
  }

  render () {
    const { theme, classes } = this.props
    const { dialogOpened, selectedTab } = this.state
    return (
      <div>
        <Tooltip title="Ajouter un rappel ou une DLC">
          <IconButton
            color="inherit"
            key="b"
            aria-label="Add notification"
            aria-haspopup="true"
            onClick={() => this.handleClickAdd()}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
        <ResponsiveDialog
          open={dialogOpened}
          TransitionComponent={Transition}
        // disableEnforceFocus
        // disableAutoFocus
          keepMounted
          onClose={() => this.handleClickCancel()}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogContent className={classes.dialogContent}>
            <Tabs
              value={selectedTab}
              onChange={(event, tab) => this.handleChangeTab(event, tab)}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab label="Ajouter un rappel" />
              <Tab label="Ajouter des DLCs" />
            </Tabs>
            <SwipeableViews
              axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
              index={selectedTab}
              onChangeIndex={(index) => this.handleChangeTabIndex(index)}
            >

              <TabContainer dir={theme.direction} className={classes.tab}>
                <AddReminder onClose={() => this.handleClickCancel()} />
              </TabContainer>

              <TabContainer dir={theme.direction} className={classes.tab}>
                <Box>{selectedTab === 1
                  ? <DLCUpdater />
                  : null }
                </Box>
              </TabContainer>

            </SwipeableViews>
          </DialogContent>
          <DialogActions className={classes.dialogActions}>
            <Button onClick={() => this.handleClickCancel()} color="primary" className={classes.dialogActionButton}>
              Fermer
            </Button>

          </DialogActions>
        </ResponsiveDialog>
      </div>
    )
  }
}

NotificationWizard.propTypes = {
  tab: PropTypes.number,
  theme: PropTypes.shape({
    direction: PropTypes.string
  }).isRequired,
  classes: PropTypes.shape({
    dialogContent: PropTypes.string,
    tab: PropTypes.string,
    dialogActions: PropTypes.string,
    dialogActionButton: PropTypes.string
  }).isRequired
}

NotificationWizard.defaultProps = {
  tab: undefined
}

export default withStyles((theme) => ({
  dialogContent: {
    padding: theme.spacing(0.5),
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(2)
    }
  },
  dialogActions: {
    padding: theme.spacing(0.5),
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(1)
    }
  },
  dialogActionButton: {
    padding: theme.spacing(0.5),
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(1)
    }
  },
  root: {
    padding: theme.spacing(0),
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(1)
    }
  },
  img: {
    maxWidth: '100%'
  },
  tab: {
    padding: theme.spacing(1),
    [theme.breakpoints.up('md')]: {
      paddingTop: theme.spacing(2)
    }
  }
}), { withTheme: true })(NotificationWizard)
