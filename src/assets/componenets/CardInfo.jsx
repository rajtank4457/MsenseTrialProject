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

export default function CardInfo() {
    const [machines, setMachines] = useState([]);

    useEffect(() => {
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
            console.log(data.ResultData);

            if (res.ok) {
                setMachines(data.ResultData.LiveProductionData);
            }
        };

        fetchData();
    }, []);
    return (
        <div className='pt-4'>
            <Navbar />

            <div className='flex flex-wrap gap-6 pt-6'>
                {machines.map((machine, index) => (
                    <Card key={index} sx={{ width: 280, borderRadius: 3, boxShadow: 3 }}>
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
            </div>
        </div>
    );
}
