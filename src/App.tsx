import './chartSetup.js'; // Import chart setup FIRST
import { useState } from "react";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Paper } from '@mui/material';
import CustomDiceSystemAnalysis from "./components/CustomDiceSystemAnalysis.js";
import SidebarLayout from "./components/SidebarLayout.js";

// Create MUI theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});


const DEFAULT_ROLL_COUNT = 5000;

export default function App() {
  const [currentView, setCurrentView] = useState('custom-dice-system');
  
  // Global roll count state
  const [globalRollCount, setGlobalRollCount] = useState(DEFAULT_ROLL_COUNT);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'custom-dice-system':
        return (
          <Box>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" component="h2">
                  3d20 System Analysis
                </Typography>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Roll Count</InputLabel>
                  <Select
                    value={globalRollCount}
                    onChange={e => setGlobalRollCount(Number(e.target.value))}
                    label="Roll Count"
                  >
                    <MenuItem value={5000}>5,000</MenuItem>
                    <MenuItem value={20000}>20,000</MenuItem>
                    <MenuItem value={50000}>50,000</MenuItem>
                    <MenuItem value={100000}>100,000</MenuItem>
                    <MenuItem value={500000}>500,000</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Paper>
            <CustomDiceSystemAnalysis rollCount={globalRollCount} />
          </Box>
        );
      default:
        return (
          <Box>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" component="h2">
                  3d20 System Analysis
                </Typography>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Roll Count</InputLabel>
                  <Select
                    value={globalRollCount}
                    onChange={e => setGlobalRollCount(Number(e.target.value))}
                    label="Roll Count"
                  >
                    <MenuItem value={5000}>5,000</MenuItem>
                    <MenuItem value={20000}>20,000</MenuItem>
                    <MenuItem value={50000}>50,000</MenuItem>
                    <MenuItem value={100000}>100,000</MenuItem>
                    <MenuItem value={500000}>500,000</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Paper>
            <CustomDiceSystemAnalysis rollCount={globalRollCount} />
          </Box>
        );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SidebarLayout currentView={currentView} onViewChange={setCurrentView}>
        {renderCurrentView()}
      </SidebarLayout>
    </ThemeProvider>
  );
}