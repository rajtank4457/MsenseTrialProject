import { useState } from 'react'
import './App.css'
import Login from './assets/components/Login'
import Dashboard from './assets/components/Dashboard'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserInfo from './assets/components/UserInfo';
import CompanyDetails from './assets/components/CompanyDetails';
import CardInfo from './assets/components/CardInfo';
import Breakage from './assets/components/Breakage';

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
          <Route path="/breakage" element={<Breakage />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
