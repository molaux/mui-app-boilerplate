import React from 'react'
import PropTypes from 'prop-types'

import { Mutation } from '@apollo/client/react/components'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import Dialog from '@mui/material/Dialog'
import { Paper } from '@mui/material'
import Slide from '@mui/material/Slide'
import { withStyles } from '@mui/styles'
import Button from '@mui/material/Button'
import DeleteIcon from '@mui/icons-material/Delete'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

import { DELETE_REMINDER, CLOSE_REMINDER } from './graphql'

const styles = (theme) => ({
  messageContent: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(7),
    paddingRight: theme.spacing(2)
  },
  toolbarEntry: {
    marginRight: theme.spacing(1)
  },
  toolbar: {
    flexGrow: 1,
    justifyContent: 'flex-end'
  },
  leftIcon: {
    marginRight: theme.spacing(1)
  }
})

const Transition = React.forwardRef((props, ref) => <Slide direction="up" {...props} ref={ref} />)

class ShowReminderComponent extends React.Component {
  state = {
    confirmationOpened: false,
    confirmationContext: null
  }

  handleConfirmDeleteReminder (deleteReminder, id) {
    this.setState({
      confirmationOpened: true,
      confirmationContext: {
        callback: async () => {
          await deleteReminder({ variables: { id } })
        }
      }
    })
  }

  handleConfirmCloseReminder (closeReminder, id) {
    this.setState({
      confirmationOpened: true,
      confirmationContext: {
        callback: async () => {
          await closeReminder({ variables: { id } })
        }
      }
    })
  }

  handleCancelConfirmation () {
    this.setState({
      confirmationOpened: false,
      confirmationContext: null
    })
  }

  handleConfirmConfirmation () {
    const { confirmationContext } = this.state
    if (confirmationContext) {
      confirmationContext.callback()
      this.setState({
        confirmationOpened: false,
        confirmationContext: null
      })
    }
  }

  render () {
    const { reminder, classes } = this.props
    const { confirmationOpened, confirmationContext } = this.state
    return [
      <Paper elevation={0} square key="content" classes={{ root: classes.messageContent }}>
        <Typography variant="body2">{reminder.message}</Typography>
      </Paper>,
      <Toolbar key="toolbar" classes={{ root: classes.toolbar }}>
        <Mutation mutation={DELETE_REMINDER}>
          {(deleteReminder, { loading }) => (
            <Tooltip title="Supprimer">
              <IconButton
                aria-label="Supprimer"
                aria-haspopup="true"
                variant="outlined"
                color="secondary"
                className={classes.toolbarEntry}
                onClick={() => this.handleConfirmDeleteReminder(
                  deleteReminder, reminder.notificationId
                )}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
        </Mutation>
        <Mutation mutation={CLOSE_REMINDER}>
          {(closeReminder) => (
            <Tooltip title="Clore">
              <IconButton
                aria-label="Clore"
                aria-haspopup="true"
                variant="outlined"
                color="primary"
                className={classes.toolbarEntry}
                onClick={() => this.handleConfirmCloseReminder(
                  closeReminder, reminder.notificationId
                )}
              >
                <CloseIcon />
              </IconButton>
            </Tooltip>
          )}
        </Mutation>
      </Toolbar>,
      <Dialog
        open={confirmationOpened}
        TransitionComponent={Transition}
        key="confirmation"
        keepMounted
        onClose={() => this.handleCancelConfirmation()}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {(confirmationContext && confirmationContext.text) || 'Vraiment ?'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.handleCancelConfirmation()} color="primary">
            Annuler
          </Button>
          <Button onClick={() => this.handleConfirmConfirmation()} color="primary">
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    ]
  }
}

ShowReminderComponent.propTypes = {
  classes: PropTypes.shape({
    messageContent: PropTypes.string,
    datetimePicker: PropTypes.string,
    toolbarEntry: PropTypes.string,
    toolbar: PropTypes.string,
    leftIcon: PropTypes.string
  }).isRequired,
  reminder: PropTypes.shape({
    message: PropTypes.string,
    notificationId: PropTypes.string
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

export const ShowReminder = withStyles(styles, { withTheme: true })(ShowReminderComponent)

export default ShowReminder
