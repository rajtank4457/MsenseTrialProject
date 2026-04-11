import React, { useState, useEffect } from 'react'
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
import { useThemeContext } from "../../context/ThemeContext";

function RunDetail() {
    const { mode } = useThemeContext();
    const [runData, setRunData] = useState([]);
    const location = useLocation();
    const { fromdate, machineid, shiftid, machinename } = location.state || {};
    const [resultInfo, setResultInfo] = useState({});
    const [totalData, setTotalData] = useState({});
    const [user, setUser] = useState({});

    const showPickColumn = user?.IndustryType === "WaterJet";

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

    useEffect(() => {
        const fetchData = async () => {
            const EMB_URL = import.meta.env.VITE_EMB_URL;
            const token = localStorage.getItem("token");
            try {
                const res = await fetch(
                    `${EMB_URL}/api/data/getproductionreporthourlydetail?fromdate=${fromdate}&machineid=${machineid}&shiftid=${shiftid}`,
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
                const newData = data.ResultData?.HourlyProductionData || [];
                const brkTotal = data.ResultData?.ProductionSummary || [];
                setRunData(newData);
                setResultInfo(result);
                setTotalData(brkTotal[0] || {});

            } catch (error) {
                console.error(error);
            }
        };


        if (fromdate && machineid && shiftid) {
            fetchData();
        }
    }, [fromdate, machineid, shiftid]);

    return (
        <div className='pt-4'>

            <div className='pt-4'>
                <div className='flex justify-center '>
                    <h1 className='text-3xl font-semibold'>Machine : {machinename} </h1>
                </div>
                <div className='flex justify-center'>
                    <h1 className='text-2xl font-semibold'>{resultInfo.FromDate} To {resultInfo.EndDate}</h1>
                </div>
            </div>


            <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 3 }} className='machine-list'>
                <Table className='bordered-table'>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#1976d2" }}>
                            <TableCell sx={{ color: "#fff", fontWeight: "bold", textAlign: "center" }}>Duration</TableCell>
                            <TableCell sx={{ color: "#fff", fontWeight: "bold", textAlign: "center" }}>Production</TableCell>
                            {showPickColumn && (<TableCell sx={{ color: "#fff", fontWeight: "bold", textAlign: "center" }}>Pick</TableCell>)}
                            <TableCell sx={{ color: "#fff", fontWeight: "bold", textAlign: "center" }}>Average</TableCell>
                            <TableCell sx={{ color: "#fff", fontWeight: "bold", textAlign: "center" }}>Total Run</TableCell>
                            <TableCell sx={{ color: "#fff", fontWeight: "bold", textAlign: "center" }}>Breakage</TableCell>
                            <TableCell sx={{ color: "#fff", fontWeight: "bold", textAlign: "center" }}>Efficiency</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {runData.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell sx={{ textAlign: "center" }}>{item.HourTime?.split(" TO ").map(t => t.split(" ").slice(1).join(" ")).join(" - ")}</TableCell>
                                <TableCell sx={{ textAlign: "center" }}> {item.ActualProduction}
                                </TableCell>
                                {showPickColumn && (<TableCell sx={{ textAlign: "center" }}>{item.AlterProduction}</TableCell>)}
                                <TableCell sx={{ textAlign: "center" }}>{item.Average}</TableCell>
                                <TableCell sx={{ textAlign: "center" }}>{item.RunTime}</TableCell>
                                <TableCell sx={{ textAlign: "center" }}>{item.StopTime}</TableCell>
                                <TableCell sx={{ textAlign: "center" }}>{item.Efficiency}%</TableCell>
                            </TableRow>
                        ))}
                        <TableRow sx={{ backgroundColor: "#b5d8f4" }}>
                            <TableCell sx={{ textAlign: "center", fontWeight: "Bold", color: mode === "Dark" ? "#171c20" : "#171c20" }}>Total</TableCell>
                            <TableCell sx={{ textAlign: "center", fontWeight: "Bold", color: mode === "Dark" ? "#171c20" : "#171c20" }}>{Math.ceil(totalData.TotalProduction)}</TableCell>
                            {showPickColumn && (<TableCell sx={{ textAlign: "center", fontWeight: "Bold", color: mode === "Dark" ? "#171c20" : "#171c20" }}>{totalData.TotalAlterProduction}</TableCell>)}
                            <TableCell sx={{ textAlign: "center", fontWeight: "Bold", color: mode === "Dark" ? "#171c20" : "#171c20" }}>{totalData.Average}</TableCell>
                            <TableCell sx={{ textAlign: "center", fontWeight: "Bold", color: mode === "Dark" ? "#171c20" : "#171c20" }}>{totalData.TotalRuntime}</TableCell>
                            <TableCell sx={{ textAlign: "center", fontWeight: "Bold", color: mode === "Dark" ? "#171c20" : "#171c20" }}>{totalData.TotalStopTime}</TableCell>
                            <TableCell sx={{ textAlign: "center", fontWeight: "Bold", color: mode === "Dark" ? "#171c20" : "#171c20" }}>{totalData.Efficiency}%</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default RunDetail
