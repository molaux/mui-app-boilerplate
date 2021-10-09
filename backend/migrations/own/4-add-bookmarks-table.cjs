'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "bookmark", deps: [user]
 * addIndex "fk_boukmark_user1_idx" to table "bookmark"
 *
 **/

var info = {
    "revision": 3,
    "name": "add-bookmarks-table",
    "created": "2021-10-03T15:49:44.334Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "createTable",
        params: [
            "bookmark",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "autoIncrement": true,
                    "primaryKey": true,
                    "field": "id"
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "defaultValue": Sequelize.Fn,
                    "allowNull": false,
                    "field": "created_at"
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "defaultValue": Sequelize.Fn,
                    "allowNull": false,
                    "field": "updated_at"
                },
                "url": {
                    "type": Sequelize.STRING(4096),
                    "allowNull": false,
                    "field": "url"
                },
                "comment": {
                    "type": Sequelize.TEXT,
                    "defaultValue": "",
                    "allowNull": false,
                    "field": "comment"
                },
                "visits": {
                    "type": Sequelize.INTEGER,
                    "allowNull": false,
                    "field": "visits"
                },
                "userId": {
                    "type": Sequelize.INTEGER,
                    "field": "user_id",
                    "onUpdate": "NO ACTION",
                    "onDelete": "NO ACTION",
                    "references": {
                        "model": "user",
                        "key": "id"
                    },
                    "name": "userId",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "addIndex",
        params: [
            "bookmark",
            ["user_id"],
            {
                "indexName": "fk_boukmark_user1_idx",
                "name": "fk_boukmark_user1_idx"
            }
        ]
    }
];

module.exports = {
    pos: 0,
    up: function({ context: { queryInterface }})
    {
        var index = this.pos;
        return new Promise(function(resolve, reject) {
            function next() {
                if (index < migrationCommands.length)
                {
                    let command = migrationCommands[index];
                    index++;
                    queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                }
                else
                    resolve();
            }
            next();
        });
    },
    info: info
};
