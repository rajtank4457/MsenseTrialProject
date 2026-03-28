import { Button } from '@mui/material';
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Tooltip, IconButton, Avatar, Menu, MenuItem, Divider, ListItemIcon } from '@mui/material';
import { Logout } from '@mui/icons-material';

function Navbar({ runningCount, stoppedCount, totalCount, setStatusFilter, statusFilter, showFilter, setShowFilter }) {

    const [tableData, setTableData] = useState([]);
    const [avgEfficiency, setAvgEfficiency] = useState(0);
    const [avgSpeed, setAvgSpeed] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    

    const navigate = useNavigate();
    const open = Boolean(anchorEl);

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


    useEffect(() => {
        fetchData();

        const interval = setInterval(() => {
            fetchData();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        const EMB_URL = import.meta.env.VITE_EMB_URL;
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${EMB_URL}/api/data/getliveproductionOld`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            });

            const data = await res.json();

            if (res.ok) {
                const machines = data.ResultData.LiveProductionData;
                setTableData(machines);

                const totalEfficiency = machines.reduce((sum, item) => {
                    return sum + Number(item.Efficiency || 0);
                }, 0);

                const avgEfficiency = machines.length > 0
                    ? (totalEfficiency / machines.length).toFixed(2)
                    : 0;

                setAvgEfficiency(avgEfficiency);

                const totalSpeed = machines.reduce((sum, item) => {
                    return sum + Number(item.Speed || 0);
                }, 0);

                const avgSpeed = machines.length > 0 ? (totalSpeed / machines.length).toFixed()
                    : 0;

                setAvgSpeed(avgSpeed);

               
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <nav>
            <div className='flex bg-[#9696923c]'>
                <div className=" h-[55px] flex justify-start items-center px-4">

                    <div>
                        <h1 className="text-2xl font-serif cursor-pointer"><a href='/dashboard'>MSENSE</a></h1>
                    </div>

                    <div className="flex items-center gap-10 ml-20 text-[#1976d2]">

                        <div className="text-center">
                            <p className="text-xl font-semibold">{avgEfficiency}</p>
                            <p className="-mt-1 text-sm">Efficiency</p>
                        </div>

                        <div className="text-center -ml-3">
                            <p className="text-xl font-semibold">{avgSpeed}</p>
                            <p className="-mt-1 text-sm">A.Speed</p>
                        </div>

                    </div>
                </div>
                <div className="ml-[250px] flex justify-center items-center gap-3 ">

                    <div onClick={() => setStatusFilter("running")} className={`border rounded-lg px-4 py-[2px] text-center cursor-pointer transition ${statusFilter === "running"
                        ? "bg-green-500 text-white border-green-500 shadow-md"
                        : "text-blue-500 border-green-500 hover:bg-green-500 hover:text-white"
                        }`}>
                        <p className="text-lg font-bold  ">{runningCount}</p>
                        <p className="text-xs -mt-1 ">Running</p>
                    </div>

                    <div onClick={() => setStatusFilter("stopped")} className={`border rounded-lg px-4 py-[2px] text-center cursor-pointer transition ${statusFilter === "stopped"
                        ? "bg-red-500 text-white border-red-500 shadow-md"
                        : "text-blue-500 border-red-500 hover:bg-red-500 hover:text-white"
                        }`}>
                        <p className="text-lg font-bold ">{stoppedCount}</p>
                        <p className="text-xs -mt-1">Stopped</p>
                    </div>

                    <div onClick={() => setStatusFilter("all")} className={`border rounded-lg px-4 py-[2px] text-center cursor-pointer transition ${statusFilter === "all"
                        ? "bg-blue-500 text-white border-blue-500 shadow-md"
                        : "text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white"
                        }`}>
                        <p className="text-lg font-bold">{totalCount}</p>
                        <p className="text-xs -mt-1">All</p>
                    </div>
                </div>

                <div className='flex justify-end ml-auto mr-8'>
                    <Button onClick={() => setShowFilter(!showFilter)}>Filter</Button>
                    <Tooltip title="Account settings">
                        <IconButton
                            onClick={handleClick}
                            size="small"
                            sx={{ ml: 2 }}
                            aria-controls={open ? 'account-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                        >
                            <Avatar sx={{ color: "Blue", backgroundColor: "Lightblue", width: 32, height: 32 }}>M</Avatar>
                        </IconButton>
                    </Tooltip>
                    <Menu
                        anchorEl={anchorEl}
                        id="account-menu"
                        open={open}
                        onClose={handleClose}
                        onClick={handleClose}
                        slotProps={{
                            paper: {
                                elevation: 0,
                                sx: {
                                    overflow: 'visible',
                                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                    mt: 1.5,
                                    '& .MuiAvatar-root': {
                                        width: 32,
                                        height: 32,
                                        ml: -0.5,
                                        mr: 1,
                                    },
                                    '&::before': {
                                        content: '""',
                                        display: 'block',
                                        position: 'absolute',
                                        top: 0,
                                        right: 14,
                                        width: 10,
                                        height: 10,
                                        bgcolor: 'background.paper',
                                        transform: 'translateY(-50%) rotate(45deg)',
                                        zIndex: 0,
                                    },
                                },
                            },
                        }}
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
                        <MenuItem onClick={handleLogout}>
                            <ListItemIcon>
                                <Logout fontSize="small" />
                            </ListItemIcon>
                            Logout
                        </MenuItem>
                    </Menu>
                </div>
            </div>
        </nav>
    )
}

export default Navbar