process.env.NODE_ENV = 'development'
const fs = require('fs-extra')
const webpack = require('webpack')
const { paths } = require('react-app-rewired')
const overrides = require('react-app-rewired/config-overrides')
const config = require(paths.scriptVersion + '/config/webpack.config.js')
const path = require('path')
const conf = overrides.webpack(config('development'), 'development')

for (const rule of conf.module.rules) {
  if (rule.oneOf) {
    for (const one of rule.oneOf) {
      if (
        one.loader &&
        one.loader.includes('babel-loader') &&
        one.options &&
        one.options.plugins
      ) {
        one.options.plugins = one
          .options
          .plugins
          .filter((plugin) => typeof plugin !== 'string' || !plugin.includes('react-refresh'))
      }
    }
  }
}

conf.plugins = conf
  .plugins
  .filter((plugin) => !['ReactRefreshPlugin', 'HotModuleReplacementPlugin'].includes(plugin.constructor.name))
// console.log(conf)
// We needed to output to a specific folder for cross-framework interop.
// Make sure to change the output path or to remove this line if the behavior
// of the original gist is sufficient for your needs!
conf.output.path = path.join(process.cwd(), './build')
webpack(conf).watch({}, (err, stats) => {
  if (err) {
    console.error('watch error', err)
  } else {
    copyPublicFolder()
  }
  console.error(stats.toString({
    chunks: false,
    colors: true
  }))
})

function copyPublicFolder () {
  fs.copySync(paths.appPublic, paths.appBuild, {
    dereference: true,
    filter: (file) => file !== paths.appHtml
  })
}
