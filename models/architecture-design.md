# Architecture Design

Component Structure
App
│
├── Header
│    └── RollCountDisplay
│
├── Main
│   ├── ControlsPanel
│   │    ├── DicePoolInput
│   │    ├── DiceSystemSelector
│   │    │    └── DiceSystemOption (from registry)
│   │    ├── AttributeSelector
│   │    ├── SkillSelector
│   │    └── ModifierSelector
│   │
│   └── ResultsPanel
│        ├── ChartTypeSelector
│        │    └── ChartTypeOption (from registry)
│        ├── ChartRenderer
│        └── LegendDetailsStats
│
└── Services (logic, not UI)
     ├── DiceSystemRegistry
     ├── ChartTypeRegistry
     └── SimulationService

     Layout
          +---------------------------------------------------------------+
          |                    Dice Roll Visualization                    |  <-- Header (App > Header)
          |                [ Roll Count: [ 10,000 ▼ ] ]                  |      └─ RollCountDisplay
          +---------------------------------------------------------------+
          | [ Dice Pool: 5 ]   [ Dice System: d6 ▼ ]                      |  <-- ControlsPanel
          | Attribute: [1 ▼]   Skill: [0 ▼]   Modifier: [-3 ▼]            |      ├─ DicePoolInput
          |                                                               |      ├─ DiceSystemSelector
          |   ┌───────────────────────────────────────────────────────┐    |      │    └─ DiceSystemOption
          |   │   ℹ️  How results are calculated:                    │    |      ├─ AttributeSelector
          |   │   <DiceSystem> + <Attribute> + <Skill> + <Modifier> │    |      ├─ SkillSelector
          |   │   Example: 2d6 + 1 + 3 + 0                         │    |      └─ ModifierSelector
          |   └───────────────────────────────────────────────────────┘    |
          +---------------------------------------------------------------+
          |                                                               |
          |   +-------------------------------------------------------+   |
          |   |                                                   |   |
          |   |   [ ChartRenderer ] <--- ChartRenderer            |   |
          |   |   [ ChartTypeSelector ] <--- ChartTypeSelector    |   |
          |   |   [ LegendDetailsStats ] <--- LegendDetailsStats  |   |  <-- ResultsPanel
          |   |                                                   |   |
          |   +---------------------------------------------------+   |
          |                                                               |
          +---------------------------------------------------------------+
