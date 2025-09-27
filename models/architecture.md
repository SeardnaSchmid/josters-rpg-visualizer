# 3d20 RPG Visualizer - Architecture

## Component Structure

```log
App
│
├── SidebarLayout
│    └── Navigation (3d20 System Analysis)
│
└── CustomDiceSystemAnalysis
     ├── AdvantageDistributionChart
     └── SuccessRateChart
```

## Services & Systems

### 3d20 Dice System

- **Custom 3d20 System**: Roll 3d20 and add attribute, skill, and modifier
- **Advantage Types**: Strong Disadvantage, Disadvantage, Normal, Advantage, Strong Advantage
- **Success Calculation**: Die value ≤ Target value, with success margin calculation

### Simulation Service

- Handles 10,000+ dice roll simulations
- Calculates statistics (average, min, max, std deviation)
- Frequency distribution analysis

## Features Implemented

✅ **3d20 System Focus**: Specialized for the 3d20 dice system  
✅ **Advantage/Disadvantage Analysis**: Visualize different advantage types  
✅ **Success Rate Visualization**: Chart.js integration with success probability display  
✅ **High-Performance Simulation**: 10,000+ dice roll simulations  
✅ **Statistical Analysis**: Mean, std dev, min/max, frequency distribution  
✅ **Responsive Design**: Mobile-friendly layout  
✅ **TypeScript**: Full type safety throughout the application  

## Technology Stack

- **React 19** with TypeScript
- **Vite** for build tooling
- **Chart.js + react-chartjs-2** for visualizations
- **Material-UI** for responsive layout
- **Custom hooks** for state management
