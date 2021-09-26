const deepmerge = require('deepmerge')

const { DataTypes } = require('sequelize')

module.exports = {
  definition: sequelize => function (baseDefinition) {
    return deepmerge(baseDefinition, {
      name: {
        type: DataTypes.VIRTUAL(DataTypes.STRING, ['city', 'street']),
        get () {
          return `${this.city}, ${this.street}`
        },
        set (value) {
          throw new Error('Do not try to set the `name` value!')
        }
      }
    }, { clone: false })
  }
}
