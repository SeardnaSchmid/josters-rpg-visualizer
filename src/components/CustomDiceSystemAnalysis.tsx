import React from 'react';
import { AdvantageDistributionChart } from './AdvantageDistributionChart.js';
import { SuccessRateChart } from './SuccessRateChart.js';

interface CustomDiceSystemAnalysisProps {
  rollCount: number;
}

const CustomDiceSystemAnalysis: React.FC<CustomDiceSystemAnalysisProps> = ({ rollCount }) => {


  return (
    <div style={{ padding: '1em' }}>
      {/* System Explanation */}
      <div style={{ 
        marginBottom: '1em',
        padding: '1em',
        backgroundColor: '#f0f9ff',
        borderRadius: '8px',
        border: '1px solid #bae6fd'
      }}>
        <h3 style={{ 
          margin: '0 0 0.5em 0', 
          color: '#1e40af', 
          fontSize: '1.1em',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5em'
        }}>
          📋 System Explanation
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '0.5em',
          marginBottom: '0.5em'
        }}>
          <div style={{ fontSize: '0.9em', color: '#1e40af' }}>
            <strong>Strong Disadvantage:</strong> 3 dice, highest counts (worst option)
          </div>
          <div style={{ fontSize: '0.9em', color: '#1e40af' }}>
            <strong>Disadvantage:</strong> 2 dice, highest counts
          </div>
          <div style={{ fontSize: '0.9em', color: '#1e40af' }}>
            <strong>Normal:</strong> 3 dice, middle counts (baseline)
          </div>
          <div style={{ fontSize: '0.9em', color: '#1e40af' }}>
            <strong>Advantage:</strong> 2 dice, lowest counts
          </div>
          <div style={{ fontSize: '0.9em', color: '#1e40af' }}>
            <strong>Strong Advantage:</strong> 3 dice, lowest counts (best option)
          </div>
        </div>
        <div style={{ 
          fontSize: '0.9em', 
          color: '#1e40af',
          fontWeight: '500',
          padding: '0.5em',
          backgroundColor: '#dbeafe',
          borderRadius: '4px'
        }}>
          <strong>Success:</strong> Die value ≤ Target value. The difference (Target value - Die value) are the successes.
        </div>
      </div>

      <div style={{ 
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #e9ecef',
        padding: '1em',
        marginBottom: '1em'
      }}>
        <AdvantageDistributionChart 
          rollCount={rollCount} 
        />
      </div>

      <div style={{ 
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #e9ecef',
        padding: '1em',
        marginBottom: '1em'
      }}>
        <SuccessRateChart 
          rollCount={rollCount} 
        />
      </div>


    </div>
  );
};

export { CustomDiceSystemAnalysis };
export default CustomDiceSystemAnalysis;
