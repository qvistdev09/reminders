import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import RouterWrapper from './components/router-wrapper/router-wrapper';
import './styles/root.scss';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterWrapper />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
