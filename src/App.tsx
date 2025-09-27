import './chartSetup.js'; // Import chart setup FIRST
import { useState } from "react";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Paper } from '@mui/material';
import CustomDiceSystemAnalysis from "./components/CustomDiceSystemAnalysis.js";
import DiceDistributionView from "./components/DiceDistributionView.js";
import SuccessRateView from "./components/SuccessRateView.js";
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
  const [currentView, setCurrentView] = useState('dice-distribution');
  
  // Global roll count state
  const [globalRollCount, setGlobalRollCount] = useState(DEFAULT_ROLL_COUNT);


  const renderCurrentView = () => {
    switch (currentView) {
      case 'dice-distribution':
        return <DiceDistributionView rollCount={globalRollCount} />;
      case 'success-rate':
        return <SuccessRateView rollCount={globalRollCount} />;
      case 'system-overview':
        return <CustomDiceSystemAnalysis rollCount={globalRollCount} />;
      default:
        return <DiceDistributionView rollCount={globalRollCount} />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SidebarLayout 
        currentView={currentView} 
        onViewChange={setCurrentView}
        rollCount={globalRollCount}
        onRollCountChange={setGlobalRollCount}
      >
        {renderCurrentView()}
      </SidebarLayout>
    </ThemeProvider>
  );
}