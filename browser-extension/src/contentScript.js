import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App'

console.log('hello')
console.log('element found', Array.from(window.document.querySelectorAll('div > div > div > div > a > h3').values()))

for (const e of Array.from(window.document.querySelectorAll('div > div > div > div > a > h3').values())) {
  console.log(e)
  const container = document.createElement("div")
  console.log('inserting before', e.parentNode, container, e)
  e.parentNode.insertBefore(container, e)
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    container
  );
  
}