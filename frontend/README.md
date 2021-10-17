## Introduction

This frontend app is based on [MUI](https://mui.com/), [Sequelize GraphQL Schema Builder](https://github.com/molaux/sequelize-graphql-schema-builder) and [MUI CRUDF](https://github.com/molaux/mui-crudf) to provide a ready to use boilerplate application providing the following features :
 * Authentication
 * CRUD interface generation, with realtime update (through GraphQL subscriptions)
 * Dynamic user / group / permission management (updates are pushed to connected clients that update in realtime)
 * Dynamic configuration with theme management as a demonstration
 * Linux [Electron](https://github.com/electron/electron) desktop application building

## Installation

```bash
$ cd frontend
$ yarn
```

## Web

### Development

```bash
$ yarn start:web:dev
```

### Production

```bash
$ yarn build:web:production
```

## Electron desktop app development

```bash
$ yarn start:web:dev
$ yarn start:desktop:dev
```