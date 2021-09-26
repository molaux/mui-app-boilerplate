import React from 'react'
import PropTypes from 'prop-types'

import NotificationsImportant from '@mui/icons-material/NotificationImportant'
import NotificationsIcon from '@mui/icons-material/Notifications'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import AlarmIcon from '@mui/icons-material/Alarm'
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline'
import NoteIcon from '@mui/icons-material/Note'
import { Typography } from '@mui/material'

import { withStyles } from '@mui/styles'
import { differenceInDays, format } from 'date-fns'

import { ExpandableListItem, FullScreenDialog } from '@molaux/mui-utils'

import { withProductDialog } from '../catalog/ProductDialogContext'
import { withSearch } from '../search/Search'
import { ShowReminder } from './ShowReminder'
import BarcodeReminder from './BarcodeReminder'
import NotificationWizard from './NotificationWizard'
import parseElasticResults from '../../utils/elasticParser'
import DlcNotification from '../dlc/DlcNotification'
import { ChronoBox } from '../../ui/ChronoBox'
import BarcodeIcon from '../../ui/BarcodeIcon'

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

class NotificationsDialog extends React.Component {
  async handleClickNotification (notification, showProductDialog) {
    const { searchContext } = this.props
    if (notification.type === 'dlc' || (notification.type === 'reminder' && notification.subType === 'missing-barcode')) {
      const response = await searchContext.elasticClient.search({
        index: process.env.REACT_APP_ELASTIC_REFERENCES_INDEX,
        body: {
          query: {
            simple_query_string: {
              query: `${notification.article.id}`,
              fields: ['magic.chrono']
            }
          }
        }
      })
      const set = parseElasticResults(response)
      if (set.results.length) {
        showProductDialog(set.results[0], notification.type === 'dlc' ? 2 : 0)
      }
    } else {
      this.onShowReminder(notification)
    }
  }

  render () {
    const {
      classes,
      theme,
      loading: queryLoading,
      showProductDialog,
      notifications,
      dayDate,
      dialogOpen,
      onCLoseDialog
    } = this.props

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

    return (
      <FullScreenDialog
        key="d"
        primary={queryLoading ? 'Notifications' : `${notifications.length} notification${notifications.length > 1 ? 's' : ''}`}
        actions={[<NotificationWizard key="nw" />]}
        open={dialogOpen}
        onClose={() => onCLoseDialog()}
      >
        {Object.keys(groups).map((groupKey) => (groups[groupKey].notifications.length
          ? (
            <ExpandableListItem
              key={groups[groupKey].label}
              title={(
                <NotificationGroupTitle
                  title={`${groups[groupKey].notifications.length} ${groups[groupKey].label(groups[groupKey].notifications.length)}`}
                  level={groups[groupKey].level}
                  pause={groupKey === 'pause'}
                  theme={theme}
                  normalColor="primary"
                />
  )}
              icons={[
                <NotificationIcon
                  key="state-icon"
                  level={groups[groupKey].level}
                  pause={groupKey === 'pause'}
                  theme={theme}
                  normalColor="primary"
                />
              ]}
            >
              { groups[groupKey].notifications.length
                ? groups[groupKey].notifications.map((notification) => {
                  const daysLeft = differenceInDays(notification.dueDate, dayDate)
                  return (
                    <ExpandableListItem
                      key={notification.notificationId}
                      title={notification.type === 'dlc'
                        ? (
                          <>
                            <ChronoBox
                              chrono={notification.article.id}
                              classes={{ root: classes.chronobox }}
                            />
                            {notification.article.designArt}
                          </>
                          )
                        : notification.type === 'reminder' && notification.subType === 'missing-barcode'
                          ? (
                            <>
                              <ChronoBox
                                chrono={notification.article.id}
                                classes={{ root: classes.chronobox }}
                              />
                              {notification.title}
                            </>
                            )
                          : notification.title}
                      subTitle={notification.pause
                        ? 'En attente...'
                        : format(notification.dueDate, 'dd/MM/y')}
                      states={notification.pause
                        ? <div className={`${classes.level} pause`}>Pause</div>
                        : <div className={`${classes.level} ${notification.level}`}>{daysLeft} jour{daysLeft > 1 || daysLeft < -1 ? 's' : null}</div>}
                      icons={[
                        <NotificationIcon
                          key="state-icon"
                          level={notification.level}
                          pause={notification.pause}
                          theme={theme}
                          normalColor="primary"
                          icon={(props) => (notification.type === 'dlc'
                            ? notification.pause
                              ? <PauseCircleOutlineIcon {...props} color="secondary" style={{ ...props.style || {}, margin: theme.spacing(1) }} key="type-icon" />
                              : <AlarmIcon {...props} style={{ ...props.style || {}, margin: theme.spacing(1) }} key="type-icon" />
                            : notification.type === 'reminder' && notification.subType === 'missing-barcode'
                              ? <BarcodeIcon {...props} style={{ ...props.style || {}, margin: theme.spacing(1) }} key="type-icon" />
                              : <NoteIcon {...props} style={{ ...props.style || {}, margin: theme.spacing(1) }} key="type-icon" />)}
                        />
                      ]}
                    >
                      {notification.type === 'reminder'
                        ? notification.subType === 'missing-barcode'
                          ? (
                            <BarcodeReminder
                              notification={notification}
                              onClickViewProduct={() => this.handleClickNotification(
                                { ...notification },
                                showProductDialog
                              )}
                            />
                            )
                          : <ShowReminder reminder={notification} />
                        : (
                          <DlcNotification
                            notification={notification}
                            onClickViewProduct={() => this.handleClickNotification(
                              { ...notification },
                              showProductDialog
                            )}
                          />
                          )}
                    </ExpandableListItem>
                  )
                })
                : 'Aucune notification'}
            </ExpandableListItem>
            )
          : null))}
      </FullScreenDialog>
    )
  }
}

