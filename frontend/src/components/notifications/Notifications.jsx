import React, { lazy, Suspense } from 'react'
import PropTypes from 'prop-types'
import { klona } from 'klona/lite'

import NotificationsImportant from '@mui/icons-material/NotificationImportant'
import NotificationsIcon from '@mui/icons-material/Notifications'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import { Typography } from '@mui/material'

import { graphql } from '@apollo/client/react/hoc'
import { withStyles } from '@mui/styles'
import { subDays } from 'date-fns'
import { NOTIFICATIONS_QUERY, NOTIFICATIONS_SUBSCRIPTION } from './graphql'

const NotificationsDialog = lazy(() => import('./NotificationsDialog'))

const levelStyle = (props) => {
  switch (props.level) {
    case 'critical':
      return {
        color: props.pause
          ? props.theme.palette.secondary.main
          : props.theme.palette.error.main
      }
    case 'warning':
      return { color: props.theme.palette.warning.main }
    case 'info':
    case 'ok':
      return { color: props.theme.palette.success.main }
    default:
    case 'uknown':
      return { color: props.theme.palette.warning.main }
  }
}

const NotificationIcon = (props) => {
  const { icon, level, pause, theme } = props
  let Icon = icon
  switch (level) {
    case 'critical':
      Icon = Icon || NotificationsImportant
      return (
        <Icon style={{
          color: pause
            ? theme.palette.secondary.main
            : theme.palette.error.main
        }}
        />
      )
    case 'warning':
      Icon = Icon || NotificationsIcon
      return <Icon style={{ color: theme.palette.warning.main }} />
    case 'info':
    case 'ok':
      Icon = Icon || NotificationsNoneIcon
      return <Icon style={{ color: theme.palette.success.main }} />
    default:
    case 'uknown':
      Icon = Icon || NotificationsIcon
      return <Icon style={{ color: theme.palette.warning.main }} />
  }
}

NotificationIcon.propTypes = {
  icon: PropTypes.elementType,
  level: PropTypes.string,
  pause: PropTypes.bool,
  theme: PropTypes.shape({
    palette: PropTypes.shape({
      warning: PropTypes.shape({
        main: PropTypes.string
      }),
      success: PropTypes.shape({
        main: PropTypes.string
      }),
      secondary: PropTypes.shape({
        main: PropTypes.string
      }),
      error: PropTypes.shape({
        main: PropTypes.string
      })
    })
  }).isRequired
}

NotificationIcon.defaultProps = {
  level: 'info',
  pause: false,
  icon: undefined
}

const NotificationGroupTitle = ({ title, ...rest }) => (
  <Typography style={{ fontWeight: 'bold', ...levelStyle({ ...rest }) }}>
    {title}
  </Typography>
)

NotificationGroupTitle.propTypes = {
  title: PropTypes.string
}

NotificationGroupTitle.defaultProps = {
  title: ''
}

const notificationLevel = (now, n) => {
  const dueDate = dayFromDate(new Date(n.dueDate))
  if (dueDate <= now) {
    return 'critical'
  } if (subDays(dueDate, 7) <= now) {
    return 'warning'
  }
  return 'info'
}

const maxNotificationLevel = (level1, level2) => {
  if (level1 === 'critical' || level2 === 'critical') {
    return 'critical'
  }
  if (level1 === 'warning' || level2 === 'warning') {
    return 'warning'
  }
  if (level1 === 'unknown' || level2 === 'unknown') {
    return 'unknown'
  }
  if (level1 === 'info' || level2 === 'info') {
    return 'info'
  }
  return 'unknown'
}

const dayFromDate = (date) => {
  date.setHours(0, 0, 0, 0)
  return date
}
const wrapNotification = (dayDate, notification) => ({
  ...klona(notification),
  dueDate: dayFromDate(new Date(notification.dueDate)),
  level: notificationLevel(dayDate, notification)
})

class Notifications extends React.Component {
  state = {
    maxLevel: 'ok',
    notifications: [],
    unsubscribe: null,
    dialogOpen: false,
    dayDate: new Date((new Date()).setHours(0, 0, 0, 0))
  }

  componentWillUnmount () {
    const { unsubscribe } = this.state
    if (unsubscribe) {
      unsubscribe()
    }
  }

  handleCloseNotificationsDialog () {
    this.setState((state) => ({ dialogOpen: false }))
  }

