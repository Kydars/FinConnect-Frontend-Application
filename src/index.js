import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import RegisterPage from './pages/registerPage';
import LoginPage from './pages/loginPage';
import HomePage from './pages/homePage';
import Chart from './pages/chart';
import reportWebVitals from './reportWebVitals';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/home" element={<HomePage />} />
        <Route path="/chart/:ticker" element={<Chart />} />
      </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
