import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Content from './Content'

for (const e of Array.from(window.document.querySelectorAll('div > div > div > div > a > h3').values())) {
  const container = document.createElement('div')
  e.parentNode.insertBefore(container, e)
  try {
    ReactDOM.render(
      <React.StrictMode>
        <Content />
      </React.StrictMode>,
      container
    )
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(e)
  }
}
