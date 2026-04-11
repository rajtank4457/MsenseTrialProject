import React, { useState } from 'react'
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
import { useNavigate } from 'react-router-dom';
import { useData } from "../../context/DataContext";
import { useThemeContext } from "../../context/ThemeContext";

function Dashboard() {
    const { mode } = useThemeContext();
    const { tableData,
        sortBy, setSortBy,
        groupBy, setGroupBy,
        selectedGroup, setSelectedGroup,
        statusFilter,
        selectedRange, setSelectedRange,
        effCounts,
        fontScale
    } = useData();
    const navigate = useNavigate();

    const showBeamColumn = tableData.some(
        item => item.IsShowBeam === true || item.IsShowBeam === "true"
    );

    const groupOrder = [
        "90 - 100",
        "80 - 90",
        "70 - 80",
        "60 - 70",
        "Below 60"
    ];

    const getFilteredRangeData = (data) => {
        if (selectedRange === "all") return data;

        return data.filter(machine => {
            const eff = machine.Efficiency;

            if (selectedRange === "90-100") {
                return eff >= 90 && eff <= 100;
            }
            if (selectedRange === "80-90") {
                return eff >= 80 && eff < 90;
            }
            if (selectedRange === "70-80") {
                return eff >= 70 && eff < 80;
            }
            if (selectedRange === "60-70") {
                return eff >= 60 && eff < 70;
            }
            if (selectedRange === "below-60") {
                return eff < 60;
            }

            return true;
        });
    };

    const getCurrentDate = () => {
        const d = new Date();

        const day = d.getDate().toString().padStart(2, "0");
        const month = d.toLocaleString("en-GB", { month: "short" });
        const year = d.getFullYear();

        return `${day}-${month}-${year}`;
    };

    const getEfficiencyClass = (eff) => {
        if (eff >= 90) return "green";
        if (eff >= 80 && eff < 90) return "blue";
        if (eff >= 70 && eff < 80) return "purple";
        if (eff >= 60 && eff < 70) return "orange";
        return "red";
    };


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


    const groupByDeviceGroup = (data) => {
        return data.reduce((acc, item) => {
            const group = item.DeviceGroup;

            if (!acc[group]) acc[group] = [];
            acc[group].push(item);

            return acc;
        }, {});
    };



    const groupByEfficiency = (data) => {
        return data.reduce((acc, item) => {
            const eff = Number(item.Efficiency);

            let group = "";

            if (eff >= 90 && eff <= 100) {
                group = "90 - 100";
            } else if (eff >= 80 && eff < 90) {
                group = "80 - 90";
            } else if (eff >= 70 && eff < 80) {
                group = "70 - 80";
            } else if (eff >= 60 && eff < 70) {
                group = "60 - 70";
            } else {
                group = "Below 60";
            }

            if (!acc[group]) acc[group] = [];
            acc[group].push(item);

            return acc;
        }, {});
    };


    const groupByStatus = (data) => {
        return data.reduce((acc, item) => {
            const group = item.IsRun ? "Running" : "Stopped";

            if (!acc[group]) acc[group] = [];
            acc[group].push(item);

            return acc;
        }, {});
    };




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
    const groupedDatabyEfficiency = groupByEfficiency(finalData);
    const groupedDatabyStatus = groupByStatus(finalData);
    const groupedData = groupByDeviceGroup(finalData);
    const filteredRangeData = getFilteredRangeData(finalData);


    return (
        <div className='text-center pt-4 ' style={{ fontSize: `${fontScale}rem` }} >
            <div>
                <TableContainer component={Paper} sx={{ borderRadius: 3 }} className='machine-list'>
                    <Table size='small' className='mt-[10px] bordered-table'>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "#1976d2" }}>
                                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Machine</TableCell>
                                <TableCell sx={{ color: "#fff", fontWeight: "bold" }} align="center">Efficiency</TableCell>
                                <TableCell sx={{ color: "#fff", fontWeight: "bold" }} align="center">Production</TableCell>
                                {showBeamColumn && (<TableCell sx={{ color: "#fff", fontWeight: "bold" }} align="center">Beam (%)</TableCell>)}
                                <TableCell sx={{ color: "#fff", fontWeight: "bold" }} align="center">Speed</TableCell>
                                <TableCell sx={{ color: "#fff", fontWeight: "bold" }} align="center">Average</TableCell>
                                <TableCell sx={{ color: "#fff", fontWeight: "bold" }} align="center">Duration</TableCell>
                                <TableCell sx={{ color: "#fff", fontWeight: "bold" }} align="center">Total Run</TableCell>
                                <TableCell sx={{ color: "#fff", fontWeight: "bold" }} align="center">Total Stop</TableCell>
                                {showBeamColumn && (<TableCell sx={{ color: "#fff", fontWeight: "bold" }} align="center">Quality</TableCell>)}
                                <TableCell sx={{ color: "#fff", fontWeight: "bold" }} align="center">Stopage</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {groupBy === "none" && Array.isArray(finalData) && filteredRangeData.map((item, index) => (
                                <TableRow key={index} hover
                                    sx={{
                                        backgroundColor:
                                            mode === "light" ? (index % 2 === 0 ? "#f9f9f9" : "#fff")
                                                : (index % 2 === 0 ? "#2b2b2b" : "#3c3f41")
                                    }}>
                                    <TableCell>{item.ProductionMachineCode}</TableCell>
                                    <TableCell align="center">
                                        <div className="progress-container"><progress className={`progress-bar ${getEfficiencyClass(item.Efficiency)} border border-solid align-middle`} value={item.Efficiency} max={100} /><span className="progress-text">{item.Efficiency}%</span>
                                        </div>
                                    </TableCell>
                                    <TableCell align="center">{item.CumulativeProduction}</TableCell>
                                    {showBeamColumn && (<TableCell align="center">{(item.IsShowBeam === true || item.IsShowBeam === "true")
                                        ? item.BeamPercentageUse
                                        : ""}</TableCell>)}
                                    <TableCell align="center">{item.Speed}</TableCell>
                                    <TableCell align="center">{item.Average}</TableCell>
                                    <TableCell align="center" sx={{
                                        color: item.IsRun ? "#26de82" : "#e16b6b"
                                    }}>{item.Duration}</TableCell>
                                    <TableCell align="center"
                                        onClick={() => navigate(`/rundetail/${item.ProductionMachineID}`, {
                                            state: {
                                                fromdate: getCurrentDate(),
                                                machineid: item.ProductionMachineID,
                                                shiftid: item.ShiftID,
                                                machinename: item.ProductionMachineCode
                                            }
                                        })}
                                        sx={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}>{item.TotalRun}</TableCell>
                                    <TableCell align="center">{item.TotalStop}</TableCell>
                                    {showBeamColumn && (<TableCell align="center">{item.Quality}</TableCell>)}
                                    <TableCell
                                        align="center"
                                        onClick={() => navigate(`/breakage/${item.ProductionMachineID}`, {
                                            state: {
                                                fromdate: getCurrentDate(),
                                                machineid: item.ProductionMachineID,
                                                shiftid: item.ShiftID,
                                                machinename: item.ProductionMachineCode
                                            }
                                        })}
                                        sx={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
                                    >{item.BrkCount}
                                    </TableCell>
                                </TableRow>
                            ))}

                            {groupBy === "groupname" &&
                                Object.entries(groupedData).sort(([a], [b]) => {
                                    const numA = parseInt(a.split(" ")[0]);
                                    const numB = parseInt(b.split(" ")[0]);
                                    return numA - numB;
                                }).map(([groupName, machines]) => {

                                    const sortedMachines = getSortedData(machines);
                                    return (
                                        <React.Fragment key={groupName}>

                                            <TableRow>
                                                <TableCell
                                                    colSpan={15}
                                                    sx={{
                                                        backgroundColor: "#e3f2fd",
                                                        fontWeight: "bold",
                                                        fontSize: "16px",
                                                        textAlign: "center",
                                                    }}>
                                                    {groupName}
                                                </TableCell>
                                            </TableRow>

                                            {sortedMachines.map((item, index) => (
                                                <TableRow key={index} hover>
                                                    <TableCell>{item.ProductionMachineCode}</TableCell>
                                                    <TableCell align="center">
                                                        <div className="progress-container"><progress className={`progress-bar ${getEfficiencyClass(item.Efficiency)}`} value={item.Efficiency} max={100} /><span className="progress-text">{item.Efficiency}%</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell align="center">{item.CumulativeProduction}</TableCell>
                                                    <TableCell align="center">{(item.IsShowBeam === true || item.IsShowBeam === "true")
                                                        ? item.BeamPercentageUse
                                                        : ""}</TableCell>
                                                    <TableCell align="center">{item.Speed}</TableCell>
                                                    <TableCell align="center">{item.Average || "-"}</TableCell>
                                                    <TableCell align="center" sx={{
                                                        color: item.IsRun ? "#26de82" : "#e16b6b"
                                                    }}>{item.Duration}</TableCell>
                                                    <TableCell align="center">{item.TotalRun || "-"}</TableCell>
                                                    <TableCell align="center">{item.TotalStop || "-"}</TableCell>
                                                    <TableCell align="center">{item.Quality || "-"}</TableCell>
                                                    <TableCell align="center">{item.BrkCount}</TableCell>
                                                </TableRow>
                                            ))}
                                        </React.Fragment>
                                    )
                                })
                            }

                            {groupBy === "efficiency" && Object.entries(groupedDatabyEfficiency).sort(([a], [b]) => groupOrder.indexOf(a) - groupOrder.indexOf(b)).map(([groupName, items]) => {

                                const sortedItems = getSortedData(items);

                                return (
                                    <React.Fragment key={groupName}>
                                        <TableRow>
                                            <TableCell colSpan={15} style={{ fontWeight: "bold", textAlign: "center" }}>
                                                {groupName}
                                            </TableCell>
                                        </TableRow>

                                        {sortedItems.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{item.ProductionMachineCode}</TableCell>
                                                <TableCell align="center">
                                                    <div className="progress-container"><progress className={`progress-bar ${getEfficiencyClass(item.Efficiency)}`} value={item.Efficiency} max={100} /><span className="progress-text">{item.Efficiency}%</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell align="center">{item.CumulativeProduction}</TableCell>
                                                <TableCell align="center">{(item.IsShowBeam === true || item.IsShowBeam === "true")
                                                    ? item.BeamPercentageUse
                                                    : ""}</TableCell>
                                                <TableCell align="center">{item.Speed}</TableCell>
                                                <TableCell align="center">{item.Average || "-"}</TableCell>
                                                <TableCell align="center" sx={{
                                                    color: item.IsRun ? "#26de82" : "#e16b6b"
                                                }}>{item.Duration}</TableCell>
                                                <TableCell align="center">{item.TotalRun || "-"}</TableCell>
                                                <TableCell align="center">{item.TotalStop || "-"}</TableCell>
                                                <TableCell align="center">{item.Quality || "-"}</TableCell>
                                                <TableCell align="center">{item.BrkCount}</TableCell>
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
                                            <TableCell colSpan={15} style={{ fontWeight: "bold", textAlign: "center" }}>
                                                {groupName}
                                            </TableCell>
                                        </TableRow>

                                        {sortedItems.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{item.ProductionMachineCode}</TableCell>
                                                <TableCell align="center">
                                                    <div className="progress-container"><progress className={`progress-bar ${getEfficiencyClass(item.Efficiency)}`} value={item.Efficiency} max={100} /><span className="progress-text">{item.Efficiency}%</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell align="center">{item.CumulativeProduction}</TableCell>
                                                <TableCell align="center">{(item.IsShowBeam === true || item.IsShowBeam === "true")
                                                    ? item.BeamPercentageUse
                                                    : ""}</TableCell>
                                                <TableCell align="center">{item.Speed}</TableCell>
                                                <TableCell align="center">{item.Average || "-"}</TableCell>
                                                <TableCell align="center" sx={{
                                                    color: item.IsRun ? "#26de82" : "#e16b6b"
                                                }}>{item.Duration}</TableCell>
                                                <TableCell align="center">{item.TotalRun || "-"}</TableCell>
                                                <TableCell align="center">{item.TotalStop || "-"}</TableCell>
                                                <TableCell align="center">{item.Quality || "-"}</TableCell>
                                                <TableCell align="center">{item.BrkCount}</TableCell>
                                            </TableRow>
                                        ))}
                                    </React.Fragment>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

        </div >
    )
}

export default Dashboard