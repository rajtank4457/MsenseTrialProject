import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    TextField,
    Button,
    Paper,
    Grid,
    Typography,
    MenuItem,
} from "@mui/material";

function Login() {
    const EMB_URL = import.meta.env.VITE_EMB_URL; 
    const [loading, setLoading] = React.useState(false);
    const [formData, setFormData] = React.useState({
        username: "",
        password: "",
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${EMB_URL}/token?DeviceClientID=1`, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({
                    username: formData.username,
                    password: formData.password,
                    grant_type: "password",
                }),
            });

            const data = await res.json();
            console.log("API Data:", data);

            if (res.ok) {
                const token = data.access_token;
                alert(`Login Successful!\nToken: ${token}`);
                localStorage.setItem("token", token);
                navigate("/dashboard");
            } else {
                alert(data.error_description || "Login failed");
            }

        } catch (error) {
            console.error(error);
            alert("Something went wrong!");
        }

        setLoading(false);
    }


    return (
        <div style={{ padding: 150, display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", border: "20px" }} className='bg-blue-400'>
            <Paper sx={{ padding: 4, maxWidth: 900, margin: "auto" }} elevation={3}>
                <Typography variant="h4" sx={{ textAlign: "center", fontWeight: "bold" }}>
                    Login
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Typography variant="h6" sx={{ mt: 4 }}>
                        Login Information
                    </Typography>

                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField label="Username" name="username" onChange={handleChange}  fullWidth required />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6, mt: 4 }} >
                            <TextField label="Password" name="password" type="password" onChange={handleChange}  fullWidth required />
                        </Grid>
                    </Grid>

                    <Button type="submit" variant="contained" fullWidth sx={{ mt: 4 }}>
                        {loading ? "Logging in..." : "Login"}
                    </Button>
                </form>
            </Paper>

        </div>
    )
}
export default Login