import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Navbar from './Navbar';
import {
    Table,
    TableRow,
    TableCell,
    TableBody,
    CardHeader
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent } from "@mui/material";

export default function CardInfo() {
    const [machines, setMachines] = useState([]);
    const [statusFilter, setStatusFilter] = useState("all");
    const [showFilter, setShowFilter] = useState(false);

    const runningCount = machines.filter(item => item.IsRun === true || item.IsRun === "true").length;
    const stoppedCount = machines.filter(item => item.IsRun === false || item.IsRun === "false").length;
    const totalCount = machines.length;

    const [selectedMachine, setSelectedMachine] = useState(null);
    const [open, setOpen] = useState(false);

    const handleOpen = (machines) => {
        setSelectedMachine(machines);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedMachine(null);
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
            setMachines(newData);
        }
    };

    return (
        <div className='pt-4'>
            <Navbar runningCount={runningCount}
                stoppedCount={stoppedCount}
                totalCount={totalCount}
                setStatusFilter={setStatusFilter}
                statusFilter={statusFilter}
                showFilter={showFilter}
                setShowFilter={setShowFilter} />

            <div className='flex flex-wrap gap-6 pt-6'>
                {machines.map((machine, index) => (
                    <Card key={index} sx={{ width: 280, borderRadius: 3, boxShadow: 3, cursor: "pointer" }} onClick={() => handleOpen(machine)}>
                        <CardHeader
                            title={machine.ProductionMachine}
                            sx={{ backgroundColor: "#1976d2", color: "white", textAlign: "center" }}
                        />
                        <CardContent>
                            <Table size="small">
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Efficiency</TableCell>
                                        <TableCell align="right">{machine.Efficiency}%</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Production</TableCell>
                                        <TableCell align="right">{machine.CumulativeProduction}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Speed</TableCell>
                                        <TableCell align="right">{machine.Speed}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Average</TableCell>
                                        <TableCell align="right">{machine.Average}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Total Run</TableCell>
                                        <TableCell align="right">{machine.TotalRun}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Total Stop</TableCell>
                                        <TableCell align="right">{machine.TotalStop}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                ))}

                <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                    <DialogContent>
                        {selectedMachine && (
                            <Card sx={{ borderRadius: 3, boxShadow: 5 }}>
                                <CardHeader
                                    title={selectedMachine.ProductionMachine}
                                    sx={{
                                        backgroundColor: "#1976d2",
                                        color: "white",
                                        textAlign: "center"
                                    }}
                                />

                                <CardContent>
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
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
