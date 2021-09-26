const deepmerge = require('deepmerge')
const bcrypt = require('bcrypt')

const { DataTypes } = require('sequelize')
module.exports = {
  definition: sequelize => function (baseDefinition) {
    return deepmerge(baseDefinition, {
      lastName: {
        get () {
          const rawValue = this.getDataValue('lastName')
          return rawValue ? rawValue.toUpperCase() : null
        }
      },
      email: {
        validator: {
          is: {
            args: '^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$',
            msg: 'Ça ne ressemble pas à une adresse email...'
          }
        }
      },
      password: {
        validator: {
          is: {
            args: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*\\.\\?])',
            msg: 'Le mot de passe doit être composé d\'au moins une minuscule, une majuscule, un chiffre et un symbole parmis !, @, #, $, %, ^, &, *, . et ?'
          },
          len: {
            args: [6, 20],
            msg: 'Le mot de passe doit contenir au moins 6 caractères et au plus 20.'
          }
        },
        set (password) {
          this.setDataValue('password', bcrypt.hashSync(password, 10))
        }
      },
      name: {
        type: DataTypes.VIRTUAL(DataTypes.STRING, ['lastName', 'firstName']),
        get () {
          return `${this.firstName} ${this.lastName}`
        },
        set (value) {
          throw new Error('Do not try to set the `fullName` value!')
        }
      },
      login: {
        validator: {
          len: {
            args: [3, 20],
            msg: 'Le login doit contenir au moins 3 caractères et au plus 20.'
          }
        }
      }
    }, { clone: false })
  }
}
