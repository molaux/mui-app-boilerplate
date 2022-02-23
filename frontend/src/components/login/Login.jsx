import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography
} from '@mui/material'

import { ThemeProvider } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'
import { useMutation, gql } from '@apollo/client'
import StyledEngineProvider from '@mui/material/StyledEngineProvider'

import { ReactComponent as Logo } from '../../ui/logo.svg'

import pkg from '../../../package.json'

import { reversedTheme as theme } from '../../ui/theme'

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.palette.background.default
  },
  form: {
    display: 'flex',
    '& > *': {
      marginTop: theme.spacing(2)
    }
  }
}))

const LOGIN = gql`
  mutation Login($login: String!, $password: String!) {
    login(login: $login, password: $password)
  }
`

export const Login = ({ onNewToken, updaterStatus }) => {
  const [uid, setUid] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [login, { loading }] = useMutation(LOGIN, {
    onError: (e) => {
      setError('Something went wrong...')
    }
  })
  const classes = useStyles()
  const onConfirm = async () => {
    let token = null
    try {
      token = (await login({
        variables: {
          login: uid,
          password
        }
      }))?.data.login
      if (token) {
        setError(null)
        if (onNewToken) {
          onNewToken(token)
        }
      }
    } catch (e) {
      setError('Something went wrong...')
    }
  }

  const ready = !(loading || password.length === 0 || uid.length === 0)

  return (
    <Grid
      container
      className={classes.container}
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: '100vh' }}
    >
      <Grid item xs={9} sm={3}>
        <Grid
          container
          className={classes.form}
          direction="column"
        >
          <Box style={{ textAlign: 'center', fontSize: '1.5em' }}>
            <Logo height="2em" width="2em" style={{ marginBottom: '-0.5em', marginRight: theme.spacing(1) }} />
            <span style={{ color: 'white' }}>{pkg.build.productName}</span>
          </Box>
          <TextField
            error={error !== null}
            required
            id="mui-admin-username"
            label="Username"
            onChange={(e) => setUid(e.target.value)}
            defaultValue=""
            helperText={error}
            disabled={loading}
            variant="standard"
          />
          <TextField
            error={error !== null}
            required
            id="mui-admin-password"
            label="Password"
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            autoComplete="current-password"
            helperText={error}
            disabled={loading}
            onKeyPress={(ev) => {
              if (ev.key === 'Enter') {
                // Do code here
                ev.preventDefault()
                if (ready) {
                  onConfirm()
                }
              }
            }}
            variant="standard"
          />
          <Button
            variant="contained"
            color="primary"
            disableElevation
            disabled={!ready}
            onClick={onConfirm}
          >
            Authenticate
          </Button>
          {updaterStatus
            ? <Typography style={{ color: 'white', maxWidth: '17em', fontSize: '0.9em' }} component="span">{updaterStatus}</Typography>
            : null}
        </Grid>
      </Grid>
    </Grid>
  )
}

Login.propTypes = {
  onNewToken: PropTypes.func,
  updaterStatus: PropTypes.string
}

Login.defaultProps = {
  onNewToken: () => null,
  updaterStatus: null
}

export const StyledLogin = (props) => (
  <ThemeProvider theme={theme}>
    <StyledEngineProvider injectFirst>
      <Login {...props} />
    </StyledEngineProvider>
  </ThemeProvider>
)

export default StyledLogin
