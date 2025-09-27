import React from 'react';
import { Box } from '@mui/material';
import { DiceDistributionChart } from './DiceDistributionChart.js';

interface DiceDistributionViewProps {
  rollCount: number;
}

const DiceDistributionView: React.FC<DiceDistributionViewProps> = ({ rollCount }) => {
  return (
    <Box sx={{ 
      backgroundColor: 'white',
      borderRadius: '8px',
      border: '1px solid #e9ecef',
      padding: '1em',
      marginBottom: '1em'
    }}>
      <DiceDistributionChart rollCount={rollCount} />
    </Box>
  );
};

export default DiceDistributionView;
