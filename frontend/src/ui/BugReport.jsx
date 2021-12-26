import React from 'react'
import PropTypes from 'prop-types'
import BugReportIcon from '@mui/icons-material/BugReport'
import SendIcon from '@mui/icons-material/Send'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Slide from '@mui/material/Slide'
import TextField from '@mui/material/TextField'

import { gql } from '@apollo/client'
import { Mutation } from '@apollo/client/react/components'
import { withStyles } from '@mui/styles'

const Transition = React.forwardRef((props, ref) => <Slide direction="up" {...props} ref={ref} />)

const REPORT_MUTATION = gql`
mutation createTicket($referer: String!, $message: String!) {
  createTicket(referer: $referer, message: $message)
}`

class BugReport extends React.Component {
  state = {
    dialogOpen: false,
    message: ''
  }

  handleToggleReportDialog () {
    this.setState((state) => ({ dialogOpen: !state.dialogOpen }))
  }

  async handleSendReport (createTicket) {
    const { message } = this.state
    await createTicket({
      variables: {
        referer: window.location.href,
        message
      }
    })
    this.setState(() => ({
      dialogOpen: false,
      message: ''
    }))
  }

  handleChangeMessage (event) {
    this.setState({ message: event.target.value })
  }

  render () {
    const { classes } = this.props
    const { dialogOpen, message } = this.state
    return [
      <Tooltip title="Report a bug or an enhancement" key="bug-report">
        <IconButton
          color="inherit"
          aria-label="Report bug"
          aria-haspopup="true"
          onClick={() => this.handleToggleReportDialog()}
        >
          <BugReportIcon />
        </IconButton>
      </Tooltip>,
      <Mutation mutation={REPORT_MUTATION} key="mutation">
        {(createTicket, { data, loading }) => (
          <Dialog
            open={dialogOpen}
            TransitionComponent={Transition}
            keepMounted
            onClose={() => this.handleToggleReportDialog()}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle id="alert-dialog-slide-title">
              Report a problem or an enhancement
            </DialogTitle>
            <DialogContent>
              <Typography>
                Describe your problem here :
              </Typography>
              <TextField
                id="standard-multiline-flexible"
                label="Message"
                multiline
                rows={3}
                value={message}
                style={{ width: '100%' }}
                onChange={(event) => this.handleChangeMessage(event)}
                className={classes.textField}
                margin="normal"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.handleToggleReportDialog()} color="primary">
                Cancel
              </Button>
              <Button disabled={loading} onClick={() => this.handleSendReport(createTicket)} color="primary">
                <SendIcon />
              </Button>
            </DialogActions>
          </Dialog>

        )}
      </Mutation>
    ]
  }
}

BugReport.propTypes = {
  classes: PropTypes.shape({
    textField: PropTypes.string
  }).isRequired
}

export default withStyles((theme) => ({
}), { withTheme: true })(BugReport)
