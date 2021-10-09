/* eslint-disable no-console */

// eslint-disable-next-line no-undef
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(`Ask from the content script: ${request.ask}`)
  const token = window.localStorage.getItem('auth-token')
  switch (request.ask) {
    case 'token':
      console.log('sending token')
      sendResponse({ token })
      break
    default:
      console.error(`Unknown ask «${request.ask}»`)
  }
  return true
})
