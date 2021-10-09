import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Content from './Content'

for (const e of Array.from(window.document.querySelectorAll('div > div > div > div > a > h3').values())) {
  const container = document.createElement('div')
  e.parentNode.insertBefore(container, e)
  console.log(e.parentNode.href)
  try {
    ReactDOM.render(
      <React.StrictMode>
        <Content url={e.parentNode.href} />
      </React.StrictMode>,
      container
    )
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(e)
  }
}
