import React from 'react';
import { Box } from '@mui/material';
import { AdvantageDistributionChart } from './AdvantageDistributionChart.js';

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
      <AdvantageDistributionChart rollCount={rollCount} />
    </Box>
  );
};

export default DiceDistributionView;
