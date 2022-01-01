# Firefox extension

This extension provides authentication, data retrieval, mutation, and injections in Google search pages as a test.
It uses realtime update from backend server.

Ones authenticated with the icon button in the Firefox toolbar, the extension will inject Bookmarks buttons under nutural links in Google search pages results. Ones clicked, the extension will track the clicks events on the Google link. Note that the actions are synchronised in the [frontend app](../frontend).

## Install

```bash
$ yarn
```

## Start

```bash
yarn watch
```

In Firefox: Open the about:debugging page, click the This Firefox option, click the Load Temporary Add-on button, then select any file in your extension's directory (`./build`).

The extension now installs, and remains installed until you restart Firefox. 

([See Mozilla documentation for full details](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension))

[Debugging instructions](https://extensionworkshop.com/documentation/develop/debugging/)

## Build


```bash
yarn build
```
