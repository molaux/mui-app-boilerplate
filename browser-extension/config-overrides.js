const path = require('path');
const fs = require('fs');
const appDirectory = fs.realpathSync(process.cwd())

module.exports = (config, env) => {
  const contentScriptPath = path.resolve(appDirectory, 'src/contentScript.js')
  config.entry = {
    main: config.entry,
    content: { import: contentScriptPath, filename: 'static/js/[name].js' }
  }
  return config
}