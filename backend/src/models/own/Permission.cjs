/**
 * Auto generated by MySQL Workbench Schema Exporter.
 * Version 3.1.5-dev (node-Sequelize6 dev) on 2022-01-18 19:40:59.
 * Goto
 * https://github.com/mysql-workbench-schema-exporter/mysql-workbench-schema-exporter
 * for more information.
 */

const { DataTypes, Model } = require('sequelize')

class Permission extends Model {
}

module.exports = (sequelize, extend) => {
  Permission.init(extend({
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
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
      allowNull: false,
      defaultValue: sequelize.fn('NOW')
    },
    name: {
      type: DataTypes.STRING(200),
      field: 'name',
      allowNull: false,
      defaultValue: ''
    },
    comment: {
      type: DataTypes.TEXT,
      field: 'comment',
      allowNull: false,
      defaultValue: ''
    }
  }), {
    sequelize: sequelize,
    modelName: 'Permission',
    tableName: 'permission',
    timestamps: true,
    underscored: true,
    syncOnAssociation: false
  })

  Permission.associate = () => {
    // N <=> M association
    Permission.belongsToMany(sequelize.models.Group, {
      through: 'group_has_permissions',
      foreignKey: {
        name: 'permission_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      targetKey: 'id',
      as: 'Groups'
    })

    // N <=> M association
    Permission.belongsToMany(sequelize.models.User, {
      through: 'user_has_permissions',
      foreignKey: {
        name: 'permission_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      targetKey: 'id',
      as: 'Users'
    })
  }

  return Permission
}
