import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import { Paper, Typography, Grid, TextField, Button } from '@mui/material'
import { useData } from "../../context/DataContext";

function UserInfo() {
    const { tableData } = useData();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
    })

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
            })

        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    return (
        <div className='pt-4'>
            <div className='pt-[100px]'>
                <Paper sx={{ padding: 4, maxWidth: 900, margin: "auto" }}>
                    <Typography variant="h5" className='text-center' gutterBottom>
                        User Information
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
        </div>
    )
}

export default UserInfo