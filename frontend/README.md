## Introduction

This frontend app is based on [MUI](https://mui.com/), [Sequelize GraphQL Schema Builder](https://github.com/molaux/sequelize-graphql-schema-builder) and [MUI CRUDF](https://github.com/molaux/mui-crudf) to provide a ready to use boilerplate application providing the following features :
 * Authentication
 * CRUD interface generation, with realtime updates (through GraphQL subscriptions)
 * Dynamic user / group / permission management (updates are pushed to connected clients in realtime)
 * Dynamic configuration with theme management as a demonstration
 * Linux [Electron](https://github.com/electron/electron) desktop application building

## Installation

```bash
$ cd frontend
$ yarn
```

## Web

### Assets

In order to facilitate icons building, you can issue :

```bash
$ yarn generate:assets
```

It relies on [convert script from ImageMagick library](https://imagemagick.org/script/convert.php) to convert your `src/ui/logo.svg` to needed icons at miscellaneous sizes.

### Development

Start the [Webpack development server](https://webpack.js.org/configuration/dev-server/) with :
```bash
$ yarn start:web:dev
```

### Production

Build the production app with :

```bash
$ yarn build:web:production
```

### Audit

Generate an audit of your bundles sizes with :

```bash
$ yarn build:web:audit
```

## Electron desktop app

### Development

```bash
$ yarn start:web:dev
$ yarn start:desktop:dev
```

### Production

Build electron app with:

```bash
$ yarn build:desktop
```