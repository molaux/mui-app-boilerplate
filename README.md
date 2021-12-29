# MUI App Boilerplate

The goal is to provide a node / React base application built on Material-UI. It includesfetures like authentication, permission management, subscriptions to data changes and many more, through an auto generated graphQL API server.

 * [The backend GraphQL API](backend) uses Sequelize, Apollo Graphql Server, Sequelize GraphQL Server. The server is mainly and automatically generated directly from a MySQL Workbench file.
 * [The frontend web app](frontend) is based on [React](https://github.com/facebook/react), [MUI](https://github.com/mui-org), [MUI CRUDF](https://github.com/molaux/mui-crudf)
 * [A firefox extension](browser-extension) demonstrates how to benefit from the same capabilities than the front app but in a ready to use extension, injecting information in (and retrieving from) Google search pages
