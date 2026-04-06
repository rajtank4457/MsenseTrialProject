import { useState } from 'react'
import './App.css'
import Login from './assets/components/Login'
import Dashboard from './assets/components/Dashboard'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import UserInfo from './assets/components/UserInfo';
import CompanyDetails from './assets/components/CompanyDetails';
import CardInfo from './assets/components/CardInfo';
import Breakage from './assets/components/Breakage';
import RunDetail from './assets/components/RunDetail';
import Navbar from './assets/components/Navbar';
import { useData } from "./context/DataContext";
import { useThemeContext } from "./context/ThemeContext";

function App() {
  const { tableData } = useData();
  const [showFilter, setShowFilter] = useState(false);
  const handle = useFullScreenHandle();
  const runningCount = tableData.filter(item => item.IsRun === true || item.IsRun === "true").length;
  const stoppedCount = tableData.filter(item => item.IsRun === false || item.IsRun === "false").length;
  const totalCount = tableData.length;
  const { mode } = useThemeContext();
  return (
    <>
      <FullScreen handle={handle}>
        <div className={`w-screen h-screen flex flex-col 
         ${mode === "dark" ? "bg-[#2b2b2b]" : "bg-[#f5f5f5]"}`}>
          <Router>
            <Navbar
              handle={handle}
              showFilter={showFilter}
              setShowFilter={setShowFilter}
              runningCount={runningCount}
              stoppedCount={stoppedCount}
              totalCount={totalCount}
            />

            <div className="flex-1 overflow-auto">
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/userinfo" element={<UserInfo />} />
                <Route path="/companydetails" element={<CompanyDetails />} />
                <Route path="/card" element={<CardInfo />} />
                <Route path="/breakage/:machineId" element={<Breakage />} />
                <Route path="/rundetail/:machineId" element={<RunDetail />} />
              </Routes>
            </div>

          </Router>
        </div>
      </FullScreen>
    </>
  )
}

export default App
