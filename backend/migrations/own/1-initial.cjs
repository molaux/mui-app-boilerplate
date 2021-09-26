'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "address", deps: []
 * createTable "group", deps: []
 * createTable "permission", deps: []
 * createTable "user", deps: [address]
 * createTable "log", deps: [user]
 * createTable "group_has_permissions", deps: [group, permission]
 * createTable "group_has_user", deps: [group, user]
 * createTable "user_has_permissions", deps: [permission, user]
 * addIndex "log_user_fk1_idx" to table "log"
 * addIndex "user_address_fk1_idx" to table "user"
 * addIndex "login_UNIQUE" to table "user"
 *
 **/

var info = {
    "revision": 1,
    "name": "nop",
    "created": "2021-09-04T18:05:44.767Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "createTable",
        params: [
            "address",
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
                "comment": {
                    "type": Sequelize.TEXT,
                    "defaultValue": "",
                    "allowNull": false,
                    "field": "comment"
                },
                "label": {
                    "type": Sequelize.STRING(200),
                    "field": "label"
                },
                "street": {
                    "type": Sequelize.STRING(45),
                    "allowNull": false,
                    "field": "street"
                },
                "zipCode": {
                    "type": Sequelize.STRING(45),
                    "allowNull": false,
                    "field": "zip_code"
                },
                "city": {
                    "type": Sequelize.STRING(45),
                    "allowNull": false,
                    "field": "city"
                },
                "country": {
                    "type": Sequelize.STRING(45),
                    "allowNull": false,
                    "field": "country"
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "group",
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
                "name": {
                    "type": Sequelize.STRING(200),
                    "allowNull": false,
                    "field": "name"
                },
                "comment": {
                    "type": Sequelize.TEXT,
                    "defaultValue": "",
                    "allowNull": false,
                    "field": "comment"
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "permission",
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
                "name": {
                    "type": Sequelize.STRING(200),
                    "defaultValue": "",
                    "allowNull": false,
                    "field": "name"
                },
                "comment": {
                    "type": Sequelize.TEXT,
                    "defaultValue": "",
                    "allowNull": false,
                    "field": "comment"
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "user",
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
                "firstName": {
                    "type": Sequelize.STRING(200),
                    "allowNull": false,
                    "field": "first_name"
                },
                "lastName": {
                    "type": Sequelize.STRING(200),
                    "allowNull": false,
                    "field": "last_name"
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "defaultValue": Sequelize.Fn,
                    "allowNull": false,
                    "field": "updated_at"
                },
                "comment": {
                    "type": Sequelize.TEXT,
                    "defaultValue": "",
                    "allowNull": false,
                    "field": "comment"
                },
                "enabled": {
                    "type": Sequelize.BOOLEAN,
                    "defaultValue": true,
                    "allowNull": false,
                    "field": "enabled"
                },
                "password": {
                    "type": Sequelize.STRING(255),
                    "allowNull": false,
                    "field": "password"
                },
                "authenticationType": {
                    "type": Sequelize.STRING(45),
                    "defaultValue": "intern",
                    "allowNull": false,
                    "field": "authentication_type"
                },
                "login": {
                    "type": Sequelize.STRING(45),
                    "allowNull": false,
                    "unique": true,
                    "field": "login"
                },
                "phone": {
                    "type": Sequelize.STRING(45),
                    "field": "phone"
                },
                "email": {
                    "type": Sequelize.STRING(255),
                    "allowNull": false,
                    "field": "email"
                },
                "addressId": {
                    "type": Sequelize.INTEGER,
                    "field": "address_id",
                    "onUpdate": "CASCADE",
                    "onDelete": "RESTRICT",
                    "references": {
                        "model": "address",
                        "key": "id"
                    },
                    "name": "addressId",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "log",
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
                "name": {
                    "type": Sequelize.STRING(200),
                    "defaultValue": "",
                    "allowNull": false,
                    "field": "name"
                },
                "comment": {
                    "type": Sequelize.TEXT,
                    "defaultValue": "",
                    "allowNull": false,
                    "field": "comment"
                },
                "userId": {
                    "type": Sequelize.INTEGER,
                    "field": "user_id",
                    "onUpdate": "SET NULL",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "user",
                        "key": "id"
                    },
                    "name": "userId",
                    "allowNull": true
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "group_has_permissions",
            {
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "created_at",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updated_at",
                    "allowNull": false
                },
                "group_id": {
                    "type": Sequelize.INTEGER,
                    "field": "group_id",
                    "onUpdate": "CASCADE",
                    "onDelete": "CASCADE",
                    "references": {
                        "model": "group",
                        "key": "id"
                    },
                    "primaryKey": true,
                    "name": "group_id"
                },
                "permission_id": {
                    "type": Sequelize.INTEGER,
                    "name": "permission_id",
                    "field": "permission_id",
                    "onUpdate": "CASCADE",
                    "onDelete": "CASCADE",
                    "references": {
                        "model": "permission",
                        "key": "id"
                    },
                    "primaryKey": true
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "group_has_user",
            {
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "created_at",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updated_at",
                    "allowNull": false
                },
                "group_id": {
                    "type": Sequelize.INTEGER,
                    "field": "group_id",
                    "onUpdate": "CASCADE",
                    "onDelete": "CASCADE",
                    "references": {
                        "model": "group",
                        "key": "id"
                    },
                    "primaryKey": true,
                    "name": "group_id"
                },
                "user_id": {
                    "type": Sequelize.INTEGER,
                    "name": "user_id",
                    "field": "user_id",
                    "onUpdate": "CASCADE",
                    "onDelete": "CASCADE",
                    "references": {
                        "model": "user",
                        "key": "id"
                    },
                    "primaryKey": true
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "user_has_permissions",
            {
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "created_at",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updated_at",
                    "allowNull": false
                },
                "permission_id": {
                    "type": Sequelize.INTEGER,
                    "field": "permission_id",
                    "onUpdate": "CASCADE",
                    "onDelete": "CASCADE",
                    "references": {
                        "model": "permission",
                        "key": "id"
                    },
                    "primaryKey": true,
                    "name": "permission_id"
                },
                "user_id": {
                    "type": Sequelize.INTEGER,
                    "name": "user_id",
                    "field": "user_id",
                    "onUpdate": "CASCADE",
                    "onDelete": "CASCADE",
                    "references": {
                        "model": "user",
                        "key": "id"
                    },
                    "primaryKey": true
                }
            },
            {}
        ]
    },
    {
        fn: "addIndex",
        params: [
            "log",
            ["user_id"],
            {
                "indexName": "log_user_fk1_idx",
                "name": "log_user_fk1_idx"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "user",
            ["address_id"],
            {
                "indexName": "user_address_fk1_idx",
                "name": "user_address_fk1_idx"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "user",
            ["login"],
            {
                "indexName": "login_UNIQUE",
                "name": "login_UNIQUE",
                "indicesType": "UNIQUE",
                "type": "UNIQUE"
            }
        ]
    }
];

module.exports = {
    pos: 0,
    up: function({ context: { queryInterface } })
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
