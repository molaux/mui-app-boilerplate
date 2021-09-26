import React, { useState, useEffect, useCallback, useContext } from 'react'
import PropTypes from 'prop-types'

import {
  Settings as GeneralConfigurationIcon,
  Person as UserConfigurationIcon
} from '@mui/icons-material'

import { useTheme } from '@mui/material/styles'

import { Tab, Tabs, TabPanel as PaddedTabContainer } from '@molaux/mui-utils'

import GeneralConfiguration from './GeneralConfiguration'
import UsersConfiguration from './UsersConfiguration'
import GroupsConfiguration from './GroupsConfiguration'
import { ProfileContext } from '../login/Context'

const tabIndexes = {
  General: 0,
  User: 1,
  Group: 2
}

const reversedTabIndexes = Object.keys(tabIndexes)
  .reduce((o, name) => ({ ...o, [tabIndexes[name]]: name }), {})

const Configuration = ({ className }) => {
  const [linkedView, setLinkedView] = useState(null)
  const [tabsHistory, setTabsHistory] = useState([])
  const { hasModule } = useContext(ProfileContext)
  const [selectedTab, setSelectedTab] = useState(hasModule('Configuration') ? 'General' : hasModule('User') ? 'User' : hasModule('Group') ? 'Group' : null)

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
        <Tab value={tabIndexes.General} icon={<GeneralConfigurationIcon />} label="Configuration générale" disabled={!hasModule('Configuration')} />
        <Tab value={tabIndexes.User} icon={<UserConfigurationIcon />} label="Utilisateurs" disabled={!hasModule('User')} />
        <Tab value={tabIndexes.Group} icon={<UserConfigurationIcon />} label="Groupes" disabled={!hasModule('Group')} />
      </Tabs>
      <PaddedTabContainer
        index={tabIndexes.General}
        value={tabIndexes[selectedTab]}
        dir={theme.direction}
      >
        {hasModule('Configuration') && tabsHistory.includes('General') ? <GeneralConfiguration /> : null}
      </PaddedTabContainer>
      <PaddedTabContainer
        index={tabIndexes.User}
        value={tabIndexes[selectedTab]}
        dir={theme.direction}
      >
        {hasModule('User') && tabsHistory.includes('User') ? <UsersConfiguration initialView={linkedView} onLink={handleLink} /> : null }
      </PaddedTabContainer>
      <PaddedTabContainer
        index={tabIndexes.Group}
        value={tabIndexes[selectedTab]}
        dir={theme.direction}
      >
        {hasModule('Group') && tabsHistory.includes('Group') ? <GroupsConfiguration initialView={linkedView} onLink={handleLink} /> : null }
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
