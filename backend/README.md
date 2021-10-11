# Backend

The workflow depends on `php` and `composer` since it uses [a fork of MySQL Workbench Schema Exporter / Node exporter](https://github.com/molaux/node-exporter) to generate Sequelize models. Thus, the API is driven by [MySQL Workbench](http://www.mysql.com/products/workbench/)

## Install

```bash
$ cd backend
$ yarn ci
```

The project is written for node / ECMAScript module and node is run with `--experimental-specifier-resolution=node` and need at least node 14. If you use [nvm](https://github.com/nvm-sh/nvm), issue :

```bash
$ nvm use
```

## (Re)generate the models (optionnal)

The boilerplate can handle as many Sequelize models as you need. The default repository is named «own» :

```bash
$ yarn generate:models
```

This command lets you regenerate all the models from the [MySQL Workbench file `docs/Model.mwb`](docs/Model.mwb).

Note that this command will ovewrite all models present in `src/models/own`, you you should not modify these files. For that purpose, an extensions mechanism handles files in `src/models/own/extensions`.

## Generate a migration file

Once you regenerated models files, you can create a migration file automatically :

```bash
$ yarn generate:migration -r own -n last-changes
```

These migrations will be handled by [Umzug](https://github.com/sequelize/umzug) at the server start.

## Test

The workflow embeds a Jest test suite that handles many aspects of the server : it plays queries and mutations, then checks responses to them. This test suite observes events triggered by subscriptions in response to each request and checks there is no extra data.

The provided test suite introduce the ability to log in and check basic functionality.

 * `tests/gql/*.gql` : The ordered requests to play
 * `tests/subscriptions/*.gql` : The subscriptions to listen to
 * `tests/json/*.json` : The expected results

```bash
$ yarn test
```

## Start

Start against dev env and provide a playground that should be available at [http://localhost:3331/api](http://localhost:3331/api) :

```bash
$ yarn start:dev
```

Start against prod env :
```bash
$ yarn start:prod
```

## API documentation

In order to convert the Sequelize models to a GraphQL schema, the sytem uses [Sequelize GraphQL Schema Builder](https://github.com/molaux/sequelize-graphql-schema-builder).
