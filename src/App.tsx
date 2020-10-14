import React from 'react';
import { ToastContainer } from 'react-toastify';

import GlobalStyles from './styles/global'
import Routes from './routes'

function App() {
  return (
    <>
      <ToastContainer autoClose={3000} />
      <Routes />
      <GlobalStyles />
    </>
  );
}

export default App;
