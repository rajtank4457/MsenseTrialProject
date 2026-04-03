import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Navbar from './Navbar';
import {
    Table,
    TableRow,
    TableCell,
    TableBody,
    CardHeader,
    Box
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent } from "@mui/material";
import { useData } from "../../context/DataContext";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { useThemeContext } from "../../context/ThemeContext";


export default function CardInfo() {
    const { mode } = useThemeContext();
    const { tableData,
        sortBy, setSortBy,
        groupBy, setGroupBy,
        selectedGroup, setSelectedGroup,
        statusFilter,
        selectedRange, setSelectedRange,
    } = useData();
    const [showFilter, setShowFilter] = useState(false);
    const [selectedMachineId, setSelectedMachineId] = useState(null);
    const [open, setOpen] = useState(false);

    const runningCount = tableData.filter(item => item.IsRun === true || item.IsRun === "true").length;
    const stoppedCount = tableData.filter(item => item.IsRun === false || item.IsRun === "false").length;
    const totalCount = tableData.length;



    const handleOpen = (machine) => {
        setSelectedMachineId(machine.ProductionMachine);
        setOpen(true);
    };

    const groupOrder = [
        "90 - 100",
        "80 - 90",
        "70 - 80",
        "60 - 70",
        "Below 60"
    ];

    const handleClose = () => {
        setOpen(false);
        setSelectedMachineId(null);
    };

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

    const selectedMachine = finalData.find(
        m => m.ProductionMachine === selectedMachineId
    );

    return (
        <div className='pt-4'>
            <Navbar runningCount={runningCount}
                stoppedCount={stoppedCount}
                totalCount={totalCount}
                showFilter={showFilter}
                setShowFilter={setShowFilter}
            />

            <div className="machine-container">
                {groupBy === "none" && filteredRangeData.map((machine, index) => (
                    <Card
                        key={index}
                        className="machine-card"
                        onClick={() => handleOpen(machine)}
                    >
                        <CardHeader title={
                            <div style={{ display: "flex", textAlign: "center", gap: "8px" }}>
                                <div className='flex items-center'>
                                    {machine.ProductionMachine}
                                </div>
                                <div className='ml-auto'>
                                    {machine.IsRun ? (
                                        <PlayArrowIcon style={{ backgroundColor: "rgb(46, 125, 50)" }} />
                                    ) : (
                                        <PauseIcon style={{ backgroundColor: "#b9b9b9" }} />
                                    )}
                                </div>
                            </div>
                        } sx={{
                            backgroundColor:
                                machine.IsRun ? "rgb(46, 125, 50)" :
                                    "#b9b9b9",
                            color: "#fff"
                        }} />

                        <CardContent sx={{
                            backgroundColor:
                                machine.Efficiency >= 90 ? "rgb(38, 222, 130)" :
                                    machine.Efficiency >= 80 && machine.Efficiency < 90 ? "rgb(75, 206, 250)" :
                                        machine.Efficiency >= 70 && machine.Efficiency < 80 ? "rgb(215, 162, 232)" :
                                            machine.Efficiency >= 60 && machine.Efficiency < 70 ? "rgb(245, 205, 120)" :
                                                "rgb(255, 184, 184)",
                            color: "#fff"
                        }}>
                            <Table size="small">
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Efficiency</TableCell>
                                        <TableCell>{machine.Efficiency}%</TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell>Production</TableCell>
                                        <TableCell>{machine.CumulativeProduction}</TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell>Speed</TableCell>
                                        <TableCell>{machine.Speed}</TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell>Average</TableCell>
                                        <TableCell>{machine.Average}</TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell>Total Run</TableCell>
                                        <TableCell>{machine.TotalRun}</TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell>Total Stop</TableCell>
                                        <TableCell>{machine.TotalStop}</TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell>Quality</TableCell>
                                        <TableCell className="ellipsis">
                                            {machine.Quality}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                ))}

                {groupBy === "groupname" &&
                    Object.entries(groupedData).sort(([a], [b]) => {
                        const numA = parseInt(a.split(" ")[0]);
                        const numB = parseInt(b.split(" ")[0]);
                        return numA - numB;
                    }).map(([groupName, machines]) => {

                        const sortedMachines = getSortedData(machines);
                        return (
                            <Box key={groupName} sx={{ width: '100%' }}>

                                {/* The Group Header (Light Blue Bar) */}
                                <Box
                                    sx={{
                                        backgroundColor:
                                            mode === "dark" ? "#3c3f41" : "#e3f2fd",
                                        fontWeight: "bold",
                                        fontSize: "16px",
                                        textAlign: "center",
                                        pr: 10,
                                        py: 0.5,
                                        borderBottom: '1px solid #ccc'
                                    }}
                                >
                                    {groupName}
                                </Box>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: 2,
                                        p: 2,
                                    }}
                                >
                                    {sortedMachines.map((machine, index) => (
                                        <Card
                                            key={index}
                                            className="machine-card"
                                            onClick={() => handleOpen(machine)}
                                        >
                                            <CardHeader title={
                                                <div style={{ display: "flex", textAlign: "center", gap: "8px" }}>
                                                    <div className='flex items-center'>
                                                        {machine.ProductionMachine}
                                                    </div>
                                                    <div className='ml-auto'>
                                                        {machine.IsRun ? (
                                                            <PlayArrowIcon style={{ backgroundColor: "rgb(46, 125, 50)" }} />
                                                        ) : (
                                                            <PauseIcon style={{ backgroundColor: "#b9b9b9" }} />
                                                        )}
                                                    </div>
                                                </div>
                                            } sx={{
                                                backgroundColor:
                                                    machine.IsRun ? "rgb(46, 125, 50)" :
                                                        "#b9b9b9",
                                                color: "#fff"
                                            }} />

                                            <CardContent sx={{
                                                backgroundColor:
                                                    machine.Efficiency >= 90 ? "rgb(38, 222, 130)" :
                                                        machine.Efficiency >= 80 && machine.Efficiency < 90 ? "rgb(75, 206, 250)" :
                                                            machine.Efficiency >= 70 && machine.Efficiency < 80 ? "rgb(215, 162, 232)" :
                                                                machine.Efficiency >= 60 && machine.Efficiency < 70 ? "rgb(245, 205, 120)" :
                                                                    "rgb(255, 184, 184)",
                                                color: "#fff"
                                            }}>
                                                <Table size="small">
                                                    <TableBody>
                                                        <TableRow>
                                                            <TableCell>Efficiency</TableCell>
                                                            <TableCell>{machine.Efficiency}%</TableCell>
                                                        </TableRow>

                                                        <TableRow>
                                                            <TableCell>Production</TableCell>
                                                            <TableCell>{machine.CumulativeProduction}</TableCell>
                                                        </TableRow>

                                                        <TableRow>
                                                            <TableCell>Speed</TableCell>
                                                            <TableCell>{machine.Speed}</TableCell>
                                                        </TableRow>

                                                        <TableRow>
                                                            <TableCell>Average</TableCell>
                                                            <TableCell>{machine.Average}</TableCell>
                                                        </TableRow>

                                                        <TableRow>
                                                            <TableCell>Total Run</TableCell>
                                                            <TableCell>{machine.TotalRun}</TableCell>
                                                        </TableRow>

                                                        <TableRow>
                                                            <TableCell>Total Stop</TableCell>
                                                            <TableCell>{machine.TotalStop}</TableCell>
                                                        </TableRow>

                                                        <TableRow>
                                                            <TableCell>Quality</TableCell>
                                                            <TableCell className="ellipsis">
                                                                {machine.Quality}
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </Box>
                            </Box>
                        )
                    })}

                {groupBy === "efficiency" && Object.entries(groupedDatabyEfficiency).sort(([a], [b]) => groupOrder.indexOf(a) - groupOrder.indexOf(b)).map(([groupName, machines]) => {

                    const sortedItems = getSortedData(machines);

                    return (
                        <Box key={groupName} sx={{ width: '100%' }}>
                            <Box
                                sx={{
                                    backgroundColor:
                                        mode === "dark" ? "#3c3f41" : "#e3f2fd",
                                    fontWeight: "bold",
                                    fontSize: "16px",
                                    textAlign: "center",
                                    pr: 10,
                                    py: 0.5,
                                    borderBottom: '1px solid #ccc'
                                }}
                            >
                                {groupName}
                            </Box>

                            <Box
                                sx={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: 2,
                                    p: 2, // Optional background for card area
                                }}
                            >
                                {sortedItems.map((machine, index) => (
                                    <Card
                                        key={index}
                                        className="machine-card"
                                        onClick={() => handleOpen(machine)}
                                    >
                                        <CardHeader title={
                                            <div style={{ display: "flex", textAlign: "center", gap: "8px" }}>
                                                <div className='flex items-center'>
                                                    {machine.ProductionMachine}
                                                </div>
                                                <div className='ml-auto'>
                                                    {machine.IsRun ? (
                                                        <PlayArrowIcon style={{ backgroundColor: "rgb(46, 125, 50)" }} />
                                                    ) : (
                                                        <PauseIcon style={{ backgroundColor: "#b9b9b9" }} />
                                                    )}
                                                </div>
                                            </div>
                                        } sx={{
                                            backgroundColor:
                                                machine.IsRun ? "rgb(46, 125, 50)" :
                                                    "#b9b9b9",
                                            color: "#fff"
                                        }} />

                                        <CardContent sx={{
                                            backgroundColor:
                                                machine.Efficiency >= 90 ? "rgb(38, 222, 130)" :
                                                    machine.Efficiency >= 80 && machine.Efficiency < 90 ? "rgb(75, 206, 250)" :
                                                        machine.Efficiency >= 70 && machine.Efficiency < 80 ? "rgb(215, 162, 232)" :
                                                            machine.Efficiency >= 60 && machine.Efficiency < 70 ? "rgb(245, 205, 120)" :
                                                                "rgb(255, 184, 184)",
                                            color: "#fff"
                                        }}>
                                            <Table size="small">
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell>Efficiency</TableCell>
                                                        <TableCell>{machine.Efficiency}%</TableCell>
                                                    </TableRow>

                                                    <TableRow>
                                                        <TableCell>Production</TableCell>
                                                        <TableCell>{machine.CumulativeProduction}</TableCell>
                                                    </TableRow>

                                                    <TableRow>
                                                        <TableCell>Speed</TableCell>
                                                        <TableCell>{machine.Speed}</TableCell>
                                                    </TableRow>

                                                    <TableRow>
                                                        <TableCell>Average</TableCell>
                                                        <TableCell>{machine.Average}</TableCell>
                                                    </TableRow>

                                                    <TableRow>
                                                        <TableCell>Total Run</TableCell>
                                                        <TableCell>{machine.TotalRun}</TableCell>
                                                    </TableRow>

                                                    <TableRow>
                                                        <TableCell>Total Stop</TableCell>
                                                        <TableCell>{machine.TotalStop}</TableCell>
                                                    </TableRow>

                                                    <TableRow>
                                                        <TableCell>Quality</TableCell>
                                                        <TableCell className="ellipsis">
                                                            {machine.Quality}
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Box>
                        </Box>
                    )
                })}

                {groupBy === "status" && Object.entries(groupedDatabyStatus).map(([groupName, machines]) => {

                    const sortedItems = getSortedData(machines);

                    return (
                        <Box key={groupName} sx={{ width: '100%' }}>
                            <Box
                                sx={{
                                    backgroundColor:
                                        mode === "dark" ? "#3c3f41" : "#e3f2fd",
                                    fontWeight: "bold",
                                    fontSize: "16px",
                                    textAlign: "center",
                                    pr: 10,
                                    py: 0.5,
                                    borderBottom: '1px solid #ccc'
                                }}
                            >
                                {groupName}
                            </Box>

                            <Box
                                sx={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: 2,
                                    p: 2, // Optional background for card area
                                }}
                            >
                                {sortedItems.map((machine, index) => (
                                    <Card
                                        key={index}
                                        className="machine-card"
                                        onClick={() => handleOpen(machine)}
                                    >
                                        <CardHeader title={
                                            <div style={{ display: "flex", textAlign: "center", gap: "8px" }}>
                                                <div className='flex items-center'>
                                                    {machine.ProductionMachine}
                                                </div>
                                                <div className='ml-auto'>
                                                    {machine.IsRun ? (
                                                        <PlayArrowIcon style={{ backgroundColor: "rgb(46, 125, 50)" }} />
                                                    ) : (
                                                        <PauseIcon style={{ backgroundColor: "#b9b9b9" }} />
                                                    )}
                                                </div>
                                            </div>
                                        } sx={{
                                            backgroundColor:
                                                machine.IsRun ? "rgb(46, 125, 50)" :
                                                    "#b9b9b9",
                                            color: "#fff"
                                        }} />

                                        <CardContent sx={{
                                            backgroundColor:
                                                machine.Efficiency >= 90 ? "rgb(38, 222, 130)" :
                                                    machine.Efficiency >= 80 && machine.Efficiency < 90 ? "rgb(75, 206, 250)" :
                                                        machine.Efficiency >= 70 && machine.Efficiency < 80 ? "rgb(215, 162, 232)" :
                                                            machine.Efficiency >= 60 && machine.Efficiency < 70 ? "rgb(245, 205, 120)" :
                                                                "rgb(255, 184, 184)",
                                            color: "#fff"
                                        }}>
                                            <Table size="small">
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell>Efficiency</TableCell>
                                                        <TableCell>{machine.Efficiency}%</TableCell>
                                                    </TableRow>

                                                    <TableRow>
                                                        <TableCell>Production</TableCell>
                                                        <TableCell>{machine.CumulativeProduction}</TableCell>
                                                    </TableRow>

                                                    <TableRow>
                                                        <TableCell>Speed</TableCell>
                                                        <TableCell>{machine.Speed}</TableCell>
                                                    </TableRow>

                                                    <TableRow>
                                                        <TableCell>Average</TableCell>
                                                        <TableCell>{machine.Average}</TableCell>
                                                    </TableRow>

                                                    <TableRow>
                                                        <TableCell>Total Run</TableCell>
                                                        <TableCell>{machine.TotalRun}</TableCell>
                                                    </TableRow>

                                                    <TableRow>
                                                        <TableCell>Total Stop</TableCell>
                                                        <TableCell>{machine.TotalStop}</TableCell>
                                                    </TableRow>

                                                    <TableRow>
                                                        <TableCell>Quality</TableCell>
                                                        <TableCell className="ellipsis">
                                                            {machine.Quality}
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Box>
                        </Box>
                    )
                })}


                <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                    <DialogContent>
                        {selectedMachine && (
                            <Card sx={{ borderRadius: 3, boxShadow: 5 }}>
                                <CardHeader
                                    title={
                                        <div style={{ display: "flex", textAlign: "center", gap: "8px" }}>
                                            <div className='flex items-center'>
                                                {selectedMachine.ProductionMachine}
                                            </div>
                                            <div className='ml-auto'>
                                                {selectedMachine.IsRun ? (
                                                    <PlayArrowIcon style={{ backgroundColor: "rgb(46, 125, 50)" }} />
                                                ) : (
                                                    <PauseIcon style={{ backgroundColor: "#b9b9b9" }} />
                                                )}
                                            </div>
                                        </div>
                                    }
                                    sx={{
                                        backgroundColor: selectedMachine.IsRun ? "rgb(46, 125, 50)" :
                                            "#b9b9b9",
                                        color: "white",
                                        textAlign: "center"
                                    }}
                                />

                                <CardContent sx={{
                                    backgroundColor:
                                        selectedMachine.Efficiency >= 90 ? "rgb(38, 222, 130)" :
                                            selectedMachine.Efficiency >= 80 && selectedMachine.Efficiency < 90 ? "rgb(75, 206, 250)" :
                                                selectedMachine.Efficiency >= 70 && selectedMachine.Efficiency < 80 ? "rgb(215, 162, 232)" :
                                                    selectedMachine.Efficiency >= 60 && selectedMachine.Efficiency < 70 ? "rgb(245, 205, 120)" :
                                                        "rgb(255, 184, 184)",
                                    color: "#fff"
                                }}>
                                    <Table>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>Efficiency</TableCell>
                                                <TableCell align="right">{selectedMachine.Efficiency}%</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Production</TableCell>
                                                <TableCell align="right">{selectedMachine.CumulativeProduction}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Speed</TableCell>
                                                <TableCell align="right">{selectedMachine.Speed}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Average</TableCell>
                                                <TableCell align="right">{selectedMachine.Average}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Total Run</TableCell>
                                                <TableCell align="right">{selectedMachine.TotalRun}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Total Stop</TableCell>
                                                <TableCell align="right">{selectedMachine.TotalStop}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Quality</TableCell>
                                                <TableCell align="right">{selectedMachine.Quality}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </div >
    );
}
