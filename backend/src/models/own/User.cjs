/**
 * Auto generated by MySQL Workbench Schema Exporter.
 * Version 3.1.5-dev (node-Sequelize6 dev) on 2022-01-18 19:40:59.
 * Goto
 * https://github.com/mysql-workbench-schema-exporter/mysql-workbench-schema-exporter
 * for more information.
 */

const { DataTypes, Model } = require('sequelize')

class User extends Model {
}

module.exports = (sequelize, extend) => {
  User.init(extend({
    id: {
      type: DataTypes.INTEGER,
      field: 'id',
      primaryKey: true,
      autoIncrement: true
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
      allowNull: false,
      defaultValue: sequelize.fn('NOW')
    },
    firstName: {
      type: DataTypes.STRING(200),
      field: 'first_name',
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING(200),
      field: 'last_name',
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
      allowNull: false,
      defaultValue: sequelize.fn('NOW')
    },
    comment: {
      type: DataTypes.TEXT,
      field: 'comment',
      allowNull: false,
      defaultValue: ''
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      field: 'enabled',
      allowNull: false,
      defaultValue: true
    },
    password: {
      type: DataTypes.STRING(255),
      field: 'password',
      allowNull: false
    },
    authenticationType: {
      type: DataTypes.STRING(45),
      field: 'authentication_type',
      allowNull: false,
      defaultValue: 'intern'
    },
    login: {
      type: DataTypes.STRING(45),
      field: 'login',
      unique: true,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(45),
      field: 'phone'
    },
    email: {
      type: DataTypes.STRING(255),
      field: 'email',
      allowNull: false
    }
  }), {
    sequelize: sequelize,
    modelName: 'User',
    tableName: 'user',
    indexes: [
      {
        name: 'user_address_fk1_idx',
        fields: ['address_id']
      },
      {
        name: 'login_UNIQUE',
        fields: ['login'],
        unique: true
      }
    ],
    timestamps: true,
    underscored: true,
    syncOnAssociation: false
  })

  User.associate = () => {
    // 1 <=> N association
    User.hasMany(sequelize.models.Bookmark, {
      foreignKey: {
        name: 'userId',
        allowNull: false
      },
      onUpdate: 'NO ACTION',
      onDelete: 'NO ACTION',
      targetKey: 'id',
      as: 'Bookmarks'
    })

    // 1 <=> N association
    User.hasMany(sequelize.models.Log, {
      foreignKey: {
        name: 'userId',
        allowNull: true
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      targetKey: 'id',
      as: 'Logs'
    })

    // N <=> 1 association
    User.belongsTo(sequelize.models.Address, {
      foreignKey: {
        name: 'addressId',
        allowNull: false
      },
      onUpdate: 'RESTRICT',
      targetKey: 'id'
    })

    // N <=> M association
    User.belongsToMany(sequelize.models.Group, {
      through: 'group_has_user',
      foreignKey: {
        name: 'user_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      targetKey: 'id',
      as: 'Groups'
    })

    // N <=> M association
    User.belongsToMany(sequelize.models.Permission, {
      through: 'user_has_permissions',
      foreignKey: {
        name: 'user_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      targetKey: 'id',
      as: 'Permissions'
    })
  }

  return User
}
