import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import {
    Tooltip, IconButton, Avatar, Menu, MenuItem, Divider, ListItemIcon, TextField, Button, ListItemText,
    Switch, Box, Drawer, List, ListItem, ListItemButton, Typography, Modal, FormGroup, FormControlLabel, Checkbox
} from '@mui/material';
import { Logout } from '@mui/icons-material';
import { useData } from "../../context/DataContext";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useThemeContext } from "../../context/ThemeContext";
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BusinessIcon from '@mui/icons-material/Business';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AppsIcon from '@mui/icons-material/Apps';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { useLocation } from "react-router-dom";
import TuneIcon from '@mui/icons-material/Tune';
import CloseIcon from '@mui/icons-material/Close';
import AutorenewIcon from '@mui/icons-material/Autorenew';

function Navbar({ showFilter, setShowFilter, showFilterData, setShowFilterData, handle, setVisibleFields, visibleFields, showLabels, setShowLabels, fieldOrder, setFieldOrder }) {
    const { mode, toggleTheme } = useThemeContext();
    const location = useLocation();
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
        selectedRange,
        effCounts,
        visibleCount, setVisibleCount,
        counterCols, setCounterCols,
        handleIncFn, handleDecFn, fontScale,
        savedFilter, setSavedFilter
    } = useData();

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    const [openBottomDrawer, setOpenBottomDrawer] = useState(false);
    const [openDialogue, setOpenDialogue] = useState(false);
    const groupOptions = [...new Set(tableData.map(item => item.DeviceGroup))];
    const [user, setUser] = useState({});
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const open = Boolean(anchorEl);
    const [openModal, setOpenModal] = useState(false);
    const [tempFields, setTempFields] = useState(visibleFields);
    const [tempShowLabels, setTempShowLabels] = useState(showLabels);
    const [dragIndex, setDragIndex] = useState(null);

    const isFilterActive =
        selectedGroup !== "all" ||
        groupBy !== "none" ||
        sortBy !== "none";

    const resetFilters = () => {
        setSelectedGroup("all");
        setGroupBy("none");
        setSortBy("none");

        setSavedFilter(null);

        localStorage.removeItem("savedFilter");
    };

    const handleSaveFilter = () => {
        const filterData = { selectedGroup, groupBy, sortBy };
        localStorage.setItem("savedFilter", JSON.stringify(filterData));
        setSavedFilter(filterData);
        console.log(filterData);
    };

    const toggleBottomDrawer = (newOpen) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return
        }
        setOpenBottomDrawer(newOpen)
    }

    const handleDragStart = (index) => {
        setDragIndex(index);
    };

    const handleDrop = (index) => {
        const updated = [...fieldOrder];
        const draggedItem = updated[dragIndex];

        updated.splice(dragIndex, 1);
        updated.splice(index, 0, draggedItem);

        setFieldOrder(updated);
    };

    const labels = {
        efficiency: "Efficiency",
        production: "Production",
        speed: "Speed",
        average: "Average",
        totalRun: "Total Run",
        totalStop: "Total Stop",
        quality: "Quality"
    };

    const handleReset = () => {
        setTempFields({
            efficiency: true,  // only this stays checked
            production: false,
            speed: false,
            average: false,
            totalRun: false,
            totalStop: false,
            quality: false,
        });
    };

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);


    const toggleDrawer = (newOpen) => () => {
        setOpenDialogue(newOpen);
    };

    const handleIncCd = () => {
        if (groupBy === "none") {
            setVisibleCount((prev) => prev + 1);
        }
        else {
            setVisibleCount((prev) => Math.min(prev + 1, 4));
        }

    }
    const handleDecCd = () => {
        setVisibleCount((prev) => Math.max(1, prev - 1));
    }
    const handleIncCl = () => {
        setCounterCols((prev) => Math.min(prev + 1, 3));
    }
    const handleDecCl = () => {
        setCounterCols((prev) => Math.max(1, prev - 1));
    }

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
    const handleCard = () => {
        navigate("/card");
    }
    const handleUser = () => {
        navigate("/userinfo");
    }
    const handleCompany = () => {
        navigate("/companydetails");
    }
    const handleFullDetails = () => {
        navigate("/fulldetails");
    }

    useEffect(() => {
        document.documentElement.style.fontSize = `${fontScale * 16}px`;
    }, [fontScale]);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        const EMB_URL = import.meta.env.VITE_EMB_URL;
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${EMB_URL}/Api/data/getuserInfo`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            });
            if (!res.ok) {
                throw new Error("Failed to fetch user data");
            }

            const data = await res.json();
            const userData = data.ResultData[0];

            setUser(userData);

        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    const DrawerList = (
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={handleFullDetails} >
                        <ListItemText>
                            <div className="flex flex-col ml-4">
                                <span className="font-bold text-black">
                                    {user.FullName}
                                </span>
                                <span className="text-sm text-gray-500">
                                    {user.UserName}
                                </span>
                            </div>
                        </ListItemText>
                    </ListItemButton>
                </ListItem>
                <Divider />
                <ListItem disablePadding>
                    <ListItemButton onClick={handleDashboard} >
                        <ListItemIcon>
                            <DashboardIcon className='text-black' />
                            <div className='font-semibold ml-4 text-black'> Dashboard </div>
                        </ListItemIcon>
                    </ListItemButton>
                </ListItem>
                <Divider />
                <ListItem disablePadding>
                    <ListItemButton onClick={handleCard} >
                        <ListItemIcon>
                            <AppsIcon className='text-black' />
                            <div className='font-semibold ml-4 text-black'> Card Info </div>
                        </ListItemIcon>
                    </ListItemButton>
                </ListItem>
                <Divider />
                <ListItem disablePadding>
                    <ListItemButton onClick={handleUser}>
                        <ListItemIcon>
                            <AccountCircleIcon className='text-black' />
                            <div className='font-semibold ml-4 text-black'> User Info </div>
                        </ListItemIcon>
                    </ListItemButton>
                </ListItem>
                <Divider />
                <ListItem disablePadding>
                    <ListItemButton onClick={handleCompany}>
                        <ListItemIcon>
                            <BusinessIcon className='text-black' />
                            <div className='font-semibold ml-4 text-black'> Company Info </div>
                        </ListItemIcon>
                    </ListItemButton>
                </ListItem>
                <Divider />
                <ListItem disablePadding>
                    <ListItemButton onClick={handleLogout}>
                        <ListItemIcon>
                            <Logout fontSize="small" className='text-black' />
                            <div className='font-semibold ml-4 text-black'> Logout </div>
                        </ListItemIcon>
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    const list = () => (
        <Box
            sx={{ width: 'auto' }}
            role="presentation"
        >
            <List className='h-auto'>
                <ListItem disablePadding>
                    <ListItemIcon>
                        <div className='flex pt-2 items-center'>
                            <TuneIcon className='text-blue-500 ml-6 ' />
                            <p className='ml-4 font-bold text-2xl text-black'>Filter Setting</p>
                            <CloseIcon className='ml-[220px] text-black cursor-pointer' onClick={toggleBottomDrawer(false)} />
                        </div>
                    </ListItemIcon>
                </ListItem>
                <Divider />
                <ListItem disablePadding>
                    <p className='ml-4 pt-2 font-semibold text-black'>Current Filter :</p>
                </ListItem>
                <ListItem disablePadding>
                    <div className="ml-4 pt-2 text-sm">
                        {savedFilter ? (
                            <>
                                {savedFilter.selectedGroup !== "all" && (
                                    <p><b>Group:</b> {savedFilter.selectedGroup}</p>
                                )}

                                {savedFilter.groupBy !== "none" && (
                                    <p><b>Group By:</b> {savedFilter.groupBy}</p>
                                )}

                                {savedFilter.sortBy !== "none" && (
                                    <p><b>Sort By:</b> {savedFilter.sortBy}</p>
                                )}

                                {savedFilter.selectedGroup === "all" &&
                                    savedFilter.groupBy === "none" &&
                                    savedFilter.sortBy === "none" && (
                                        <p>No Active Filters</p>
                                    )}
                            </>
                        ) : (
                            <p>No Active Filters</p>
                        )}
                    </div>
                </ListItem>
                <ListItem style={{ justifyContent: "center", marginTop: "auto", paddingTop: "20px" }} disablePadding>
                    <Button disabled={!isFilterActive} onClick={handleSaveFilter} sx={{ width: "90%", backgroundColor: isFilterActive ? "#3b82f6" : "#9ca3af", color: "white", cursor: isFilterActive ? "pointer" : "not-allowed" }}>Save</Button>
                </ListItem>
                <ListItem style={{ justifyContent: "center", marginTop: "auto", paddingTop: "10px" }} disablePadding>
                    {savedFilter && (<Button onClick={() => {
                        localStorage.removeItem("savedFilter");
                        setSavedFilter(null);
                    }} color="error" sx={{ width: "90%" }}>Discard Saved Filter</Button>
                    )}
                </ListItem>
            </List>

        </Box>
    )

    return (
        <nav>
            <div>

                {/* ✅ ROW 1 (MAIN NAVBAR) */}
                <div className="flex items-center px-4 h-[55px]">

                    {/* LEFT SIDE */}
                    <div className="flex items-center gap-10">
                        <h1 className="text-2xl font-serif cursor-pointer" onClick={handleDashboard}>
                            MSENSE
                        </h1>

                        <div>
                            <Button onClick={toggleDrawer(true)} className='text-blue-400 cursor-pointer'><MenuIcon /></Button>
                            <Drawer open={openDialogue} onClose={toggleDrawer(false)} container={document.fullscreenElement} >
                                {DrawerList}
                            </Drawer>
                        </div>

                        <div className="flex items-center gap-2 text-[#1976d2]">
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
                    <div className="flex-1 flex justify-center -ml-[100px]">
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
                    <div className="flex items-center gap-2">
                        <Button onClick={() => setShowFilterData(!showFilterData)} sx={{ fontSize: "25px" }}>+</Button>
                        <Button onClick={() => setShowFilter(!showFilter)}>Filter</Button>
                        {handle.active ? (
                            <FullscreenExitIcon
                                onClick={handle.exit}
                                className="cursor-pointer text-blue-500"
                            />
                        ) : (
                            <FullscreenIcon
                                onClick={handle.enter}
                                className="cursor-pointer text-blue-500"
                            />
                        )}

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
                {showFilterData && (
                    <div className="flex items-center justify-between px-4 py-3">

                        {/* ✅ LEFT SIDE (CARD BUTTON) */}
                        <div>
                            <div className="border text-white rounded-lg px-4 py-[2px] bg-blue-500 cursor-pointer hover:bg-blue-700">
                                <Button onClick={cardPage} sx={{ color: "white" }}>
                                    Cards
                                </Button>
                            </div>
                        </div>

                        <div className='flex justify-center ml-[100px] gap-2'>

                            {/* ALL */}
                            <div onClick={() => setSelectedRange("all")}
                                className={`relative border rounded-lg px-8 py-[2px] text-center text-white cursor-pointer shadow-md bg-[#3c3f41] hover:bg-black`}
                            >
                                {selectedRange === "all" && (
                                    <span className="absolute top-1 left-2 text-sm">✅</span>
                                )}
                                <p className="text-lg font-bold">{totalCount}</p>
                                <p className="text-xs">All</p>
                            </div>

                            {/* 90-100 */}
                            <div onClick={() => setSelectedRange("90-100")}
                                className={`relative border rounded-lg px-6 py-[2px] text-center text-white cursor-pointer shadow-md bg-[#26de81] hover:bg-[#11c269]`}
                            >
                                {selectedRange === "90-100" && (
                                    <span className="absolute top-1 left-2 text-sm">✅</span>
                                )}
                                <p className="text-lg font-bold">{effCounts?.["90-100"]}</p>
                                <p className="text-xs">100-90</p>
                            </div>

                            {/* 80-90 */}
                            <div onClick={() => setSelectedRange("80-90")}
                                className={`relative border rounded-lg px-8 py-[2px] text-center text-white cursor-pointer shadow-md bg-[#4bcffa] hover:bg-[#25a3cd]`}
                            >
                                {selectedRange === "80-90" && (
                                    <span className="absolute top-1 left-2 text-sm">✅</span>
                                )}
                                <p className="text-lg font-bold">{effCounts?.["80-90"]}</p>
                                <p className="text-xs">90-80</p>
                            </div>

                            {/* 70-80 */}
                            <div onClick={() => setSelectedRange("70-80")}
                                className={`relative border rounded-lg px-8 py-[2px] text-center text-white cursor-pointer shadow-md bg-[#d6a2e8] hover:bg-[#a667bb]`}
                            >
                                {selectedRange === "70-80" && (
                                    <span className="absolute top-1 left-2 text-sm">✅</span>
                                )}
                                <p className="text-lg font-bold">{effCounts?.["70-80"]}</p>
                                <p className="text-xs">80-70</p>
                            </div>

                            {/* 60-70 */}
                            <div onClick={() => setSelectedRange("60-70")}
                                className={`relative border rounded-lg px-8 py-[2px] text-center text-white cursor-pointer shadow-md bg-[#f5cd79] hover:bg-[#cca551]`}
                            >
                                {selectedRange === "60-70" && (
                                    <span className="absolute top-1 left-2 text-sm">✅</span>
                                )}
                                <p className="text-lg font-bold">{effCounts?.["60-70"]}</p>
                                <p className="text-xs">70-60</p>
                            </div>

                            {/* 0-60 */}
                            <div onClick={() => setSelectedRange("below-60")}
                                className={`relative border rounded-lg px-8 py-[2px] text-center text-white cursor-pointer shadow-md bg-[#feb7b7] hover:bg-[#c95d5d]`}
                            >
                                {selectedRange === "below-60" && (
                                    <span className="absolute top-1 left-2 text-sm">✅</span>
                                )}
                                <p className="text-lg font-bold">{effCounts?.["0-60"]}</p>
                                <p className="text-xs">60-0</p>
                            </div>

                        </div>


                    </div>
                )}

                {showFilter && (
                    <div className="flex justify-end pt-4">
                        <div className="flex mr-auto items-center gap-4">

                            {/* GROUP */}
                            <TextField
                                select
                                label="Groups"
                                value={selectedGroup}
                                onChange={(e) => setSelectedGroup(e.target.value)}
                                size="small"
                                className="w-[200px]"
                                SelectProps={{
                                    MenuProps: {
                                        disablePortal: true,
                                        container: document.fullscreenElement || document.body,
                                    },
                                }}
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
                                SelectProps={{
                                    MenuProps: {
                                        disablePortal: true,
                                        container: document.fullscreenElement || document.body,
                                    },
                                }}
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
                                SelectProps={{
                                    MenuProps: {
                                        disablePortal: true,
                                        container: document.fullscreenElement || document.body,
                                    },
                                }}
                            >
                                <MenuItem value="none">None</MenuItem>
                                <MenuItem value="efficiencyhl">Efficiency H2L</MenuItem>
                                <MenuItem value="efficiencylh">Efficiency L2H</MenuItem>
                                <MenuItem value="productionhl">Production H2L</MenuItem>
                                <MenuItem value="productionlh">Production L2H</MenuItem>
                                <MenuItem value="speedhl">Speed H2L</MenuItem>
                                <MenuItem value="speedlh">Speed L2H</MenuItem>
                            </TextField>
                            <div className='-ml-6'>
                                <div className="flex justify-center p-4">
                                    <Button onClick={() => { resetFilters() }}><AutorenewIcon /></Button>
                                    <Button onClick={toggleBottomDrawer(true)}><SettingsIcon /></Button>
                                    <Drawer
                                        anchor="bottom"
                                        open={openBottomDrawer}
                                        onClose={toggleBottomDrawer(false)}
                                        PaperProps={{
                                            sx: {
                                                left: '35%',
                                                transform: 'translateX(-50%)',
                                                width: { xs: '90%', sm: 384, md: 480 }, // Responsive width: 90% on extra small, 384px on small, 480px on medium screens
                                                maxWidth: '500px', // Max width for larger screens
                                                borderTopLeftRadius: 16, // Rounded top corners
                                                borderTopRightRadius: 16,
                                            },
                                        }}
                                    >
                                        {list()}
                                    </Drawer>
                                </div>
                            </div>

                        </div>
                        {location.pathname === "/card" && (<div className="flex items-center justify-end px-4 py-3 gap-2">


                            <div> <h1 className="text-1xl">Cards: </h1> </div>
                            <div onClick={handleDecCd}
                                className={`border rounded-lg px-2.5 -py-2 text-center cursor-pointer border-blue-500`}
                            >
                                <p className="text-2xl">-</p>
                            </div>

                            <div><h1 className="text-1xl">{visibleCount}</h1></div>
                            <div onClick={handleIncCd}
                                className={`border rounded-lg px-2 -py-2 text-center cursor-pointer border-blue-500`}
                            >
                                <p className="text-2xl">+</p>
                            </div>

                            <div> <h1 className="text-1xl">Cols: </h1> </div>
                            <div onClick={handleDecCl}
                                className={`border rounded-lg px-2.5 -py-2 text-center cursor-pointer border-blue-500`}
                            >
                                <p className="text-2xl">-</p>
                            </div>

                            <div><h1 className="text-1xl">{counterCols}</h1></div>
                            <div onClick={handleIncCl}
                                className={`border rounded-lg px-2 -py-2 text-center cursor-pointer border-blue-500`}
                            >
                                <p className="text-2xl">+</p>
                            </div>

                            <div>
                                <Button onClick={handleOpenModal}><SettingsIcon /></Button>
                                <Modal
                                    open={openModal}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                    container={document.fullscreenElement}
                                >
                                    <Box sx={style} >
                                        <div className="flex items-center">
                                            <DashboardCustomizeIcon fontSize="large" className="text-blue-500" />
                                            <p className='text-lg font-semibold'>Card Display Setting</p>
                                            <p className='ml-auto text-sm'>Re-order fields</p>
                                        </div>
                                        <Typography id="modal-modal-title" variant="h6" component="h2">
                                            <FormGroup>
                                                {fieldOrder.map((field, index) => (
                                                    <div
                                                        key={field}
                                                        className="flex items-center p-1 rounded transition-all duration-200 hover:bg-gray-100"
                                                        draggable
                                                        onDragStart={() => handleDragStart(index)}
                                                        onDragOver={(e) => e.preventDefault()}
                                                        onDrop={() => handleDrop(index)}
                                                    >
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    checked={tempFields[field]}
                                                                    onChange={() =>
                                                                        setTempFields((prev) => ({
                                                                            ...prev,
                                                                            [field]: !prev[field]
                                                                        }))
                                                                    }
                                                                />
                                                            }
                                                            label={labels[field]}
                                                        />

                                                        <DragHandleIcon className="ml-auto cursor-grab active:cursor-grabbing text-gray-500 hover:text-black" />
                                                    </div>
                                                ))}
                                            </FormGroup>
                                            <FormGroup>
                                                <FormControlLabel control={<Checkbox
                                                    checked={tempShowLabels}
                                                    onChange={(e) =>
                                                        setTempShowLabels(e.target.checked)
                                                    }
                                                    name="labels"
                                                />} label="Show fields label on Card" />
                                            </FormGroup>
                                        </Typography>
                                        <Typography component="div" id="modal-modal-description" sx={{ mt: 2 }}>
                                            <div className='ml-6'>
                                                <Button onClick={handleReset} sx={{
                                                    color: "red",
                                                    marginLeft: "30px"
                                                }}> Reset </Button>
                                                <Button onClick={handleCloseModal} sx={{
                                                    backgroundColor: "red",
                                                    color: "white",
                                                    "&:hover": { backgroundColor: "darkred" },
                                                    marginLeft: "30px"
                                                }}> Cancel </Button>
                                                <Button onClick={() => { setVisibleFields(tempFields); setOpenModal(false); setShowLabels(tempShowLabels); }} sx={{
                                                    backgroundColor: "blue",
                                                    color: "white",
                                                    "&:hover": { backgroundColor: "darkblue" },
                                                    marginLeft: "30px"
                                                }}> Save </Button>
                                            </div>
                                        </Typography>
                                    </Box>
                                </Modal>
                            </div>
                        </div>
                        )}
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
                    disablePortal
                    container={document.fullscreenElement}
                >
                    <MenuItem onClick={handleProfile}>
                        <Avatar /> <p className='ml-4'>Profile</p>
                    </MenuItem>
                    <MenuItem onClick={handleCompanyinfo}>
                        <Avatar /> <p className='ml-4'>Company Details</p>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={toggleTheme}>
                        <ListItemIcon>
                            {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
                        </ListItemIcon>
                        <ListItemText>
                            {mode === "dark" ? "Light Mode" : "Dark Mode"}
                        </ListItemText>

                        <Switch checked={mode === "dark"} />
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                        <ListItemIcon>
                            <Logout fontSize="small" className='ml-1' />
                        </ListItemIcon>
                        Logout
                    </MenuItem>
                    <MenuItem>
                        <ListItemText>
                            <div className="flex items-center justify-end px-4 gap-2">
                                <div> <h1 className="text-1xl">font-scale: </h1> </div>
                                <div onClick={(e) => {
                                    e.stopPropagation();
                                    handleDecFn();
                                }}
                                    className={`border rounded-lg px-2.5 -py-2 text-center cursor-pointer border-blue-500`}
                                >
                                    <p className="text-2xl">-</p>
                                </div>

                                <div><h1 className="text-1xl">{fontScale.toFixed(1)}</h1></div>
                                <div onClick={(e) => {
                                    e.stopPropagation();
                                    handleIncFn();
                                }}
                                    className={`border rounded-lg px-2 -py-2 text-center cursor-pointer border-blue-500`}
                                >
                                    <p className="text-2xl">+</p>
                                </div>
                            </div>
                        </ListItemText>
                    </MenuItem>
                </Menu>

            </div>
        </nav >
    )
}

export default Navbar