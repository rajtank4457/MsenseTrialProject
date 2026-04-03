import React, { useState, useEffect } from 'react'
import Navbar from './Navbar'
import { Paper, Typography, Grid, TextField, Button } from '@mui/material';
import { useData } from "../../context/DataContext";

function CompanyDetails() {
    const {
            runningCount,
            stoppedCount,
            totalCount,
            avgEfficiency,
            avgSpeed,
            statusFilter,
            setStatusFilter
        } = useData();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({
        company_id: "",
        register_date: "",
        license_date: "",
        company_name: "",
        company_code: "",
        company_address: "",
    })
    const [showFilter, setShowFilter] = useState(false);
    const [machines, setMachines] = useState([]);


    const getDaysLeft = (date) => {
        if (!date) return "";

        const today = new Date();
        const expiry = new Date(date);

        today.setHours(0, 0, 0, 0);
        expiry.setHours(0, 0, 0, 0);

        const diffTime = expiry - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const getLicenseText = (date) => {
        const days = getDaysLeft(date);

        if (days < 0) return "Expired ❌";
        if (days <= 7) return `${days} days (Expiring Soon ⚠️)`;
        return `${days} Days (Active ✅)`;
    };

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

            setUser({
                company_id: userData.CompanyID || "",
                register_date: userData.RegisterDate.split("T")[0] || "",
                license_date: userData.LicenseDate.split("T")[0] || "",
                company_name: userData.CompanyName || "",
                company_code: userData.CompanyCode || "",
                company_address: userData.CompanyAddress || "",
            })

        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

   
    return (
        <div className='pt-4'>
            <Navbar
                showFilter={showFilter}
                setShowFilter={setShowFilter} />
            <div className='pt-[100px]'>
                <Paper sx={{ padding: 4, maxWidth: 900, margin: "auto" }}>
                    <Typography variant="h5" className='text-center' gutterBottom>
                        Company Information
                    </Typography>

                    <form>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Company Id"
                                    name="company_id"
                                    value={user.company_id}
                                    onChange={(e) =>
                                        setUser({ ...user, company_id: e.target.value })}
                                    fullWidth
                                    required
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Registered Date"
                                    name="register_date"
                                    value={user.register_date}
                                    onChange={(e) =>
                                        setUser({ ...user, register_date: e.target.value })}
                                    fullWidth
                                    required
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="License Date"
                                    name="license_date"
                                    value={user.license_date}
                                    onChange={(e) =>
                                        setUser({ ...user, license_date: e.target.value })}
                                    fullWidth
                                    required
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="License Expire Time"
                                    name="license_expire"
                                    value={`${getLicenseText(user.license_date)}`}
                                    fullWidth
                                    required
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Company Name"
                                    name="company_name"
                                    value={user.company_name}
                                    onChange={(e) =>
                                        setUser({ ...user, company_name: e.target.value })}
                                    fullWidth
                                    required
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Company Code"
                                    name="company_code"
                                    value={user.company_code}
                                    onChange={(e) =>
                                        setUser({ ...user, company_code: e.target.value })}
                                    fullWidth
                                    required
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Company Address"
                                    name="company_address"
                                    value={user.company_address}
                                    onChange={(e) =>
                                        setUser({ ...user, company_address: e.target.value })}
                                    fullWidth
                                    required
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{ mt: 4, py: 1.5 }}
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </Button>
                    </form>
                </Paper>
            </div>
        </div>
    )
}

export default CompanyDetails