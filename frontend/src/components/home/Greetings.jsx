import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/client'

import Typography from '@mui/material/Typography'
import { withStyles } from '@mui/styles'

import { StatusTypography } from '@molaux/mui-utils'
import { Link } from '@mui/material'

import isElectron from 'is-electron'

import SunIcon from '../../ui/SunIcon'
import { ProfileContext } from '../login/Context'
import { SERVER_INFOS_QUERY } from './graphql'
import packageInfos from '../../../package.json'

export const getOS = () => {
  const { userAgent } = window.navigator
  const { platform } = window.navigator
  const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K']
  const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE']
  const iosPlatforms = ['iPhone', 'iPad', 'iPod']
  let os = null

  if (macosPlatforms.indexOf(platform) !== -1) {
    os = 'Mac OS'
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = 'iOS'
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = 'Windows'
  } else if (/Android/.test(userAgent)) {
    os = 'Android'
  } else if (/Linux/.test(platform)) {
    os = 'Linux'
  }

  return os
}

const Greetings = ({ className, onLoaded, updaterStatus }) => {
  const { loading: serverInfosLoading, data: serverInfosData } = useQuery(SERVER_INFOS_QUERY)
  useEffect(() => {
    setTimeout(onLoaded, 500)
  }, [])

  const [downloadUrl, setDownloadUrl] = useState(null)

  useEffect(async () => {
    const os = getOS()

    if (['Linux', 'Windows'].includes(os)) {
      const headers = new window.Headers()
      headers.append('pragma', 'no-cache')
      headers.append('cache-control', 'no-cache')

      const line = await (await (await window.fetch(`/auto-updates/latest${os === 'Linux' ? '-linux' : ''}.yml`, {
        method: 'GET',
        headers
      })).text())
        .split('\n')
        .filter((line) => /- url:/.test(line))
      const file = line?.[0]?.replace(/^\s*-\s*url:\s*/, '')
      setDownloadUrl(file ? `/auto-updates/${file}` : null)
    }
  }, [setDownloadUrl])

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
      {updaterStatus
        ? <StatusTypography gutterBottom info>{updaterStatus}</StatusTypography>
        : null}
      <StatusTypography>
        <Typography component="div" variant="caption">Client : {packageInfos.version} / {process.env.NODE_ENV}{!isElectron() && downloadUrl ? <> - <Link href={downloadUrl}>Installer l&apos;application desktop pour {getOS()}</Link></> : null}</Typography>
        <Typography component="div" variant="caption">Server : {serverInfosLoading ? '...' : <>{serverInfosData?.serverInfos.version} / {serverInfosData?.serverInfos.env}</>}</Typography>
      </StatusTypography>
    </div>
  )
}

Greetings.propTypes = {
  className: PropTypes.string,
  updaterStatus: PropTypes.string,
  onLoaded: PropTypes.func
}

Greetings.defaultProps = {
  className: '',
  updaterStatus: null,
  onLoaded: () => null
}

export default withStyles({}, { withTheme: true })(Greetings)
