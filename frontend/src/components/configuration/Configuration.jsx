import React, { useState, useEffect, useCallback, useContext } from 'react'
import PropTypes from 'prop-types'

import {
  Settings as GeneralConfigurationIcon,
  Person as UserConfigurationIcon
} from '@mui/icons-material'

import { useTheme } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'

import { Tab, Tabs, TabPanel as PaddedTabContainer } from '@molaux/mui-utils'

import GeneralConfiguration from './GeneralConfiguration'
import UsersConfiguration from './UsersConfiguration'
import GroupsConfiguration from './GroupsConfiguration'
import { ProfileContext } from '../login/Context'

const tabIndexes = {
  Configuration: 0,
  User: 1,
  Group: 2
}

const useTabStyle = makeStyles((theme) => ({
  tab: {
    paddingTop: theme.spacing(2)
  }
}))
const reversedTabIndexes = Object.keys(tabIndexes)
  .reduce((o, name) => ({ ...o, [tabIndexes[name]]: name }), {})

const Configuration = ({ className }) => {
  const [linkedView, setLinkedView] = useState(null)
  const [tabsHistory, setTabsHistory] = useState([])
  const { hasModule, isAdmin } = useContext(ProfileContext)
  const [selectedTab, setSelectedTab] = useState(isAdmin() || hasModule('Configuration') ? 'General' : hasModule('User') ? 'User' : hasModule('Group') ? 'Group' : null)
  console.log(process.env)
  const classes = useTabStyle()
  const handleLink = useCallback((tab, view, value) => {
    setLinkedView({ view, value })
    setSelectedTab(tab)
  }, [setLinkedView, setSelectedTab])

  useEffect(() => {
    if (!tabsHistory.includes(selectedTab)) {
      tabsHistory.push(selectedTab)
      setTabsHistory([...tabsHistory])
    }
  }, [selectedTab, tabsHistory])
  const theme = useTheme()
  return (
    <div className={className}>
      <Tabs
        value={tabIndexes[selectedTab]}
        onChange={(e, i) => handleLink(
          reversedTabIndexes[i]
        )}
        indicatorColor="primary"
        textColor="primary"
        scrollButtons="auto"
        variant="scrollable"
      >
        <Tab value={tabIndexes.Configuration} icon={<GeneralConfigurationIcon />} label="Settings" disabled={!isAdmin() && !hasModule('Configuration')} />
        <Tab value={tabIndexes.User} icon={<UserConfigurationIcon />} label="Users" disabled={!isAdmin() && !hasModule('User')} />
        <Tab value={tabIndexes.Group} icon={<UserConfigurationIcon />} label="Groups" disabled={!isAdmin() && !hasModule('Group')} />
      </Tabs>
      <PaddedTabContainer
        index={tabIndexes.Configuration}
        value={tabIndexes[selectedTab]}
        dir={theme.direction}
        className={classes.tab}
      >
        {(isAdmin() || hasModule('Configuration')) && tabsHistory.includes('Configuration') ? <GeneralConfiguration /> : null}
      </PaddedTabContainer>
      <PaddedTabContainer
        index={tabIndexes.User}
        value={tabIndexes[selectedTab]}
        dir={theme.direction}
        className={classes.tab}
      >
        {(isAdmin() || hasModule('User')) && tabsHistory.includes('User') ? <UsersConfiguration initialView={linkedView} onLink={handleLink} /> : null }
      </PaddedTabContainer>
      <PaddedTabContainer
        index={tabIndexes.Group}
        value={tabIndexes[selectedTab]}
        dir={theme.direction}
        className={classes.tab}
      >
        {(isAdmin() || hasModule('Group')) && tabsHistory.includes('Group') ? <GroupsConfiguration initialView={linkedView} onLink={handleLink} /> : null }
      </PaddedTabContainer>
    </div>
  )
}

Configuration.propTypes = {
  className: PropTypes.string
}

Configuration.defaultProps = {
  className: ''
}

export default Configuration
