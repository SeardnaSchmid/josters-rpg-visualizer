import React from 'react';
import { Box } from '@mui/material';
import { SuccessRateChart } from './SuccessRateChart.js';

interface SuccessRateViewProps {
  rollCount: number;
}

const SuccessRateView: React.FC<SuccessRateViewProps> = ({ rollCount }) => {
  return (
    <Box sx={{ 
      backgroundColor: 'white',
      borderRadius: '8px',
      border: '1px solid #e9ecef',
      padding: '1em',
      marginBottom: '1em'
    }}>
      <SuccessRateChart rollCount={rollCount} />
    </Box>
  );
};

export default SuccessRateView;
