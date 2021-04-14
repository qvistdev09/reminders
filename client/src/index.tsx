import React from 'react';
import ReactDOM from 'react-dom';
import RouterWrapper from './components/router-wrapper/router-wrapper';
import './styles/root.scss';

ReactDOM.render(
  <React.StrictMode>
    <RouterWrapper />
  </React.StrictMode>,
  document.getElementById('root')
);
