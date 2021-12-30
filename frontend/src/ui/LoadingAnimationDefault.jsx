import React from 'react'

import CircularProgress from '@mui/material/CircularProgress'
import { useQuery } from '@apollo/client'
import { makeStyles } from '@mui/styles'
import icon from './logo.svg'
import packageInfos from '../../package.json'
import { SERVER_INFOS_QUERY } from '../components/home/graphql'

const useStyles = makeStyles((theme) => ({
  content: {
    flex: 1,
    overflow: 'auto',
    textAlign: 'center',
    fontSize: '1.8em',
    paddingTop: '20vh',
    color: 'white',
    background: theme.palette.primary.main,
    whiteSpace: 'no-wrap'
  },
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0
  },
  flex: {
    flex: 1
  }
}))

const LoadingAnimationDefault = () => {
  const { loading, data } = useQuery(SERVER_INFOS_QUERY)
  const classes = useStyles()
  return (
    <div className={classes.content}>
      <img width={64} src={icon} alt="logo" style={{ verticalAlign: 'middle', marginRight: '0.5em', marginTop: '-0.2em', color: 'white' }} />
      <span style={{ color: 'white' }}>{packageInfos.build.productName}</span><br />
      <small style={{ fontSize: '0.5em' }}>Versions : client {packageInfos.version} / {process.env.NODE_ENV}, serveur {loading ? '...' : <>{data?.serverInfos.version} / {data?.serverInfos.env}</>}</small><br /><br />
      <CircularProgress style={{ color: '#FBB800' }} /><br />
      <i><small style={{ fontSize: '0.5em' }}>Loading...</small></i>
    </div>
  )
}
export default LoadingAnimationDefault
