import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import App from './components/app';
import './index.css';
<<<<<<< HEAD
import './login.css';
import './words.css';
=======
import store from './store';
>>>>>>> e7d670a9a8f3a59e1d943f73978c544de9f65ff1

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);



