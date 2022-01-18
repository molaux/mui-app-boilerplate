/**
 * Auto generated by MySQL Workbench Schema Exporter.
 * Version 3.1.5-dev (node-Sequelize6 dev) on 2022-01-18 19:40:59.
 * Goto
 * https://github.com/mysql-workbench-schema-exporter/mysql-workbench-schema-exporter
 * for more information.
 */

const { DataTypes, Model } = require('sequelize')

class Bookmark extends Model {
}

module.exports = (sequelize, extend) => {
  Bookmark.init(extend({
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
    url: {
      type: DataTypes.STRING(4096),
      field: 'url',
      allowNull: false
    },
    comment: {
      type: DataTypes.TEXT,
      field: 'comment',
      allowNull: false,
      defaultValue: ''
    },
    visits: {
      type: DataTypes.INTEGER,
      field: 'visits',
      allowNull: false,
      defaultValue: 0
    }
  }), {
    sequelize: sequelize,
    modelName: 'Bookmark',
    tableName: 'bookmark',
    indexes: [
      {
        name: 'fk_boukmark_user1_idx',
        fields: ['user_id']
      }
    ],
    timestamps: true,
    underscored: true,
    syncOnAssociation: false
  })

  Bookmark.associate = () => {
    // N <=> 1 association
    Bookmark.belongsTo(sequelize.models.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false
      },
      onUpdate: 'NO ACTION',
      targetKey: 'id'
    })
  }

  return Bookmark
}
