import React from 'react'
import ReactDOM from 'react-dom';
import './index.css'
import { Provider } from 'react-redux'
import store from './store'
import App from './App.jsx'
import { WebSocketProvider } from './Context.jsx'

ReactDOM.render(
  <Provider store={store}>
    <WebSocketProvider>
      <App />
    </WebSocketProvider>
  </Provider>,
    document.getElementById('root')
)
