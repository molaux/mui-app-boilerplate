import React, { useContext, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/client'

import Typography from '@mui/material/Typography'
import { withStyles } from '@mui/styles'

import { StatusTypography } from '@molaux/mui-utils'

import SunIcon from '../../ui/SunIcon'
import { ProfileContext } from '../login/Context'
import { SERVER_INFOS_QUERY } from './graphql'
import packageInfos from '../../../package.json'

const Greetings = ({ className, onLoaded }) => {
  const { loading: serverInfosLoading, data: serverInfosData } = useQuery(SERVER_INFOS_QUERY)
  useEffect(() => {
    setTimeout(onLoaded, 500)
  }, [])
  const { profile } = useContext(ProfileContext)
  return (
    <div className={className}>
      <Typography gutterBottom variant="h3" component="h2">Hello {profile.firstName} !
        <SunIcon sx={{
          mb: (theme) => theme.spacing(2),
          ml: (theme) => theme.spacing(4),
          fontSize: 60,
          verticalAlign: 'bottom'
        }}
        />
      </Typography>
      <br />

      <StatusTypography>
        <Typography component="div" variant="caption">Client : {packageInfos.version} / {process.env.NODE_ENV}</Typography>
        <Typography component="div" variant="caption">Serveur : {serverInfosLoading ? '...' : <>{serverInfosData?.serverInfos.version} / {serverInfosData?.serverInfos.env}</>}</Typography>
      </StatusTypography>
    </div>
  )
}

Greetings.propTypes = {
  className: PropTypes.string,
  onLoaded: PropTypes.func
}

Greetings.defaultProps = {
  className: '',
  onLoaded: () => null
}

export default withStyles({}, { withTheme: true })(Greetings)