NotificationsDialog.propTypes = {
  notifications: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  dayDate: PropTypes.instanceOf(Date).isRequired,
  dialogOpen: PropTypes.bool.isRequired,
  onCLoseDialog: PropTypes.func.isRequired,
  searchContext: PropTypes.shape({
    elasticClient: PropTypes.shape({
      search: PropTypes.func
    })
  }).isRequired,
  classes: PropTypes.shape({
    level: PropTypes.string,
    chronobox: PropTypes.string
  }).isRequired,
  className: PropTypes.string,
  loading: PropTypes.bool,
  showProductDialog: PropTypes.func,
  theme: PropTypes.shape({
    palette: PropTypes.shape({
      common: PropTypes.shape({
        white: PropTypes.string
      })
    }),
    spacing: PropTypes.func
  }).isRequired
}

NotificationsDialog.defaultProps = {
  className: '',
  loading: undefined,
  showProductDialog: () => null
}

export default withStyles((theme) => ({
  fab: {
    margin: theme.spacing(1),
    color: theme.palette.common.white,
    width: '36px',
    height: '36px',
    fontSize: '0.9em'
  },
  chronobox: {
    height: '1.2em',
    marginRight: '0.5em',
    marginTop: '-0.1em',
    varticalAlign: 'baseline',
    '& > span': {
      padding: '0 0.4em'
    }
  },
  level: {
    ...theme.typography.button,
    backgroundColor: theme.palette.grey,
    padding: theme.spacing(0.5),
    borderRadius: '0.5em',
    whiteSpace: 'nowrap',
    color: theme.palette.common.white,
    '&.pause': {
      backgroundColor: theme.palette.secondary.main
    },
    '&.critical': {
      backgroundColor: theme.palette.error.main
    },
    '&.warning': {
      backgroundColor: theme.palette.warning.main
    },
    '&.info': {
      backgroundColor: theme.palette.success.main
    }
  }
}), { withTheme: true })(withProductDialog(withSearch(NotificationsDialog)))
