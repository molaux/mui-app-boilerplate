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
import Link from '@mui/material/Link'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'

import { gql } from '@apollo/client'
import { Mutation, Query } from '@apollo/client/react/components'
import { withStyles } from '@mui/styles'

const Transition = React.forwardRef((props, ref) => <Slide direction="up" {...props} ref={ref} />)

const REPORT_MUTATION = gql`
mutation createTicket($referer: String!, $message: String!) {
  createTicket(referer: $referer, message: $message)
}`

// const PROJECT_MANAGEMENT_QUERY = gql`query {
//   projectManagementSystemInfos {
//     url
//     name
//   }
// }`

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
      <Tooltip title="Signaler un problème, une amélioration ou participer" key="bug-report">
        <IconButton
          color="inherit"
          aria-label="Report bug"
          aria-haspopup="true"
            // style={{color:this.props.theme.palette.common.white}}
          onClick={() => this.handleToggleReportDialog()}
        >
          <BugReportIcon />
        </IconButton>
      </Tooltip>,
      // <Query
      //   query={PROJECT_MANAGEMENT_QUERY}
      //   pollInterval={1000 * 60 * 59}
      //   fetchPolicy="network-only"
      //   key="bug-report-query"
      // >
      //   {({ data: projectManagementData, loading: projectManagementLoading }) => (
          <Mutation mutation={REPORT_MUTATION}>
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
                  Rapporter un problème ou une amélioration
                </DialogTitle>
                <DialogContent>
                  {/* <Typography variant="subtitle2">
                    Retour engagé
                  </Typography>
                  {!projectManagementLoading && projectManagementData
                    ? (
                      <>
                        <Typography>
                          Vous pouvez accéder au système de gestion
                          de projet «{projectManagementData.projectManagementSystemInfos.name}»,
                          un compte vous y sera créé automatiquement. Vous pourrez rapporter et
                          suivre des problèmes ou des pistes d&apos;amélioration, et plus
                          généralement participer à son évolution.
                        </Typography>
                        <br />
                        <Typography>
                          <Link
                            href={projectManagementData.projectManagementSystemInfos.url}
                            target="_blank"
                            rel="noopener"
                          >
                            Accéder à mon compte
                            «{projectManagementData.projectManagementSystemInfos.name}»
                            <OpenInNewIcon sx={{ fontSize: '1em', marginBottom: '0.2em' }} />
                          </Link>
                        </Typography>
                        <br />
                        <Typography>
                          Notez que Gitlab est un projet tiers : c&apos;est un système puissant de
                          suivi de projet, mais son utilisation peut être déroutante.
                          Pour visualiser les projets qui vous intéressent, allez dans «Projets»
                          (dans le coin supérieur gauche) puis cliquez sur «Explorer les projets».
                          Le projet correspondant à cette application s&apos;intitule «Shop App».
                          Les «Tickets» permettent de signaler des problèmes, des amélioration ou
                          simplement de poser des questions. Chaque ticket ouvre un fil
                          de discussion qui permet des échanges sur le sujet souhaité.
                        </Typography>
                        <br />
                      </>
                      )
                    : null} */}
                  <Typography variant="subtitle2">
                    Message rapide
                  </Typography>
                  <Typography>
                    Vous pouvez aussi envoyer un message au responsable du projet.
                    Vous ne bénificierez d&apos;aucun suivi.
                  </Typography>
                  <br />
                  <Typography>
                    Précisez votre problème ou amélioration ci-dessous :
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
                    Annuler
                  </Button>
                  <Button disabled={loading} onClick={() => this.handleSendReport(createTicket)} color="primary">
                    <SendIcon />
                  </Button>
                </DialogActions>
              </Dialog>

            )}
          </Mutation>
      //   )}
      // </Query>
    ]
  }
}

BugReport.propTypes = {
  classes: PropTypes.shape({
    textField: PropTypes.string
  }).isRequired
}

export default /* withApollo */(withStyles((theme) => ({
}), { withTheme: true })(BugReport))
