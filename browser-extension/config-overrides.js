const path = require('path')
const fs = require('fs')

const appDirectory = fs.realpathSync(process.cwd())

module.exports = (config, env) => {
  const contentScriptPath = path.resolve(appDirectory, 'src/contentScript.jsx')
  const backgroundScriptPath = path.resolve(appDirectory, 'src/backgroundScript.js')
  config.entry = {
    main: config.entry,
    content: { import: contentScriptPath, filename: 'static/js/[name].js' },
    background: { import: backgroundScriptPath, filename: 'static/js/[name].js' }
  }
  return config
}
