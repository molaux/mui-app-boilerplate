import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { klona } from 'klona/lite'

import Typography from '@mui/material/Typography'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'

import {
  Clear as ClearIcon,
  Done as DoneIcon,
  Add as AddIcon
} from '@mui/icons-material'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Chip from '@mui/material/Chip'
import InputAdornment from '@mui/material/InputAdornment'

import { useQuery, useMutation, gql } from '@apollo/client'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import { createStyles, makeStyles } from '@mui/styles'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

import dateLocale from 'date-fns/locale/fr'

import { TableResponsive as Table } from '@molaux/mui-utils'

import { capitalize } from '../../utils/string'
import { CONFIGURATION_QUERY } from './graphql'

const useChipStyles = makeStyles((theme) => ({
  chip: ({ edition }) => ({
    height: 'auto',
    minHeight: '32px',
    padding: theme.spacing(edition ? 1 : 0, 0, edition ? 1 : 0, 0),
    margin: theme.spacing(1)
  })
}))

const TermField = ({ term, onAcceptTerm, onDeleteTerm, onCancelTerm, edit }) => {
  const [edition, setEdition] = useState(edit)
  const classes = useChipStyles({ edition })
  const fieldRef = useRef()
  return (
    <Chip
      classes={{ root: classes.chip }}
      onClick={() => (!edition ? setEdition(true) : null)}
      onDelete={edition ? null : () => onDeleteTerm(term)}
      label={edition
        ? (
          <TextField
            size="small"
            id="input-value"
            label="Terme"
            variant="standard"
            inputRef={fieldRef}
            defaultValue={term}
            onKeyPress={(ev) => {
              if (ev.key === 'Enter') {
                // Do code here
                ev.preventDefault()
                onAcceptTerm(ev.target.value)
              }
            }}
            type="text"
            autoFocus
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={(event) => onAcceptTerm(fieldRef.current.value)}
                  >
                    <DoneIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => {
                      setEdition(false)
                      if (onCancelTerm !== undefined) {
                        onCancelTerm(term)
                      }
                    }}
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          )
        : term}
    />
  )
}

TermField.propTypes = {
  term: PropTypes.string.isRequired,
  onAcceptTerm: PropTypes.func.isRequired,
  onDeleteTerm: PropTypes.func.isRequired,
  onCancelTerm: PropTypes.func.isRequired,
  edit: PropTypes.bool.isRequired
}

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

export const useGeneralConfiguration = (options) => {
  const [generalConfiguration, setGeneralConfiguration] = useState({
    orderDays: new Set(),
    receiptDays: {},
    restockDeleteMinutes: 60
  })

  const [loading, setLoading] = useState(true)

  const { loading: queryLoading } = useQuery(CONFIGURATION_QUERY, {
    onCompleted: ({ generalConfiguration: storedConfiguration }) => {
      const convertedStoredConfiguration = klona(storedConfiguration)
      if (convertedStoredConfiguration && convertedStoredConfiguration.orderDays) {
        convertedStoredConfiguration.orderDays = new Set(convertedStoredConfiguration.orderDays)
      }
      const configuration = {
        ...generalConfiguration,
        ...convertedStoredConfiguration
      }
      setGeneralConfiguration(configuration)
      setLoading(false)
      if (options && typeof options.onCompleted === 'function') {
        options.onCompleted(configuration)
      }
    }
  })

  if (!loading && queryLoading) {
    setLoading(queryLoading)
  }

  const [saveGeneralConfiguration, { loading: saveGeneralConfigurationLoading, error: saveGeneralConfigurationError }] = useMutation(gql`
    mutation saveGeneralConfiguration($configuration: JSON) {
      saveGeneralConfiguration(configuration: $configuration)
    }`)
  const setThenSaveGeneralConfiguration = (configuration) => {
    setGeneralConfiguration(configuration)
    const convertedConfiguration = { ...configuration }
    if (convertedConfiguration && convertedConfiguration.orderDays) {
      convertedConfiguration.orderDays = Array.from(convertedConfiguration.orderDays)
    }
    saveGeneralConfiguration({
      variables: {
        configuration: convertedConfiguration
      }
    })
  }

  return {
    generalConfiguration,
    setGeneralConfiguration: setThenSaveGeneralConfiguration,
    generalConfigurationLoading: loading,
    saveGeneralConfigurationLoading,
    saveGeneralConfigurationError
  }
}

