import { useState } from 'react'
import './App.css'
import Login from './assets/componenets/Login'
import Dashboard from './assets/componenets/Dashboard'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserInfo from './assets/componenets/UserInfo';
import CompanyDetails from './assets/componenets/CompanyDetails';
import CardInfo from './assets/componenets/CardInfo';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/userinfo" element={<UserInfo />} />
          <Route path="/companydetails" element={<CompanyDetails />} />
          <Route path="/card" element={<CardInfo />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
