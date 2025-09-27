import React, { useEffect, useState } from 'react';
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
import { ADVANTAGE_TYPES, getAdvantageTypeDistribution } from '../lib/custom-dice-system.js';

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

interface SuccessRateChartProps {
  rollCount: number;
}

export const SuccessRateChart: React.FC<SuccessRateChartProps> = ({
  rollCount
}) => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Min/Max/Avg Controls
  const [showMinMaxAvg, setShowMinMaxAvg] = useState(false);
  const [skillMax, setSkillMax] = useState(4);
  const [attributeMax, setAttributeMax] = useState(5);
  const [modifierMin, setModifierMin] = useState(-2);
  const [modifierMax, setModifierMax] = useState(3);
  
  // Input field states for controlled inputs
  const [skillMaxInput, setSkillMaxInput] = useState(skillMax.toString());
  const [attributeMaxInput, setAttributeMaxInput] = useState(attributeMax.toString());
  const [modifierMinInput, setModifierMinInput] = useState(modifierMin.toString());
  const [modifierMaxInput, setModifierMaxInput] = useState(modifierMax.toString());

  // Validation functions
  const handleSkillMaxChange = (value: number) => {
    const newValue = Math.max(0, Math.min(10, value));
    setSkillMax(newValue);
    setSkillMaxInput(newValue.toString());
  };

  const handleAttributeMaxChange = (value: number) => {
    const newValue = Math.max(0, Math.min(10, value));
    setAttributeMax(newValue);
    setAttributeMaxInput(newValue.toString());
  };

  const handleModifierMinChange = (value: number) => {
    const newValue = Math.max(-10, Math.min(0, value));
    setModifierMin(newValue);
    setModifierMinInput(newValue.toString());
  };

  const handleModifierMaxChange = (value: number) => {
    const newValue = Math.max(0, Math.min(10, value));
    setModifierMax(newValue);
    setModifierMaxInput(newValue.toString());
  };

  // Input field handlers
  const handleSkillMaxInputChange = (value: string) => {
    setSkillMaxInput(value);
  };

  const handleSkillMaxInputBlur = () => {
    const numValue = parseInt(skillMaxInput);
    if (!isNaN(numValue)) {
      handleSkillMaxChange(numValue);
    } else {
      setSkillMaxInput(skillMax.toString());
    }
  };

  const handleSkillMaxInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSkillMaxInputBlur();
    }
  };

  const handleAttributeMaxInputChange = (value: string) => {
    setAttributeMaxInput(value);
  };

  const handleAttributeMaxInputBlur = () => {
    const numValue = parseInt(attributeMaxInput);
    if (!isNaN(numValue)) {
      handleAttributeMaxChange(numValue);
    } else {
      setAttributeMaxInput(attributeMax.toString());
    }
  };

  const handleAttributeMaxInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAttributeMaxInputBlur();
    }
  };

  const handleModifierMinInputChange = (value: string) => {
    setModifierMinInput(value);
  };

  const handleModifierMinInputBlur = () => {
    const numValue = parseInt(modifierMinInput);
    if (!isNaN(numValue)) {
      handleModifierMinChange(numValue);
    } else {
      setModifierMinInput(modifierMin.toString());
    }
  };

  const handleModifierMinInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleModifierMinInputBlur();
    }
  };

  const handleModifierMaxInputChange = (value: string) => {
    setModifierMaxInput(value);
  };

  const handleModifierMaxInputBlur = () => {
    const numValue = parseInt(modifierMaxInput);
    if (!isNaN(numValue)) {
      handleModifierMaxChange(numValue);
    } else {
      setModifierMaxInput(modifierMax.toString());
    }
  };

  const handleModifierMaxInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleModifierMaxInputBlur();
    }
  };

  useEffect(() => {
    const calculateSuccessRates = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Calculate min, max, and average target values
        const minTarget = 0 + 0 + modifierMin; // Skill und Attribute starten bei 0
        const maxTarget = skillMax + attributeMax + modifierMax;
        const avgTarget = Math.round((minTarget + maxTarget) / 2);
        
        // Always show full range 1-20 on X-axis
        const targetValues = Array.from({ length: 20 }, (_, i) => i + 1);
        // Add difficulty zone backgrounds first (like in SuccessProbabilityCurve)
        const zoneDatasets = [
          {
            label: "Easy Zone (70%+)",
            data: targetValues.map(() => 100),
            backgroundColor: "rgba(34, 197, 94, 0.1)",
            borderColor: "transparent",
            fill: {
              target: {
                value: 70
              }
            },
            pointRadius: 0,
            pointHoverRadius: 0,
            order: 10, // Background layer
          },
          {
            label: "Moderate Zone (30-70%)",
            data: targetValues.map(() => 70),
            backgroundColor: "rgba(245, 158, 11, 0.1)",
            borderColor: "transparent",
            fill: {
              target: {
                value: 30
              }
            },
            pointRadius: 0,
            pointHoverRadius: 0,
            order: 9, // Background layer
          },
          {
            label: "Hard Zone (<30%)",
            data: targetValues.map(() => 30),
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            borderColor: "transparent",
            fill: {
              target: {
                value: 0
              }
            },
            pointRadius: 0,
            pointHoverRadius: 0,
            order: 8, // Background layer
          },
          
          // Zone boundary lines
          {
            label: "Easy Threshold (70%)",
            data: targetValues.map(() => 70),
            borderColor: "rgba(34, 197, 94, 0.8)",
            backgroundColor: "transparent",
            borderWidth: 2,
            borderDash: [5, 5],
            pointRadius: 0,
            pointHoverRadius: 0,
            order: 1,
          },
          {
            label: "Moderate Threshold (30%)",
            data: targetValues.map(() => 30),
            borderColor: "rgba(239, 68, 68, 0.8)",
            backgroundColor: "transparent",
            borderWidth: 2,
            borderDash: [5, 5],
            pointRadius: 0,
            pointHoverRadius: 0,
            order: 1,
          }
        ];

        const datasets = ADVANTAGE_TYPES.map((advantageType: any) => {
          const successRates = targetValues.map(targetValue => {
            // Only show values in the min-max range if Min/Max/Avg mode is enabled
            if (showMinMaxAvg && (targetValue < minTarget || targetValue > maxTarget)) {
              return null;
            }
            
            const results = getAdvantageTypeDistribution(targetValue, rollCount);
            return (results[advantageType.id]?.successRate || 0) * 100; // Convert to percentage
          });
          
          // Highlight min/max/avg points
          const isKeyPoint = (target: number) => 
            target === minTarget || target === avgTarget || target === maxTarget;
          
          // Define line styles based on advantage type
          let borderColor: string = '#3b82f6';
          let borderDash: number[] = [];
          let borderWidth: number = 2;
          
          if (advantageType.id === 'normal') {
            // Standard: blue
            borderColor = '#3b82f6';
            borderDash = [];
            borderWidth = 2;
          } else if (advantageType.id === 'advantage') {
            // Simple advantage: green
            borderColor = '#22c55e';
            borderDash = [];
            borderWidth = 1.5;
          } else if (advantageType.id === 'disadvantage') {
            // Simple disadvantage: orange
            borderColor = '#f97316';
            borderDash = [];
            borderWidth = 1.5;
          } else if (advantageType.id === 'strong-advantage') {
            // Strong advantage: dark green
            borderColor = '#16a34a';
            borderDash = [];
            borderWidth = 2.5;
          } else if (advantageType.id === 'strong-disadvantage') {
            // Strong disadvantage: red
            borderColor = '#ef4444';
            borderDash = [];
            borderWidth = 2.5;
          }
          
          return {
            label: advantageType.label,
            data: successRates,
            borderColor: borderColor,
            backgroundColor: getAdvantageColor(advantageType.id, 0.1),
            tension: 0.1,
            pointRadius: targetValues.map(target => 
              showMinMaxAvg && isKeyPoint(target) ? 8 : 3
            ),
            pointHoverRadius: targetValues.map(target => 
              showMinMaxAvg && isKeyPoint(target) ? 10 : 5
            ),
            borderDash: borderDash,
            borderWidth: targetValues.map(target => 
              showMinMaxAvg && isKeyPoint(target) ? borderWidth + 1 : borderWidth
            ),
            pointStyle: targetValues.map(target => 
              showMinMaxAvg && isKeyPoint(target) ? 'star' : (advantageType.id.includes('advantage') ? 'triangle' : (advantageType.id.includes('disadvantage') ? 'rect' : 'circle'))
            ),
            fill: false,
          };
        });
        
        setData({
          labels: targetValues.map(v => v.toString()),
          datasets: [...zoneDatasets, ...datasets]
        });
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    calculateSuccessRates();
  }, [rollCount, showMinMaxAvg, skillMax, attributeMax, modifierMin, modifierMax]);

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
        text: 'Success rate (%) by target value for different advantage types',
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
          },
          filter: function(legendItem: any) {
            // Hide zone background datasets from legend, keep boundary lines
            return !legendItem.text?.includes("Zone (") && legendItem.text !== "";
          }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context: any) {
            const value = context.parsed.y;
            return `${context.dataset.label}: ${value.toFixed(1)}%`;
          }
        }
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Target value'
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
          text: 'Success rate (%)'
        },
        min: 0,
        max: 100,
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
    }
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
        Calculating success rates... ({rollCount.toLocaleString()} rolls)
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

  const minTarget = 0 + 0 + modifierMin; // Skill und Attribute starten bei 0
  const maxTarget = skillMax + attributeMax + modifierMax;
  const avgTarget = Math.round((minTarget + maxTarget) / 2);

  return (
    <div>
      {/* Min/Max/Avg Toggle */}
      <div style={{ 
        marginBottom: '1em',
        padding: '1em',
        backgroundColor: '#f8fafc',
        borderRadius: '8px',
        border: '1px solid #e2e8f0'
      }}>
        <label style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5em',
          fontSize: '1em',
          fontWeight: '600',
          color: '#374151',
          marginBottom: '0.5em'
        }}>
          <input
            type="checkbox"
            checked={showMinMaxAvg}
            onChange={(e) => setShowMinMaxAvg(e.target.checked)}
            style={{ marginRight: '0.5em', transform: 'scale(1.2)' }}
          />
          🎯 Player Progression View
        </label>
        <div style={{ 
          fontSize: '0.75em', 
          color: '#6b7280',
          fontStyle: 'italic',
          marginBottom: '1em'
        }}>
          💡 See how your players will progress from beginner to expert levels
        </div>
        
        {showMinMaxAvg && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
            gap: '1em'
          }}>
            {/* Max Skill */}
            <div style={{
              padding: '0.75em',
              backgroundColor: '#f8fafc',
              borderRadius: '6px',
              border: '1px solid #e2e8f0'
            }}>
              <label style={{ 
                fontWeight: '500', 
                display: 'block', 
                marginBottom: '0.5em',
                color: '#374151',
                fontSize: '0.85em'
              }}>
                🎯 Max Skill
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={skillMaxInput}
                onChange={(e) => handleSkillMaxInputChange(e.target.value)}
                onBlur={handleSkillMaxInputBlur}
                onKeyPress={handleSkillMaxInputKeyPress}
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '0.8em',
                  outline: 'none',
                  backgroundColor: 'white'
                }}
              />
            </div>

            {/* Max Attribute */}
            <div style={{
              padding: '0.75em',
              backgroundColor: '#f8fafc',
              borderRadius: '6px',
              border: '1px solid #e2e8f0'
            }}>
              <label style={{ 
                fontWeight: '500', 
                display: 'block', 
                marginBottom: '0.5em',
                color: '#374151',
                fontSize: '0.85em'
              }}>
                💪 Max Attribute
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={attributeMaxInput}
                onChange={(e) => handleAttributeMaxInputChange(e.target.value)}
                onBlur={handleAttributeMaxInputBlur}
                onKeyPress={handleAttributeMaxInputKeyPress}
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '0.8em',
                  outline: 'none',
                  backgroundColor: 'white'
                }}
              />
            </div>

            {/* Min Modifier */}
            <div style={{
              padding: '0.75em',
              backgroundColor: '#f8fafc',
              borderRadius: '6px',
              border: '1px solid #e2e8f0'
            }}>
              <label style={{ 
                fontWeight: '500', 
                display: 'block', 
                marginBottom: '0.5em',
                color: '#374151',
                fontSize: '0.85em'
              }}>
                ⚖️ Min Modifier
              </label>
              <input
                type="number"
                min="-10"
                max="0"
                value={modifierMinInput}
                onChange={(e) => handleModifierMinInputChange(e.target.value)}
                onBlur={handleModifierMinInputBlur}
                onKeyPress={handleModifierMinInputKeyPress}
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '0.8em',
                  outline: 'none',
                  backgroundColor: 'white'
                }}
              />
            </div>

            {/* Max Modifier */}
            <div style={{
              padding: '0.75em',
              backgroundColor: '#f8fafc',
              borderRadius: '6px',
              border: '1px solid #e2e8f0'
            }}>
              <label style={{ 
                fontWeight: '500', 
                display: 'block', 
                marginBottom: '0.5em',
                color: '#374151',
                fontSize: '0.85em'
              }}>
                ⚖️ Max Modifier
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={modifierMaxInput}
                onChange={(e) => handleModifierMaxInputChange(e.target.value)}
                onBlur={handleModifierMaxInputBlur}
                onKeyPress={handleModifierMaxInputKeyPress}
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '0.8em',
                  outline: 'none',
                  backgroundColor: 'white'
                }}
              />
            </div>
          </div>
        )}
        
        {showMinMaxAvg && (
          <div style={{ 
            marginTop: '1em', 
            padding: '1em',
            backgroundColor: '#f0f9ff',
            borderRadius: '8px',
            border: '1px solid #bae6fd'
          }}>
            <h4 style={{ 
              margin: '0 0 0.5em 0', 
              color: '#1e40af', 
              fontSize: '0.95em',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5em'
            }}>
              🎯 Character progression range
            </h4>
            <p style={{ 
              margin: '0 0 0.5em 0', 
              fontSize: '0.85em', 
              color: '#1e40af',
              lineHeight: '1.4'
            }}>
              <strong>Min DC:</strong> {minTarget} | <strong>Max DC:</strong> {maxTarget} | <strong>Avg DC:</strong> {avgTarget}<br/>
              <strong>Range:</strong> Only values between {minTarget} and {maxTarget} are displayed
            </p>
          </div>
        )}
      </div>

      {/* Chart */}
      <div style={{ height: '500px', width: '100%' }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default SuccessRateChart;
