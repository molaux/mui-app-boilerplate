import React, { useContext } from 'react'

import Typography from '@mui/material/Typography'

import { createStyles, makeStyles } from '@mui/styles'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

import { ConfigurationContext } from './Context'

const useStyles = makeStyles((theme) => createStyles({
  formControl: {
    margin: theme.spacing(1),
    marginBottom: theme.spacing(10),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  marginTop: {
    marginTop: theme.spacing(10)
  }
}))

export const withGeneralConfiguration = (Component) => (props) => {
  const {
    generalConfiguration,
    setGeneralConfiguration,
    generalConfigurationLoading
  } = useContext(ConfigurationContext)
  return (
    <Component
      {...props}
      generalConfiguration={generalConfiguration}
      setGeneralConfiguration={setGeneralConfiguration}
      generalConfigurationLoading={generalConfigurationLoading}
    />
  )
}

const GeneralConfiguration = () => {
  const {
    configuration,
    setConfiguration
  } = useContext(ConfigurationContext)
  console.log('conf', { configuration })
  const classes = useStyles()

  return (
    <>
      <Typography gutterBottom variant="h5">Zone</Typography>
      <FormControl variant="standard" className={classes.formControl}>
        <Select
          labelId="theme-select-label"
          id="theme-select"
          value={configuration.theme || ''}
          onChange={(event) => setConfiguration(
            { ...configuration, theme: event.target.value }
          )}
        >
          <MenuItem value="dark">Dark theme</MenuItem>
          <MenuItem value="normal">Normal theme</MenuItem>
        </Select>
      </FormControl>
    </>
  )
}

GeneralConfiguration.propTypes = {
}

export default GeneralConfiguration
