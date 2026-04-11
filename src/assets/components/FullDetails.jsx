import React, { useEffect, useState } from 'react'
import { Paper, Typography, Grid, TextField, Button } from '@mui/material'
import { useData } from "../../context/DataContext";
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';

function FullDetails() {
    const { tableData } = useData();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        company_id: "",
        register_date: "",
        license_date: "",
        company_name: "",
        company_code: "",
        company_address: "",
    });

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
                first_name: userData.FirstName || "",
                last_name: userData.LastName || "",
                email: userData.Email || "",
                phone_number: userData.MobileNo || "",
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
        <div className='pt-4 flex '>
            <div className='pt-[100px] ml-[200px]'>
                <Paper sx={{ padding: 4, maxWidth: 500, margin: "auto", height: "100%" }}>
                    
                    <Typography variant="h5" className='text-center' gutterBottom>
                       <PersonIcon fontSize='large'/> User Information
                    </Typography>

                    <form>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="First Name"
                                    name="first_name"
                                    value={user.first_name}
                                    onChange={(e) =>
                                        setUser({ ...user, first_name: e.target.value })}
                                    fullWidth
                                    required
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Last Name"
                                    name="last_name"
                                    value={user.last_name}
                                    onChange={(e) =>
                                        setUser({ ...user, last_name: e.target.value })}
                                    fullWidth
                                    required
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Email"
                                    name="email"
                                    value={user.email}
                                    onChange={(e) =>
                                        setUser({ ...user, email: e.target.value })}
                                    fullWidth
                                    required
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Phone Number"
                                    name="phone_number"
                                    value={user.phone_number}
                                    onChange={(e) =>
                                        setUser({ ...user, phone_number: e.target.value })}
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

            <div className='pt-[100px] ml-[100px] mr-6'>
                <Paper sx={{ padding: 4, maxWidth: 500, margin: "auto" }}>
                    <Typography variant="h5" className='text-center' gutterBottom>
                        <BusinessIcon fontSize='large'/> Company Information
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

export default FullDetails