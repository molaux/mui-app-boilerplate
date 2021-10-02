/* eslint-disable no-console */
// eslint-disable-next-line prefer-const
let waitingTokenListeners = []

// eslint-disable-next-line no-undef
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(`Message from the content script: ${request.ask}`)
  const token = window.localStorage.getItem('auth-token')
  switch (request.ask) {
    case 'token':
      if (token) {
        console.log('sending token')
        sendResponse({ token })
      } else {
        console.log('waiting token')
        waitingTokenListeners.push(sendResponse)
      }
      break
    default:
      console.error(`Unknown ask «${request.ask}»`)
  }
  return true
})
