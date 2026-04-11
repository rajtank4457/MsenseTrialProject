import React, { useState, useEffect } from 'react'
import Navbar from './Navbar'
import { useLocation } from "react-router-dom";
import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    Paper,
} from "@mui/material";

function Breakage() {
    const [breakageData, setBreakageData] = useState([]);
    const location = useLocation();
    const { fromdate, machineid, shiftid, machinename } = location.state || {};
    const [resultInfo, setResultInfo] = useState({});


    useEffect(() => {
        const fetchData = async () => {
            const EMB_URL = import.meta.env.VITE_EMB_URL;
            const token = localStorage.getItem("token");
            try {
                const res = await fetch(
                    `${EMB_URL}/api/data/getbreakagedetail?fromdate=${fromdate}&machineid=${machineid}&shiftid=${shiftid}`,
                    {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );

                const data = await res.json();
                const result = data.ResultData;
                const newData = data.ResultData?.BreakDetailHistory || [];
                setBreakageData(newData);
                setResultInfo(result);
            } catch (error) {
                console.error(error);
            }
        };

        if (fromdate && machineid && shiftid) {
            fetchData();
        }
    }, [fromdate, machineid, shiftid]);

    const getTotalBreakage = () => {
        let totalSeconds = 0;

        breakageData.forEach(item => {
            if (item.FromTime && item.EndTime) {
                const diff = new Date(item.EndTime) - new Date(item.FromTime);
                totalSeconds += Math.floor(diff / 1000);
            }
        });

        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;

        const pad = (n) => n.toString().padStart(2, "0");

        return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    };

    const getDuration = (from, to) => {
        const diff = new Date(to) - new Date(from);

        const totalSeconds = Math.floor(diff / 1000);

        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;

        // pad with 0 (e.g., 01, 09)
        const pad = (num) => num.toString().padStart(2, "0");

        return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    };

    return (
        <div className='pt-4'>

            <div className='pt-4'>
                <div className='flex justify-center '>
                    <h1 className='text-3xl font-semibold'>Machine : {machinename} </h1>
                    <h1 className='ml-[70px] text-3xl font-semibold'>Breakage Time : {getTotalBreakage()}</h1>
                </div>
                <div className='flex justify-center'>
                    <h1 className='text-2xl font-semibold'>{resultInfo.FromDate} To {resultInfo.EndDate}</h1>
                </div>
            </div>


            <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 3 }} className='machine-list'>
                <Table className='bordered-table'>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#1976d2" }}>
                            <TableCell sx={{ color: "#fff", fontWeight: "bold", textAlign: "Center" }}>Sr No.</TableCell>
                            <TableCell sx={{ color: "#fff", fontWeight: "bold", textAlign: "Center" }}>From</TableCell>
                            <TableCell sx={{ color: "#fff", fontWeight: "bold", textAlign: "Center" }}>Upto</TableCell>
                            <TableCell sx={{ color: "#fff", fontWeight: "bold", textAlign: "Center" }}>Duration</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {breakageData.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell sx={{ textAlign: "Center" }}>{item.SrNo}</TableCell>
                                <TableCell sx={{ textAlign: "Center" }}>{item.BreakageFromTime}</TableCell>
                                <TableCell sx={{ textAlign: "Center" }}>{item.BreakageEndTime}</TableCell>
                                <TableCell sx={{ textAlign: "Center" }}>{getDuration(item.FromTime, item.EndTime)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default Breakage