import React, { useState, useEffect } from 'react'
import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    Paper,
    TextField,
    MenuItem,
    Button
} from "@mui/material";
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const EMB_URL = import.meta.env.VITE_EMB_URL;
    const [tableData, setTableData] = useState([]);
    const [sortBy, setSortBy] = useState("none");
    const [groupBy, setGroupBy] = useState("none");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedGroup, setSelectedGroup] = useState("all");
    const [showFilter, setShowFilter] = useState(false);
    const navigate = useNavigate();


    const runningCount = tableData.filter(item => item.IsRun === true || item.IsRun === "true").length;
    const stoppedCount = tableData.filter(item => item.IsRun === false || item.IsRun === "false").length;
    const totalCount = tableData.length;

    const handleChange = (e) => {
        setSortBy(e.target.value);
    };
    const handleChangeGroupby = (e) => {
        setGroupBy(e.target.value);
    }

    const cardPage = () => {
        navigate("/card");
    }

    const groupOptions = [...new Set(tableData.map(item => item.DeviceGroup))];

    const getGroupFilteredData = (data) => {
        if (selectedGroup === "all") return data;

        return data.filter(item => item.DeviceGroup === selectedGroup);
    };

    const isRunning = (val) => {
        const v = String(val).toLowerCase().trim();
        return ["true", "1", "running"].includes(v);
    };

    const isStopped = (val) => {
        const v = String(val).toLowerCase().trim();
        return ["false", "0", "stopped", "stop"].includes(v);
    };

    const getFilteredData = () => {
        if (statusFilter === "running") {
            return tableData.filter(item => isRunning(item.IsRun));
        }

        if (statusFilter === "stopped") {
            return tableData.filter(item => isStopped(item.IsRun));
        }

        return tableData;
    };

    const filteredData = getFilteredData();

    useEffect(() => {
        fetchData();
        const interval = setInterval(() => {
            fetchData();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const groupByDeviceGroup = (data) => {
        return data.reduce((acc, item) => {
            const group = item.DeviceGroup;

            if (!acc[group]) acc[group] = [];
            acc[group].push(item);

            return acc;
        }, {});
    };

    const groupedData = groupByDeviceGroup(tableData);

    const groupByEfficiency = (data) => {
        return data.reduce((acc, item) => {
            const eff = Number(item.Efficiency);

            let group = "";

            if (eff >= 80 && eff <= 100) {
                group = "80 - 100";
            } else if (eff >= 60 && eff < 80) {
                group = "60 - 80";
            } else {
                group = "Below 60";
            }

            if (!acc[group]) acc[group] = [];
            acc[group].push(item);

            return acc;
        }, {});
    };

    const groupedDatabyEfficiency = groupByEfficiency(tableData);

    const groupByStatus = (data) => {
        return data.reduce((acc, item) => {
            const group = item.IsRun ? "Running" : "Stopped";

            if (!acc[group]) acc[group] = [];
            acc[group].push(item);

            return acc;
        }, {});
    };

    const groupedDatabyStatus = groupByStatus(tableData);


    const getSortedData = (data) => {
        let sortedData = [...data];

        switch (sortBy) {
            case "efficiencyhl":
                sortedData.sort((a, b) => b.Efficiency - a.Efficiency);
                break;

            case "efficiencylh":
                sortedData.sort((a, b) => a.Efficiency - b.Efficiency);
                break;

            case "productionhl":
                sortedData.sort((a, b) => b.CumulativeProduction - a.CumulativeProduction);
                break;

            case "productionlh":
                sortedData.sort((a, b) => a.CumulativeProduction - b.CumulativeProduction);
                break;

            case "speedhl":
                sortedData.sort((a, b) => b.Speed - a.Speed);
                break;

            case "speedlh":
                sortedData.sort((a, b) => a.Speed - b.Speed);
                break;

            default:
                break;
        }

        return sortedData;
    };

    const sortedData = getSortedData(filteredData);
    const finalData = getGroupFilteredData(sortedData);

    const fetchData = async () => {

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
                const newData = data.ResultData.LiveProductionData;
                setTableData((prevData) => {
                    return newData.map((newItem) => {
                        const oldItem = prevData.find(
                            (item) => item.Machine === newItem.Machine
                        );

                        if (!oldItem) return newItem;

                        if (JSON.stringify(oldItem) !== JSON.stringify(newItem)) {
                            return newItem;
                        }

                        return oldItem;
                    });
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    

    return (
        <div className='text-center pt-4 '>
            <Navbar runningCount={runningCount}
                stoppedCount={stoppedCount}
                totalCount={totalCount}
                setStatusFilter={setStatusFilter}
                statusFilter={statusFilter}
                showFilter={showFilter}
                setShowFilter={setShowFilter} />
            <div>
                {showFilter && (<div className='flex justify-end'>
                    <div className="mt-6 mb-2 mr-auto ml-[100px] border text-white rounded-lg px-4 py-[2px] bg-blue-500  text-center cursor-pointer hover:bg-blue-700 ">
                        <Button onClick={cardPage} sx={{ color: "white" }}>Cards</Button>
                    </div>
                    <div className="mt-6 mb-2 mr-8">
                        <TextField
                            select
                            label="Groups:"
                            value={selectedGroup}
                            onChange={(e) => setSelectedGroup(e.target.value)}
                            size="small"
                            className='w-[200px]'
                        >
                            <MenuItem value="all">All</MenuItem>
                            {groupOptions.map((group, index) => (
                                <MenuItem key={index} value={group}>
                                    {group}
                                </MenuItem>
                            ))}
                        </TextField>
                    </div>
                    <div className="mt-6 mb-2 mr-8">
                        <TextField
                            select
                            label="Group by"
                            value={groupBy}
                            onChange={handleChangeGroupby}
                            size="small"
                            className='w-[200px]'
                        >
                            <MenuItem value="none">None</MenuItem>
                            <MenuItem value="groupname">Group Name</MenuItem>
                            <MenuItem value="efficiency">Efficiency</MenuItem>
                            <MenuItem value="status">Status</MenuItem>
                        </TextField>
                    </div>
                    <div className="mt-6 mb-2 mr-8">
                        <TextField
                            select
                            label="Sort by"
                            value={sortBy}
                            onChange={handleChange}
                            size="small"
                            className='w-[200px]'
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

                <TableContainer component={Paper} sx={{ mt: 4, borderRadius: 3 }}>
                    <Table className='mt-4 bordered-table'>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "#1976d2" }}>
                                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Machine</TableCell>
                                <TableCell sx={{ color: "#fff", fontWeight: "bold" }} align="center">Efficiency</TableCell>
                                <TableCell sx={{ color: "#fff", fontWeight: "bold" }} align="center">Production</TableCell>
                                <TableCell sx={{ color: "#fff", fontWeight: "bold" }} align="center">Speed</TableCell>
                                <TableCell sx={{ color: "#fff", fontWeight: "bold" }} align="center">Average</TableCell>
                                <TableCell sx={{ color: "#fff", fontWeight: "bold" }} align="center">Total Run</TableCell>
                                <TableCell sx={{ color: "#fff", fontWeight: "bold" }} align="center">Total Stop</TableCell>
                                {/* <TableCell sx={{ color: "#fff", fontWeight: "bold" }} align="center">Quality</TableCell> */}
                            </TableRow>
                        </TableHead>
                        <TableBody>

                            {selectedGroup !== "all" && (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        sx={{
                                            backgroundColor: "#e3f2fd",
                                            fontWeight: "bold",
                                            fontSize: "16px",
                                            textAlign: "center"
                                        }}
                                    >
                                        {selectedGroup}
                                    </TableCell>
                                </TableRow>
                            )}
                            {groupBy === "none" && Array.isArray(finalData) && finalData.map((item, index) => (
                                <TableRow key={index} hover
                                    sx={{
                                        backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff"
                                    }}>
                                    <TableCell>{item.ProductionMachine}</TableCell>
                                    <TableCell align="center">{item.Efficiency}%</TableCell>
                                    <TableCell align="center">{item.CumulativeProduction}</TableCell>
                                    <TableCell align="center">{item.Speed}</TableCell>
                                    <TableCell align="center">{item.Average}</TableCell>
                                    <TableCell align="center">{item.TotalRun}</TableCell>
                                    <TableCell align="center">{item.TotalStop}</TableCell>
                                    {/* <TableCell align="center">{item.Quality}</TableCell> */}
                                </TableRow>
                            ))}

                            {groupBy === "groupname" &&
                                Object.entries(groupedData).map(([groupName, machines]) => {

                                    const sortedMachines = getSortedData(machines);
                                    return (
                                        <React.Fragment key={groupName}>

                                            <TableRow>
                                                <TableCell
                                                    colSpan={7}
                                                    sx={{
                                                        backgroundColor: "#e3f2fd",
                                                        fontWeight: "bold",
                                                        fontSize: "16px",
                                                        textAlign: "center"
                                                    }}
                                                >
                                                    {groupName}
                                                </TableCell>
                                            </TableRow>

                                            {sortedMachines.map((item, index) => (
                                                <TableRow key={index} hover>
                                                    <TableCell>{item.ProductionMachine}</TableCell>
                                                    <TableCell align="center">{item.Efficiency}%</TableCell>
                                                    <TableCell align="center">{item.CumulativeProduction}</TableCell>
                                                    <TableCell align="center">{item.Speed}</TableCell>
                                                    <TableCell align="center">{item.Average || "-"}</TableCell>
                                                    <TableCell align="center">{item.TotalRun || "-"}</TableCell>
                                                    <TableCell align="center">{item.TotalStop || "-"}</TableCell>
                                                </TableRow>
                                            ))}
                                        </React.Fragment>
                                    )
                                })
                            }

                            {groupBy === "efficiency" && Object.entries(groupedDatabyEfficiency).map(([groupName, items]) => {

                                const sortedItems = getSortedData(items);

                                return (
                                    <React.Fragment key={groupName}>
                                        <TableRow>
                                            <TableCell colSpan={7} style={{ fontWeight: "bold", textAlign: "center" }}>
                                                {groupName}
                                            </TableCell>
                                        </TableRow>

                                        {sortedItems.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{item.ProductionMachine}</TableCell>
                                                <TableCell align="center">{item.Efficiency}%</TableCell>
                                                <TableCell align="center">{item.CumulativeProduction}</TableCell>
                                                <TableCell align="center">{item.Speed}</TableCell>
                                                <TableCell align="center">{item.Average || "-"}</TableCell>
                                                <TableCell align="center">{item.TotalRun || "-"}</TableCell>
                                                <TableCell align="center">{item.TotalStop || "-"}</TableCell>
                                            </TableRow>
                                        ))}
                                    </React.Fragment>
                                )
                            })}

                            {groupBy === "status" && Object.entries(groupedDatabyStatus).map(([groupName, items]) => {

                                const sortedItems = getSortedData(items);

                                return (
                                    <React.Fragment key={groupName}>
                                        <TableRow>
                                            <TableCell colSpan={7} style={{ fontWeight: "bold", textAlign: "center" }}>
                                                {groupName}
                                            </TableCell>
                                        </TableRow>

                                        {sortedItems.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{item.ProductionMachine}</TableCell>
                                                <TableCell align="center">{item.Efficiency}%</TableCell>
                                                <TableCell align="center">{item.CumulativeProduction}</TableCell>
                                                <TableCell align="center">{item.Speed}</TableCell>
                                                <TableCell align="center">{item.Average || "-"}</TableCell>
                                                <TableCell align="center">{item.TotalRun || "-"}</TableCell>
                                                <TableCell align="center">{item.TotalStop || "-"}</TableCell>
                                            </TableRow>
                                        ))}
                                    </React.Fragment>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

        </div>
    )
}

export default Dashboard