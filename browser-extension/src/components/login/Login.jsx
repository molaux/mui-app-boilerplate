import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  Grid,
  TextField,
  Button
} from '@mui/material'

import { ThemeProvider } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'
import { useMutation, gql } from '@apollo/client'
import { ReactComponent as Logo } from '../../ui/logo.svg'
import pkg from '../../../package.json'

import { reversedTheme as theme } from '../../ui/theme'

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.palette.primary.main
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

export const Login = (props) => {
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
      console.log('trying to authenticate', uid, password)
      token = (await login({
        variables: {
          login: uid,
          password
        }
      }))?.data.login
      if (token) {
        setError(null)
        if (props.onNewToken) {
          props.onNewToken(token)
        }
      }
    } catch (e) {
      setError('Something went wrong...')
    }
  }

  const ready = !(loading || password.length === 0 || uid.length === 0)

  return (
    <ThemeProvider theme={theme}>
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
              <Logo height="2em" width="2em" />
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
          </Grid>
        </Grid>
      </Grid>
    </ThemeProvider>
  )
}

Login.propTypes = {
  onNewToken: PropTypes.func
}

Login.defaultProps = {
  onNewToken: () => null
}

export default Login
