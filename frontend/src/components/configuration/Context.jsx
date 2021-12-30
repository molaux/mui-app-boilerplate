import React, { createContext, useState, useCallback, useMemo } from 'react'
import { PropTypes } from 'prop-types'
import { useQuery, useMutation, gql } from '@apollo/client'

import { CONFIGURATION_QUERY } from './graphql'

const ConfigurationContext = createContext()

const ConfigurationProvider = ({ children }) => {
  const [configuration, setConfiguration] = useState({
    theme: 'normal'
  })
  const [loading, setLoading] = useState(true)

  const { loading: queryLoading } = useQuery(CONFIGURATION_QUERY, {
    onCompleted: ({ configuration }) => {
      setConfiguration({ ...configuration })
      setLoading(false)
    }
  })

  if (!loading && queryLoading) {
    setLoading(queryLoading)
  }

  const [saveConfiguration, { loading: saveConfigurationLoading, error: saveConfigurationError }] = useMutation(gql`
    mutation saveConfiguration($configuration: JSON) {
      saveConfiguration(configuration: $configuration)
    }`)

  const setThenSaveConfiguration = useCallback((configuration) => {
    setConfiguration({ ...configuration })
    return saveConfiguration({
      variables: {
        configuration
      }
    })
  }, [setConfiguration, saveConfiguration])

  const value = useMemo(() => ({
    configuration,
    setConfiguration: setThenSaveConfiguration,
    configurationLoading: loading,
    saveConfigurationLoading,
    saveConfigurationError
  }), [
    configuration,
    setThenSaveConfiguration,
    loading,
    saveConfigurationLoading,
    saveConfigurationError
  ])

  return (
    <ConfigurationContext.Provider value={value}>
      {children}
    </ConfigurationContext.Provider>
  )
}

ConfigurationProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
}

ConfigurationProvider.defaultProps = {
}

export { ConfigurationContext, ConfigurationProvider }