export const withGeneralConfiguration = (Component) => (props) => {
  const {
    generalConfiguration,
    setGeneralConfiguration,
    generalConfigurationLoading
  } = useGeneralConfiguration()
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
    generalConfiguration,
    generalConfigurationLoading: loading,
    setGeneralConfiguration
  } = useGeneralConfiguration()
  const classes = useStyles()

  return (
    <>
      <Typography gutterBottom variant="h5">Zone</Typography>
      <FormControl variant="standard" className={classes.formControl}>
        <Select
          labelId="zone-select-label"
          id="zone-select"
          value={generalConfiguration.zone || ''}
          onChange={(event) => setGeneralConfiguration(
            { ...generalConfiguration, zone: event.target.value }
          )}
        >
          <MenuItem value="GO">Grand ouest</MenuItem>
          <MenuItem value="SE">Sud est</MenuItem>
          <MenuItem value="SO">Sud ouest</MenuItem>
          <MenuItem value="CN">Centre et nord</MenuItem>
        </Select>
      </FormControl>
      <Typography gutterBottom variant="h5">Commandes automatiques</Typography>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell component="th">Jours de commande</TableCell>
            <TableCell component="td" />
            {Array.from({ length: 7 }, (v, i) => (i + dateLocale.options.weekStartsOn) % 7)
              .map((dayIndex) => (
                <TableCell key={dayIndex} align="center" component="td">
                  <FormControlLabel
                    value={dayIndex}
                    control={(
                      <Checkbox
                        color="primary"
                        disabled={loading}
                        checked={generalConfiguration.orderDays.has(dayIndex)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            generalConfiguration.orderDays.add(dayIndex)
                            if (generalConfiguration.receiptDays[dayIndex] === undefined) {
                              generalConfiguration.receiptDays[dayIndex] =
                                dateLocale.options.weekStartsOn
                            }
                          } else {
                            generalConfiguration.orderDays.delete(dayIndex)
                          }
                          setGeneralConfiguration({ ...generalConfiguration })
                        }}
                      />
                    )}
                    label={capitalize(dateLocale.localize.day(dayIndex))}
                    labelPlacement="top"
                  />
                </TableCell>
              ))}
          </TableRow>
          {Array.from({ length: 7 }, (v, i) => (i + dateLocale.options.weekStartsOn) % 7)
            .map((receiptDayIndex) => (
              <TableRow key={receiptDayIndex}>
                {receiptDayIndex === dateLocale.options.weekStartsOn
                  ? <TableCell rowSpan={7} component="th">Jours de réception</TableCell>
                  : null }
                <TableCell component="th">{capitalize(dateLocale.localize.day(receiptDayIndex))}</TableCell>
                {Array.from({ length: 7 }, (v, i) => (i + dateLocale.options.weekStartsOn) % 7)
                  .map((orderDayIndex) => (
                    <TableCell key={orderDayIndex} align="center" component="td">
                      <Checkbox
                        disabled={loading || !generalConfiguration.orderDays.has(orderDayIndex)}
                        checked={generalConfiguration.receiptDays[orderDayIndex] !== undefined &&
                          generalConfiguration.receiptDays[orderDayIndex] === receiptDayIndex}
                        onChange={(e) => {
                          if (e.target.checked) {
                            generalConfiguration.receiptDays[orderDayIndex] = receiptDayIndex
                          }
                          setGeneralConfiguration({ ...generalConfiguration })
                        }}
                        color="primary"
                      />
                    </TableCell>
                  ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <Typography className={classes.marginTop} gutterBottom variant="h5">Réappros</Typography>
      <FormControl variant="standard" className={classes.formControl}>
        <Typography variant="legend">Rétention des réappros préparées</Typography>
        <TextField
          label="Temps en minutes"
          value={generalConfiguration.restockDeleteMinutes || ''}
          variant="standard"
          type="number"
          onChange={(e) => setGeneralConfiguration(
            { ...generalConfiguration, restockDeleteMinutes: e.target.value }
          )}
        />
      </FormControl>
      <Typography className={classes.marginTop} gutterBottom variant="h5">Réceptions automatiques</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell component="th">Terme de recherche</TableCell>
            <TableCell component="th">Termes EDI</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(generalConfiguration.EDISearchFields ?? {})
            .sort((a, b) => a.localeCompare(b, 'fr', { ignorePunctuation: true }))
            .map((term) => (
              <TableRow key={term}>
                <TableCell component="th">
                  <TermField
                    term={term}
                    edit={term === ''}
                    onDeleteTerm={(deletedTerm) => {
                      delete generalConfiguration.EDISearchFields[deletedTerm]
                      setGeneralConfiguration({ ...generalConfiguration })
                    }}
                    onAcceptTerm={(newTerm) => {
                      if (newTerm !== '' && newTerm !== term && !Object.keys(generalConfiguration.EDISearchFields).includes(newTerm)) {
                        generalConfiguration
                          .EDISearchFields[newTerm] = generalConfiguration.EDISearchFields[term]
                        if (newTerm !== term) {
                          delete generalConfiguration.EDISearchFields[term]
                        }
                        setGeneralConfiguration({ ...generalConfiguration })
                      }
                    }}
                    onCancelTerm={() => {
                      if (term === '') {
                        delete generalConfiguration.EDISearchFields[term]
                        setGeneralConfiguration({ ...generalConfiguration })
                      }
                    }}
                  />
                </TableCell>
                <TableCell component="td">
                  {generalConfiguration.EDISearchFields[term].map((sourceTerm) => (
                    <TermField
                      key={sourceTerm}
                      term={sourceTerm}
                      edit={sourceTerm === ''}
                      onDeleteTerm={(deletedTerm) => {
                        generalConfiguration
                          .EDISearchFields[term] = generalConfiguration
                            .EDISearchFields[term].filter((term) => term !== deletedTerm)
                        setGeneralConfiguration({ ...generalConfiguration })
                      }}
                      onAcceptTerm={(newTerm) => {
                        if (newTerm !== '' && newTerm !== sourceTerm && !generalConfiguration.EDISearchFields[term].includes(newTerm)) {
                          generalConfiguration
                            .EDISearchFields[term] = generalConfiguration
                              .EDISearchFields[term]
                              .map((term) => (term === sourceTerm ? newTerm : term))
                          setGeneralConfiguration({ ...generalConfiguration })
                        }
                      }}
                      onCancelTerm={() => {
                        if (sourceTerm === '') {
                          generalConfiguration.EDISearchFields[term] = generalConfiguration.EDISearchFields[term].filter((term) => term !== '')
                          setGeneralConfiguration({ ...generalConfiguration })
                        }
                      }}
                    />
                  ))}
                  <IconButton
                    color="primary"
                    onClick={() => {
                      generalConfiguration.EDISearchFields[term].push('')
                      setGeneralConfiguration({ ...generalConfiguration })
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          <TableRow>
            <TableCell component="td" colSpan={50}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
                  generalConfiguration.EDISearchFields[''] = []
                  setGeneralConfiguration({ ...generalConfiguration })
                }}
              >
                Nouveau terme EDI
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  )
}

GeneralConfiguration.propTypes = {
}

export default GeneralConfiguration
