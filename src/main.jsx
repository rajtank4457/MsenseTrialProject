import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { DataProvider } from "./context/DataContext";
import { ThemeProviderCustom, useThemeContext } from "./context/ThemeContext";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { BrowserRouter } from "react-router-dom";

function MainApp() {
  const { theme } = useThemeContext();

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DataProvider>
      <ThemeProviderCustom>
        <MainApp />
      </ThemeProviderCustom>
    </DataProvider>
  </StrictMode>,
)