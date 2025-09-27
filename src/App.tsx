import './chartSetup.js'; // Import chart setup FIRST
import { useState } from "react";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import DiceDistributionView from "./components/DiceDistributionView.js";
import DiceSystemLayout from "./components/DiceSystemLayout.js";

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


const DEFAULT_ROLL_COUNT = 10000;

export default function App() {
  // Global roll count state
  const [globalRollCount, setGlobalRollCount] = useState(DEFAULT_ROLL_COUNT);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DiceSystemLayout 
        rollCount={globalRollCount}
        onRollCountChange={setGlobalRollCount}
      >
        <DiceDistributionView rollCount={globalRollCount} />
      </DiceSystemLayout>
    </ThemeProvider>
  );
}