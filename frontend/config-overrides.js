const path = require('path')

module.exports = (config, env) => {
  config.resolve.alias.react = path.resolve('./node_modules/react')
  return config
}