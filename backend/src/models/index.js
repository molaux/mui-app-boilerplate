'use strict'
import dotenv from 'dotenv-flow'

import fs from 'fs'
import Sequelize from 'sequelize'

import configData from '../../config/model.json'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import sqliteModelConverter from './sqlite'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config()

const env = process.env.NODE_ENV || 'development'

const loadModels = async () => {
  const isDirectory = source => fs.lstatSync(source).isDirectory()
  const getDirectories = source =>
    fs.readdirSync(source)
      .map(name => path.join(source, name))
      .filter(source => isDirectory(source) && source.indexOf('.') !== 0)

  const dbs = {}
  for (const dbDirName of getDirectories(__dirname)) {
    const dbName = path.basename(dbDirName)
    console.log(`Loading ${dbName} database repo...`)
    const config = configData[dbName][env]
    if (config.logging === true) {
      config.logging = console.log
    }

    const sequelize = config.use_env_variable
      ? new Sequelize(process.env[config.use_env_variable], config)
      : new Sequelize(config.database, config.username, config.password, config)

    const models = await Promise.all(fs
      .readdirSync(dbDirName)
      .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== path.basename(__filename)) && (file.slice(-4) === '.cjs')
      })
      .map(async file => await Promise.all([
        import(path.join(dbDirName, file)),
        fs.existsSync(path.join(dbDirName, 'extensions', file))
          ? import(path.join(dbDirName, 'extensions', file))
          : Promise.resolve({ default: { definition: sequelize => o => o } })
      ])
      )
    ).then(modules => modules.reduce((o, [module, extension]) => {
      let dialectConverter = (x) => x
      if (sequelize.options.dialect === 'sqlite') {
        dialectConverter = sqliteModelConverter(sequelize)
      }
      const extend = (baseDefinition) => extension.default.definition?.(sequelize)(dialectConverter(baseDefinition))
      const model = module.default(sequelize, extend)
      model.extraAssociate = extension.default.associate?.(sequelize)

      return ({ ...o, [model.name]: model })
    }, {}))

    Object.keys(models).forEach(modelName => {
      models[modelName].associate?.()
      models[modelName].extraAssociate?.(models[modelName])
    })

    dbs[dbName] = sequelize
  }

  return dbs
}
export default loadModels
