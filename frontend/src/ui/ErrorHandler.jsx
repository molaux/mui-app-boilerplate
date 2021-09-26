import React from 'react'
import PropTypes from 'prop-types'

import ErrorIcon from '@mui/icons-material/Error'
import RefreshIcon from '@mui/icons-material/Refresh'
import { ThemeProvider } from '@mui/material/styles'
import { withStyles } from '@mui/styles'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'

import { Center } from '@molaux/mui-utils'

import { darkTheme } from './theme'
import SadAnimationIcon from './SadAnimationIcon'
import SunIcon from './SunIcon'

class ErrorHandler extends React.Component {
  constructor (props) {
    super(props)
    this.state = { error: null }
  }

  componentDidCatch (error, info) {
    // Affiche une UI de repli
    this.setState({ error })
  }

  render () {
    const { error } = this.state
    const { error: apolloError, classes, children } = this.props

    if (error) {
      return (
        <Center classes={{ paper: classes.root }}>
          <h1><SadAnimationIcon width="35%" style={{ float: 'right', margin: '0.5em' }} /><ErrorIcon className={classes.icon} fontSize="large" /> Oups ! </h1>

          <p>Quelque chose s&apos;est mal passé :</p>
          <ul>
            <li>la connexion réseau est coupée ou insuffisante ?</li>
            <li>vous êtes victime d&apos;une erreur de programmation ?</li>
            <li>votre terminal a un problème ?</li>
          </ul>
          <p>Le{apolloError ? 's' : null} message{apolloError ? 's' : null} associé{apolloError ? 's' : null} à cette erreur {apolloError ? 'sont' : 'est'} le{apolloError ? 's' : null} suivant{apolloError ? 's' : null} :</p>
          <ThemeProvider theme={darkTheme}>
            <Paper className={classes.codeBlock}>
              <p className={classes.code}>{error.message}</p>
              <Typography variant="caption" display="block" className={classes.caption}>
                React
              </Typography>
            </Paper>
            { apolloError
              ? (
                <Paper className={classes.codeBlock}>
                  <p className={classes.code}>{apolloError.message}</p>
                  <Typography variant="caption" display="block" className={classes.caption}>
                    Apollo
                  </Typography>
                </Paper>
                )
              : null }
          </ThemeProvider>
          <p>
            Vous pouvez toujours essayez de recharger l&apos;application pour repartir de zéro :
          </p>
          <Button
            color="secondary"
            className={classes.button}
            startIcon={<RefreshIcon />}
            onClick={() => document.location.reload()}
          >
            Recharger l&apos;application
          </Button>
          <p>
            Si le problème persiste, merci de faire remonter les informations ci-dessus,
            ainsi que tout élément pouvant permettre d&apos;identifier le défaut.
          </p>
          <p>Avec mes plus plates excuses (si applicables),</p>
          <p>Marc<SunIcon style={{ fontSize: '0.80em', marginLeft: '0em', marginBottom: '-0.18em' }} /></p>
        </Center>
      )
    }
    return children
  }
}

ErrorHandler.propTypes = {
  classes: PropTypes.shape({
    button: PropTypes.string,
    icon: PropTypes.string,
    root: PropTypes.string,
    caption: PropTypes.string,
    codeBlock: PropTypes.string,
    message: PropTypes.string,
    code: PropTypes.string
  }).isRequired,
  error: PropTypes.shape({
    message: PropTypes.string
  }),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
}

ErrorHandler.defaultProps = {
  error: undefined,
  children: null
}

export default withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    maxWidth: theme.spacing(70),
    '& > p': {
      marginTop: theme.spacing(2)
    },
    [theme.breakpoints.down('sm')]: {
      maxWidth: theme.spacing(150),
      padding: theme.spacing(6)
    }
  },
  code: {
    padding: theme.spacing(2),
    margin: 0,
    fontFamily: 'monospace'
  },
  caption: {
    padding: theme.spacing(0.5),
    paddingRight: theme.spacing(1),
    textAlign: 'right',
    backgroundColor: theme.palette.warning.main
  },
  icon: {
    color: theme.palette.error.main
  },
  codeBlock: {
    overflow: 'hidden',
    marginTop: theme.spacing(2)
  },
  button: {

  }
}))(ErrorHandler)
