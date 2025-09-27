# 3d20 RPG Visualizer

A React application for analyzing the 3d20 dice system used in tabletop RPGs.

## Features

- **3d20 System Analysis**: Analyze the custom 3d20 dice system with detailed statistics
- **Advantage/Disadvantage Visualization**: See how different advantage types affect success rates
- **Success Rate Charts**: Visualize success probabilities across different target values
- **Material-UI Interface**: Modern, responsive sidebar navigation

## 3d20 System

The app focuses on a **Custom 3d20 System** which uses different advantage types:

- **Strong Disadvantage**: 3 dice, highest counts (worst option)
- **Disadvantage**: 2 dice, highest counts
- **Normal**: 3 dice, middle counts (baseline)
- **Advantage**: 2 dice, lowest counts
- **Strong Advantage**: 3 dice, lowest counts (best option)

Success is determined by: Die value ≤ Target value. The difference (Target value - Die value) are the successes.

## Development

```bash
npm install
npm run dev
```

## Technologies

- React 19
- TypeScript
- Material-UI (MUI)
- Chart.js
- Vite
