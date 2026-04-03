
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import {
    Tooltip, IconButton, Avatar, Menu, MenuItem, Divider, ListItemIcon, TextField, Button, ListItemText,
    Switch
} from '@mui/material';
import { Logout } from '@mui/icons-material';
import { useData } from "../../context/DataContext";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useThemeContext } from "../../context/ThemeContext";


function Navbar({ showFilter, setShowFilter }) {
    const { mode, toggleTheme } = useThemeContext();
    const {
        runningCount,
        stoppedCount,
        totalCount,
        avgEfficiency,
        avgSpeed,
        sortBy, setSortBy,
        groupBy, setGroupBy,
        selectedGroup, setSelectedGroup,
        statusFilter, setStatusFilter,
        tableData,
        setSelectedRange,
        effCounts,
    } = useData();

    const groupOptions = [...new Set(tableData.map(item => item.DeviceGroup))];

    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const open = Boolean(anchorEl);

    const cardPage = () => {
        navigate("/card");
    }

    const handleProfile = () => {
        handleClose();
        navigate("/userinfo");
    };

    const handleCompanyinfo = () => {
        handleClose();
        navigate("/companydetails");
    }

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDashboard = () => {
        navigate("/dashboard");
    }

    // const handleChange = (e) => {
    //     setSortBy(e.target.value);
    // };
    // const handleChangeGroupby = (e) => {
    //     setGroupBy(e.target.value);
    // }



    return (
        <nav>
            <div className='bg-[#9696923c]'>

                {/* ✅ ROW 1 (MAIN NAVBAR) */}
                <div className="flex items-center px-4 h-[55px]">

                    {/* LEFT SIDE */}
                    <div className="flex items-center gap-10">
                        <h1 className="text-2xl font-serif cursor-pointer" onClick={handleDashboard}>
                            MSENSE
                        </h1>

                        <div className="flex items-center gap-10 text-[#1976d2]">
                            <div className="text-center">
                                <p className="text-xl font-semibold">{avgEfficiency}</p>
                                <p className="text-sm">Efficiency</p>
                            </div>

                            <div className="text-center">
                                <p className="text-xl font-semibold">{avgSpeed}</p>
                                <p className="text-sm">A.Speed</p>
                            </div>
                        </div>
                    </div>

                    {/* ✅ CENTER (STATUS BUTTONS) */}
                    <div className="flex-1 flex justify-center -ml-[200px]">
                        <div className="flex gap-3">

                            <div
                                onClick={() => setStatusFilter("running")}
                                className={`border rounded-lg px-4 py-[2px] text-center cursor-pointer transition ${statusFilter === "running"
                                    ? "bg-green-500 text-white border-green-500 shadow-md"
                                    : "text-blue-500 border-green-500 hover:bg-green-500 hover:text-white"
                                    }`}
                            >
                                <p className="text-lg font-bold">{runningCount}</p>
                                <p className="text-xs">Running</p>
                            </div>

                            <div
                                onClick={() => setStatusFilter("stopped")}
                                className={`border rounded-lg px-4 py-[2px] text-center cursor-pointer transition ${statusFilter === "stopped"
                                    ? "bg-red-500 text-white border-red-500 shadow-md"
                                    : "text-blue-500 border-red-500 hover:bg-red-500 hover:text-white"
                                    }`}
                            >
                                <p className="text-lg font-bold">{stoppedCount}</p>
                                <p className="text-xs">Stopped</p>
                            </div>

                            <div
                                onClick={() => setStatusFilter("all")}
                                className={`border rounded-lg px-4 py-[2px] text-center cursor-pointer transition ${statusFilter === "all"
                                    ? "bg-blue-500 text-white border-blue-500 shadow-md"
                                    : "text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white"
                                    }`}
                            >
                                <p className="text-lg font-bold">{totalCount}</p>
                                <p className="text-xs">All</p>
                            </div>

                        </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="flex items-center gap-4">
                        <Button onClick={() => setShowFilter(!showFilter)}>Filter</Button>

                        <Tooltip title="Account settings">
                            <IconButton onClick={handleClick} size="small">
                                <Avatar sx={{ color: "Blue", backgroundColor: "Lightblue", width: 32, height: 32 }}>
                                    M
                                </Avatar>
                            </IconButton>
                        </Tooltip>
                    </div>

                </div>

                {/* ✅ ROW 2 (FILTER SECTION) */}
                {showFilter && (
                    <div className="flex items-center justify-between px-4 py-3 border-t">

                        {/* ✅ LEFT SIDE (CARD BUTTON) */}
                        <div>
                            <div className="border text-white rounded-lg px-4 py-[2px] bg-blue-500 cursor-pointer hover:bg-blue-700">
                                <Button onClick={cardPage} sx={{ color: "white" }}>
                                    Cards
                                </Button>
                            </div>
                        </div>

                        <div className='flex justify-center ml-[150px] gap-2'>

                            {/* ALL */}
                            <div onClick={() => setSelectedRange("all")}
                                className={`border rounded-lg px-8 py-[2px] text-center text-white cursor-pointer shadow-md bg-[#3c3f41] hover:bg-black`}
                            >
                                <p className="text-lg font-bold">{totalCount}</p>
                                <p className="text-xs">All</p>
                            </div>

                            {/* 90-100 */}
                            <div onClick={() => setSelectedRange("90-100")}
                                className={`border rounded-lg px-6 py-[2px] text-center text-white cursor-pointer shadow-md bg-[#26de81] hover:bg-[#11c269]`}
                            >
                                <p className="text-lg font-bold">{effCounts?.["90-100"]}</p>
                                <p className="text-xs">100-90</p>
                            </div>

                            {/* 80-90 */}
                            <div onClick={() => setSelectedRange("80-90")}
                                className={`border rounded-lg px-8 py-[2px] text-center text-white cursor-pointer shadow-md bg-[#4bcffa] hover:bg-[#25a3cd]`}
                            >
                                <p className="text-lg font-bold">{effCounts?.["80-90"]}</p>
                                <p className="text-xs">90-80</p>
                            </div>

                            {/* 70-80 */}
                            <div onClick={() => setSelectedRange("70-80")}
                                className={`border rounded-lg px-8 py-[2px] text-center text-white cursor-pointer shadow-md bg-[#d6a2e8] hover:bg-[#a667bb]`}
                            >
                                <p className="text-lg font-bold">{effCounts?.["70-80"]}</p>
                                <p className="text-xs">80-70</p>
                            </div>

                            {/* 60-70 */}
                            <div onClick={() => setSelectedRange("60-70")}
                                className={`border rounded-lg px-8 py-[2px] text-center text-white cursor-pointer shadow-md bg-[#f5cd79] hover:bg-[#cca551]`}
                            >
                                <p className="text-lg font-bold">{effCounts?.["60-70"]}</p>
                                <p className="text-xs">70-60</p>
                            </div>

                            {/* 0-60 */}
                            <div onClick={() => setSelectedRange("below-60")}
                                className={`border rounded-lg px-8 py-[2px] text-center text-white cursor-pointer shadow-md bg-[#feb7b7] hover:bg-[#c95d5d]`}
                            >
                                <p className="text-lg font-bold">{effCounts?.["0-60"]}</p>
                                <p className="text-xs">60-0</p>
                            </div>

                        </div>

                        {/* ✅ RIGHT SIDE (ALL DROPDOWNS) */}
                        <div className="flex items-center gap-4">

                            {/* GROUP */}
                            <TextField
                                select
                                label="Groups"
                                value={selectedGroup}
                                onChange={(e) => setSelectedGroup(e.target.value)}
                                size="small"
                                className="w-[200px]"
                            >
                                <MenuItem value="all">All</MenuItem>
                                {groupOptions.map((group, index) => (
                                    <MenuItem key={index} value={group}>
                                        {group}
                                    </MenuItem>
                                ))}
                            </TextField>

                            {/* GROUP BY */}
                            <TextField
                                select
                                label="Group by"
                                value={groupBy}
                                onChange={(e) => setGroupBy(e.target.value)}
                                size="small"
                                className="w-[200px]"
                            >
                                <MenuItem value="none">None</MenuItem>
                                <MenuItem value="groupname">Group Name</MenuItem>
                                <MenuItem value="efficiency">Efficiency</MenuItem>
                                <MenuItem value="status">Status</MenuItem>
                            </TextField>

                            {/* SORT */}
                            <TextField
                                select
                                label="Sort by"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                size="small"
                                className="w-[200px]"
                            >
                                <MenuItem value="none">None</MenuItem>
                                <MenuItem value="efficiencyhl">Efficiency H2L</MenuItem>
                                <MenuItem value="efficiencylh">Efficiency L2H</MenuItem>
                                <MenuItem value="productionhl">Production H2L</MenuItem>
                                <MenuItem value="productionlh">Production L2H</MenuItem>
                                <MenuItem value="speedhl">Speed H2L</MenuItem>
                                <MenuItem value="speedlh">Speed L2H</MenuItem>
                            </TextField>

                        </div>
                    </div>
                )}

                <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <MenuItem onClick={handleProfile}>
                        <Avatar /> Profile
                    </MenuItem>
                    <MenuItem onClick={handleCompanyinfo}>
                        <Avatar /> Company Details
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={toggleTheme}>
                        <ListItemIcon>
                            {mode === "dark" ? <DarkModeIcon /> : <LightModeIcon />}
                        </ListItemIcon>
                        <ListItemText>
                            {mode === "dark" ? "Dark Mode" : "Light Mode"}
                        </ListItemText>

                        <Switch checked={mode === "dark"} />
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                        <ListItemIcon>
                            <Logout fontSize="small" />
                        </ListItemIcon>
                        Logout
                    </MenuItem>
                </Menu>

            </div>
        </nav>
    )
}

export default Navbar