  handleOpenNotificationsDialog () {
    this.setState((state) => ({ dialogOpen: true }))
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    const dayDate = new Date((new Date()).setHours(0, 0, 0, 0))
    let state = {}
    if (!nextProps.data.loading) {
      // We should subscribe to updates
      if (!prevState.unsubscribe) {
        state.unsubscribe = nextProps.data.subscribeToMore({
          document: NOTIFICATIONS_SUBSCRIPTION,
          updateQuery: (previousResult, { subscriptionData, variables }) => {
            const nextResult = {
              ...previousResult,
              Notifications: [...previousResult.Notifications]
            }

            // Perform updates on previousResult with subscriptionData
            if (['close', 'delete'].includes(subscriptionData.data.changedNotifications.action)) {
              nextResult.Notifications = previousResult.Notifications
                .filter(
                  (n) => n.notificationId !==
                    subscriptionData.data.changedNotifications.object.notificationId
                )
            } else if (['pause', 'update'].includes(subscriptionData.data.changedNotifications.action)) {
              nextResult.Notifications = previousResult.Notifications.map(
                (n) => (
                  n.notificationId ===
                    subscriptionData.data.changedNotifications.object.notificationId
                    ? subscriptionData.data.changedNotifications.object
                    : n
                )
              )
            } else if (subscriptionData.data.changedNotifications.action === 'create') {
              nextResult.Notifications
                .push(subscriptionData.data.changedNotifications.object)
            }

            return nextResult
          }
        })
      }

      state = {
        ...state,
        notifications:
          (nextProps.data?.Notifications?.map((n) => wrapNotification(dayDate, n)) || [])
            .sort((a, b) => a.dueDate - b.dueDate),
        dayDate
      }
      let maxLevel = 'info'
      maxLevel = state.notifications
        .reduce(
          (maxLevel, notification) => maxNotificationLevel(notification.level, maxLevel), maxLevel
        )
      state.maxLevel = maxLevel
    }

    return {
      ...prevState,
      ...state
    }
  }

  render () {
    const {
      className,
      theme,
      loading: queryLoading
    } = this.props

    const {
      notifications,
      maxLevel,
      dayDate,
      dialogOpen
    } = this.state

    const groups = notifications.reduce((groups, notification) => {
      if (!notification.pause) {
        groups[notification.level].notifications.push(notification)
      } else {
        groups.pause.notifications.push(notification)
      }
      return groups
    }, {
      pause: { label: (n) => `DLC${n > 1 ? 's' : ''} en pause`, level: 'critical', notifications: [] },
      critical: { label: (n) => `notification${n > 1 ? 's' : ''} critique${n > 1 ? 's' : ''}`, level: 'critical', notifications: [] },
      warning: { label: (n) => `notification${n > 1 ? 's' : ''} importante${n > 1 ? 's' : ''}`, level: 'warning', notifications: [] },
      unknown: { label: (n) => `notification${n > 1 ? 's' : ''} inconnue${n > 1 ? 's' : ''}`, level: 'unknown', notifications: [] },
      info: { label: (n) => `information${n > 1 ? 's' : ''}`, level: 'info', notifications: [] }
    })

    const nCriticals = groups.critical.notifications.length
    return (
      <div>
        <IconButton
          className={className}
          key="b"
          aria-label="More"
          aria-haspopup="true"
          style={{ color: theme.palette.common.white }}
          onClick={() => this.handleOpenNotificationsDialog()}
        >
          <Badge color="secondary" invisible={queryLoading || nCriticals === 0} badgeContent={queryLoading ? null : `${nCriticals}`}>
            <NotificationIcon level={maxLevel} theme={theme} normalColor="inherit" />
          </Badge>
        </IconButton>
        <Suspense fallback={null}>
          <NotificationsDialog
            dialogOpen={dialogOpen}
            dayDate={dayDate}
            notifications={notifications}
            onCLoseDialog={() => this.handleCloseNotificationsDialog()}
          />
        </Suspense>
      </div>
    )
  }
}

Notifications.propTypes = {
  data: NOTIFICATIONS_QUERY.propTypes.isRequired,
  classes: PropTypes.shape({
    level: PropTypes.string,
    chronobox: PropTypes.string
  }).isRequired,
  className: PropTypes.string,
  loading: PropTypes.bool,
  theme: PropTypes.shape({
    palette: PropTypes.shape({
      common: PropTypes.shape({
        white: PropTypes.string
      })
    }),
    spacing: PropTypes.func
  }).isRequired
}

Notifications.defaultProps = {
  className: '',
  loading: undefined
}

export default graphql(NOTIFICATIONS_QUERY, {
  pollInterval: 60 * 60 * 1000
})(withStyles({}, { withTheme: true })(Notifications))
