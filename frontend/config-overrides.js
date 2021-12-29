const { useBabelRc, override } = require('customize-cra')

module.exports = (config, env) => ({
  ...override(useBabelRc())(config, env),
  ...config
})
