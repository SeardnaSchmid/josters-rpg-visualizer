// Custom dice system for advantage/disadvantage mechanics
export interface AdvantageType {
  id: string;
  label: string;
  diceCount: number;
  selectionMethod: 'highest' | 'middle' | 'lowest';
  description: string;
}

export const ADVANTAGE_TYPES: AdvantageType[] = [
  {
    id: 'strong-disadvantage',
    label: 'Strong Disadvantage',
    diceCount: 3,
    selectionMethod: 'highest',
    description: '3 dice, highest counts'
  },
  {
    id: 'disadvantage',
    label: 'Disadvantage',
    diceCount: 2,
    selectionMethod: 'highest',
    description: '2 dice, highest counts'
  },
  {
    id: 'normal',
    label: 'Normal',
    diceCount: 3,
    selectionMethod: 'middle',
    description: '3 dice, middle counts'
  },
  {
    id: 'advantage',
    label: 'Advantage',
    diceCount: 2,
    selectionMethod: 'lowest',
    description: '2 dice, lowest counts'
  },
  {
    id: 'strong-advantage',
    label: 'Strong Advantage',
    diceCount: 3,
    selectionMethod: 'lowest',
    description: '3 dice, lowest counts'
  }
];

export interface CustomDiceRoll {
  dice: number[];
  selectedValue: number;
  advantageType: AdvantageType;
  targetValue: number;
  successes: number;
  isSuccess: boolean;
}

export function rollCustomDice(advantageType: AdvantageType, targetValue: number): CustomDiceRoll {
  // Roll the dice (d20)
  const dice = Array.from({ length: advantageType.diceCount }, () => 
    Math.floor(Math.random() * 20) + 1
  );
  
  // Select the appropriate die based on advantage type
  let selectedValue: number;
  const sortedDice = [...dice].sort((a, b) => a - b);
  
  switch (advantageType.selectionMethod) {
    case 'highest':
      selectedValue = Math.max(...dice);
      break;
    case 'lowest':
      selectedValue = Math.min(...dice);
      break;
    case 'middle':
      if (dice.length === 3) {
        selectedValue = sortedDice[1] || dice[0] || 1; // middle of 3
      } else {
        selectedValue = dice[0] || 1; // fallback
      }
      break;
    default:
      selectedValue = dice[0] || 1;
  }
  
  // Calculate success
  const isSuccess = selectedValue <= targetValue;
  const successes = isSuccess ? Math.max(0, targetValue - selectedValue) : 0;
  
  return {
    dice,
    selectedValue,
    advantageType,
    targetValue,
    successes,
    isSuccess
  };
}

export function simulateCustomDiceRolls(
  advantageType: AdvantageType,
  targetValue: number,
  rollCount: number = 100000
): { distribution: Record<string, number>, successRate: number, averageSuccesses: number } {
  const results: Record<string, number> = {};
  let successCount = 0;
  let totalSuccesses = 0;
  
  for (let i = 0; i < rollCount; i++) {
    const roll = rollCustomDice(advantageType, targetValue);
    const key = roll.selectedValue.toString();
    results[key] = (results[key] || 0) + 1;
    
    if (roll.isSuccess) {
      successCount++;
      totalSuccesses += roll.successes;
    }
  }
  
  return {
    distribution: results,
    successRate: successCount / rollCount,
    averageSuccesses: totalSuccesses / rollCount
  };
}

export function getAdvantageTypeDistribution(
  targetValue: number,
  rollCount: number = 100000
): Record<string, { distribution: Record<string, number>, successRate: number, averageSuccesses: number }> {
  const results: Record<string, any> = {};
  
  ADVANTAGE_TYPES.forEach(advantageType => {
    results[advantageType.id] = simulateCustomDiceRolls(advantageType, targetValue, rollCount);
  });
  
  return results;
}
