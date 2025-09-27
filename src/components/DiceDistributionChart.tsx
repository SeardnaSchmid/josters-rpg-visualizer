import React, { useEffect, useRef, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
// Custom crosshair plugin for both horizontal and vertical lines
const crosshairPlugin = {
  id: 'crosshair',
  afterInit: (chart: any) => {
    chart.crosshair = { x: 0, y: 0, draw: false };
  },
  afterEvent: (chart: any, args: any) => {
    const { inChartArea } = args;
    const { type, x, y } = args.event;

    if (type === 'mousemove' || type === 'mouseout') {
      chart.crosshair = { x, y, draw: inChartArea };
      chart.draw();
    }
  },
  beforeDatasetsDraw: (chart: any) => {
    const { ctx, chartArea: { top, bottom, left, right } } = chart;
    const { x, y, draw } = chart.crosshair;

    if (!draw) return;

    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#666';
    ctx.setLineDash([5, 5]);
    // Vertical line
    ctx.moveTo(x, bottom);
    ctx.lineTo(x, top);
    // Horizontal line
    ctx.moveTo(left, y);
    ctx.lineTo(right, y);
    ctx.stroke();
    ctx.restore();
  }
};
import { ADVANTAGE_CONFIGS, simulateAllAdvantageLevels } from '../lib/custom-dice-system.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  crosshairPlugin
);

interface DiceDistributionChartProps {
  rollCount: number;
}

export const DiceDistributionChart: React.FC<DiceDistributionChartProps> = ({
  rollCount
}) => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const calculateDistribution = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Run simulation using new interface
        const results = simulateAllAdvantageLevels(10, rollCount); // Fixed target value of 10
        
        // Prepare data for Chart.js
        const labels = Array.from({ length: 20 }, (_, i) => (i + 1).toString());

        const datasets = Object.entries(ADVANTAGE_CONFIGS).map(([advantageLevel, config], index: number) => {
          const result = results[advantageLevel as keyof typeof results];
          const data = labels.map(label => result?.distribution[label] || 0);
          
          // Normalize data to percentages
          const total = data.reduce((sum, value) => sum + value, 0);
          const normalizedData = data.map(value => (value / total) * 100);
          
          // Define line styles based on advantage type
          let borderColor, borderDash, borderWidth;
          
          if (advantageLevel === 'normal') {
            // Standard: blue
            borderColor = '#3b82f6';
            borderDash = [];
            borderWidth = 2;
          } else if (advantageLevel === 'advantage') {
            // Simple advantage: green
            borderColor = '#22c55e';
            borderDash = [];
            borderWidth = 1.5;
          } else if (advantageLevel === 'disadvantage') {
            // Simple disadvantage: orange
            borderColor = '#f97316';
            borderDash = [];
            borderWidth = 1.5;
          } else if (advantageLevel === 'strong-advantage') {
            // Strong advantage: dark green
            borderColor = '#16a34a';
            borderDash = [];
            borderWidth = 2.5;
          } else if (advantageLevel === 'strong-disadvantage') {
            // Strong disadvantage: red
            borderColor = '#ef4444';
            borderDash = [];
            borderWidth = 2.5;
          }
          
          return {
            label: config.label,
            data: normalizedData,
            borderColor: borderColor,
            backgroundColor: getAdvantageColor(advantageLevel, 0.1),
            tension: 0.1,
            pointRadius: advantageLevel === 'normal' ? 4 : 2,
            pointHoverRadius: advantageLevel === 'normal' ? 6 : 4,
            borderDash: borderDash,
            borderWidth: borderWidth,
            pointStyle: advantageLevel.includes('advantage') ? 'triangle' : (advantageLevel.includes('disadvantage') ? 'rect' : 'circle'),
            fill: false,
          };
        });
        
        setData({
          labels,
          datasets
        });
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    calculateDistribution();
  }, [rollCount]);

  const getAdvantageColor = (advantageId: string, alpha: number = 1): string => {
    const colors: Record<string, string> = {
      'strong-disadvantage': `rgba(220, 38, 127, ${alpha})`, // Dark red
      'disadvantage': `rgba(239, 68, 68, ${alpha})`, // Red
      'normal': `rgba(59, 130, 246, ${alpha})`, // Blue
      'advantage': `rgba(34, 197, 94, ${alpha})`, // Green
      'strong-advantage': `rgba(22, 163, 74, ${alpha})`, // Dark green
    };
    return colors[advantageId] || `rgba(59, 130, 246, ${alpha})`;
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: `TTRPG Dice System - Advantage/Disadvantage Distributions`,
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      legend: {
        display: true,
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context: any) {
            const value = context.parsed.y;
            return `${context.dataset.label}: ${value.toFixed(2)}%`;
          }
        }
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Die value'
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Probability (%)'
        },
        min: 0,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    },
    interaction: {
      mode: 'index',
      axis: 'x',
      intersect: false
    },
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px',
        fontSize: '16px',
        color: '#666'
      }}>
        Calculating distributions... ({rollCount.toLocaleString()} rolls)
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px',
        fontSize: '16px',
        color: '#dc2626'
      }}>
        Error: {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px',
        fontSize: '16px',
        color: '#666'
      }}>
        No data available
      </div>
    );
  }

  return (
    <div style={{ height: '500px', width: '100%' }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default DiceDistributionChart;
