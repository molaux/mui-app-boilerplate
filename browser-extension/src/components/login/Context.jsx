import React, { createContext, useState, useMemo, useRef } from 'react'
import { PropTypes } from 'prop-types'
import { useQuery, useSubscription } from '@apollo/client'

import { PROFILE_QUERY, PROFILE_UPDATE_SUBSCRIPTION } from './graphql'

const ProfileContext = createContext()

const hasPermissions = (set) => (permissionNames) => permissionNames
  .reduce((ok, p) => ok && set.current.has(p), true)

const hasOnePermissionOf = (set) => (permissionNames) => permissionNames
  .reduce((ok, p) => ok || set.current.has(p), false)

const is = (set) => (groupNames) => (Array.isArray(groupNames)
  ? groupNames
    .reduce((ok, g) => ok && set.current.has(g), true)
  : set.current.has(groupNames))

const isOneOf = (set) => (groupNames) => groupNames
  .reduce((ok, g) => ok || set.current.has(g), false)

const hasModule = (set) => (moduleName) => hasPermissions(set)([
  `${moduleName}/query`,
  `${moduleName}/mutation`,
  `${moduleName}/subscription`
])

const hasOneModuleOf = (set) => (moduleNames) => moduleNames.reduce(
  (ok, moduleName) => ok || (Array.isArray(moduleName)
    ? hasAllModules(set)(moduleName)
    : hasModule(set)(moduleName)),
  false
)

const hasAllModules = (set) => (moduleNames) => moduleNames.reduce(
  (ok, moduleName) => ok && hasModule(set)(moduleName),
  true
)

const ProfileProvider = ({ children, disconnect }) => {
  const permissionsSet = useRef(new Set())
  const groupsSet = useRef(new Set())
  const [profileData, setProfileData] = useState(null)
  try {
    useQuery(PROFILE_QUERY, {
      onCompleted: ({ profile }) => {
        permissionsSet.current = new Set([
          ...profile.Permissions.map(({ name }) => name),
          ...profile.Groups.map((group) => group.Permissions.map(({ name }) => name)).flat()
        ])
        groupsSet.current = new Set(profile.Groups.map(({ name }) => name))
        setProfileData(profile)
      }
    })

    useSubscription(PROFILE_UPDATE_SUBSCRIPTION, {
      onSubscriptionData: ({
        subscriptionData: {
          data: { profileUpdated: profile }
        }
      }) => {
        if (!profile.enabled) {
          disconnect()
        }

        permissionsSet.current = new Set([
          ...profile.Permissions.map(({ name }) => name),
          ...profile.Groups.map((group) => group.Permissions.map(({ name }) => name)).flat()
        ])
        groupsSet.current = new Set(profile.Groups.map(({ name }) => name))
        setProfileData(profile)
      }
    })

    const profile = useMemo(() => ({
      profile: profileData,
      isAdmin: () => profileData?.Groups.find((group) => group.name === 'Administrateur'),
      is: is(groupsSet),
      isOneOf: isOneOf(groupsSet),
      hasPermissions: hasPermissions(permissionsSet),
      hasOnePermissionOf: hasOnePermissionOf(permissionsSet),
      hasModule: hasModule(permissionsSet),
      hasOneModuleOf: hasOneModuleOf(permissionsSet),
      hasModules: hasAllModules(permissionsSet)
    }), [profileData])

    return (
      <ProfileContext.Provider value={profile}>
        {children}
      </ProfileContext.Provider>
    )
  } catch (e) {
    console.log('err', e)
  }
  return null
}

ProfileProvider.propTypes = {
  disconnect: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
}

ProfileProvider.defaultProps = {
  disconnect: () => null
}

export { ProfileContext, ProfileProvider }
