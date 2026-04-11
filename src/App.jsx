import { useState, useEffect } from 'react'
import './App.css'
import Login from './assets/components/Login'
import Dashboard from './assets/components/Dashboard'
import { useLocation, Routes, Route } from 'react-router-dom';
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import UserInfo from './assets/components/UserInfo';
import CompanyDetails from './assets/components/CompanyDetails';
import CardInfo from './assets/components/CardInfo';
import Breakage from './assets/components/Breakage';
import RunDetail from './assets/components/RunDetail';
import Navbar from './assets/components/Navbar';
import { useData } from "./context/DataContext";
import { useThemeContext } from "./context/ThemeContext";
import FullDetails from './assets/components/FullDetails';

function App() {
  const { tableData, statusFilter, setStatusFilter } = useData();
  const [showFilter, setShowFilter] = useState(false);
  const [showFilterData, setShowFilterData] = useState(false);
  const handle = useFullScreenHandle();
  const runningCount = tableData.filter(item => item.IsRun === true || item.IsRun === "true").length;
  const stoppedCount = tableData.filter(item => item.IsRun === false || item.IsRun === "false").length;
  const totalCount = tableData.length;
  const { mode } = useThemeContext();
  const location = useLocation();
  const hideNavbar = location.pathname === "/";
  const defaultFields = {
    efficiency: true,
    production: false,
    speed: false,
    average: false,
    totalRun: false,
    totalStop: false,
    quality: false
  };
  const [visibleFields, setVisibleFields] = useState(defaultFields);
  const [showLabels, setShowLabels] = useState(false);
  const [fieldOrder, setFieldOrder] = useState([
    "efficiency",
    "production",
    "speed",
    "average",
    "totalRun",
    "totalStop",
    "quality"
  ]);

  return (
    <>
      <FullScreen handle={handle}>
        <div className={`pt-4 w-screen h-screen flex flex-col 
         ${mode === "dark" ? "bg-[#2b2b2b]" : "bg-[#f5f5f5]"}`}>
          {!hideNavbar && (<Navbar
            handle={handle}
            showFilter={showFilter}
            showFilterData={showFilterData}
            setStatusFilter={setStatusFilter}
            statusFilter={statusFilter}
            setShowFilter={setShowFilter}
            setShowFilterData={setShowFilterData}
            runningCount={runningCount}
            stoppedCount={stoppedCount}
            totalCount={totalCount}
            visibleFields={visibleFields}
            setVisibleFields={setVisibleFields}
            showLabels={showLabels}
            setShowLabels={setShowLabels}
            fieldOrder={fieldOrder}
            setFieldOrder={setFieldOrder}
          />
          )}

          <div className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/userinfo" element={<UserInfo />} />
              <Route path="/companydetails" element={<CompanyDetails />} />
              <Route path="/card" element={<CardInfo visibleFields={visibleFields} showLabels={showLabels} fieldOrder={fieldOrder} />} />
              <Route path="/breakage/:machineId" element={<Breakage />} />
              <Route path="/rundetail/:machineId" element={<RunDetail />} />
              <Route path="/fulldetails" element={<FullDetails />} />
            </Routes>
          </div>

        </div>
      </FullScreen>
    </>
  )
}

export default App
