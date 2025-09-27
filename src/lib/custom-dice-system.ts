/**
 * Refined TTRPG Dice System
 * 
 * Core mechanics:
 * - Roll 3d20 dice
 * - Select die based on advantage/disadvantage
 * - Compare to target value (≤ target = success)
 * - Successes = target - selected die (minimum 0)
 */

// ===== CORE TYPES =====

export type AdvantageLevel = 'strong-disadvantage' | 'disadvantage' | 'normal' | 'advantage' | 'strong-advantage';

export interface AdvantageConfig {
  readonly id: AdvantageLevel;
  readonly label: string;
  readonly diceCount: 2 | 3;
  readonly selectionMethod: 'highest' | 'middle' | 'lowest';
  readonly description: string;
}

export interface RollParameters {
  readonly advantageLevel: AdvantageLevel;
  readonly targetValue: number;
  readonly skill?: number;        // 0-10
  readonly attribute?: number;    // 0-10  
  readonly modifier?: number;     // -10 to +10
}

export interface DiceRollResult {
  readonly dice: readonly number[];
  readonly selectedValue: number;
  readonly advantageLevel: AdvantageLevel;
  readonly targetValue: number;
  readonly isSuccess: boolean;
  readonly successes: number;
  readonly degreeOfSuccess: number;
  readonly metadata: {
    readonly skill: number;
    readonly attribute: number;
    readonly modifier: number;
    readonly effectiveTarget: number;
  };
}

export interface SimulationResult {
  readonly distribution: Record<string, number>;
  readonly successRate: number;
  readonly averageSuccesses: number;
  readonly averageDegreeOfSuccess: number;
  readonly rollCount: number;
}

// ===== ADVANTAGE CONFIGURATIONS =====

export const ADVANTAGE_CONFIGS: Record<AdvantageLevel, AdvantageConfig> = {
  'strong-disadvantage': {
    id: 'strong-disadvantage',
    label: 'Strong Disadvantage',
    diceCount: 3,
    selectionMethod: 'highest',
    description: '3 dice, highest counts'
  },
  'disadvantage': {
    id: 'disadvantage',
    label: 'Disadvantage',
    diceCount: 2,
    selectionMethod: 'highest',
    description: '2 dice, highest counts'
  },
  'normal': {
    id: 'normal',
    label: 'Normal',
    diceCount: 3,
    selectionMethod: 'middle',
    description: '3 dice, middle counts'
  },
  'advantage': {
    id: 'advantage',
    label: 'Advantage',
    diceCount: 2,
    selectionMethod: 'lowest',
    description: '2 dice, lowest counts'
  },
  'strong-advantage': {
    id: 'strong-advantage',
    label: 'Strong Advantage',
    diceCount: 3,
    selectionMethod: 'lowest',
    description: '3 dice, lowest counts'
  }
} as const;

// Removed legacy support for cleaner interface

// ===== CORE FUNCTIONS =====

/**
 * Calculate target value from skill, attribute, and modifier
 * @param skill - Skill level (0-10)
 * @param attribute - Attribute level (0-10) 
 * @param modifier - Modifier (-10 to +10)
 * @returns Effective target value
 */
export function calculateTargetValue(skill: number = 0, attribute: number = 0, modifier: number = 0): number {
  // Clamp values to valid ranges
  const clampedSkill = Math.max(0, Math.min(10, Math.floor(skill)));
  const clampedAttribute = Math.max(0, Math.min(10, Math.floor(attribute)));
  const clampedModifier = Math.max(-10, Math.min(10, Math.floor(modifier)));
  
  return clampedSkill + clampedAttribute + clampedModifier;
}

/**
 * Roll a single d20 die
 * @returns Random number between 1 and 20
 */
export function rollD20(): number {
  return Math.floor(Math.random() * 20) + 1;
}

/**
 * Select the appropriate die value based on advantage level
 * @param dice - Array of rolled dice values
 * @param advantageLevel - The advantage level
 * @returns Selected die value
 */
export function selectDieValue(dice: readonly number[], advantageLevel: AdvantageLevel): number {
  const config = ADVANTAGE_CONFIGS[advantageLevel];
  const sortedDice = [...dice].sort((a, b) => a - b);
  
  switch (config.selectionMethod) {
    case 'highest':
      return Math.max(...dice);
    case 'lowest':
      return Math.min(...dice);
    case 'middle':
      if (dice.length === 3) {
        return sortedDice[1] || dice[0] || 1;
      } else {
        return dice[0] || 1; // fallback for 2 dice
      }
    default:
      return dice[0] || 1;
  }
}

/**
 * Core dice roll function - the main entry point for rolling dice
 * @param params - Roll parameters including advantage level and target
 * @returns Complete dice roll result
 */
export function rollDice(params: RollParameters): DiceRollResult {
  const { advantageLevel, targetValue, skill = 0, attribute = 0, modifier = 0 } = params;
  
  // Calculate effective target value
  const effectiveTarget = calculateTargetValue(skill, attribute, modifier);
  const finalTarget = Math.max(1, effectiveTarget); // Ensure minimum target of 1
  
  // Get advantage configuration
  const config = ADVANTAGE_CONFIGS[advantageLevel];
  
  // Roll the dice
  const dice = Array.from({ length: config.diceCount }, rollD20) as readonly number[];
  
  // Select the appropriate die
  const selectedValue = selectDieValue(dice, advantageLevel);
  
  // Calculate success
  const isSuccess = selectedValue <= finalTarget;
  const successes = isSuccess ? Math.max(0, finalTarget - selectedValue) : 0;
  const degreeOfSuccess = isSuccess ? finalTarget - selectedValue : 0;
  
  return {
    dice,
    selectedValue,
    advantageLevel,
    targetValue: finalTarget,
    isSuccess,
    successes,
    degreeOfSuccess,
    metadata: {
      skill,
      attribute,
      modifier,
      effectiveTarget: finalTarget
    }
  };
}

// Legacy support removed for cleaner interface

// ===== BATCH OPERATIONS =====

/**
 * Roll multiple dice with the same parameters
 * @param params - Roll parameters
 * @param count - Number of rolls to perform
 * @returns Array of dice roll results
 */
export function rollMultipleDice(params: RollParameters, count: number): readonly DiceRollResult[] {
  return Array.from({ length: count }, () => rollDice(params));
}

/**
 * Simulate dice rolls and return statistical analysis
 * @param params - Roll parameters
 * @param rollCount - Number of rolls to simulate
 * @returns Simulation results with statistics
 */
export function simulateRolls(params: RollParameters, rollCount: number = 100000): SimulationResult {
  const results: Record<string, number> = {};
  let successCount = 0;
  let totalSuccesses = 0;
  let totalDegreeOfSuccess = 0;
  
  for (let i = 0; i < rollCount; i++) {
    const roll = rollDice(params);
    const key = roll.selectedValue.toString();
    results[key] = (results[key] || 0) + 1;
    
    if (roll.isSuccess) {
      successCount++;
      totalSuccesses += roll.successes;
    }
    
    totalDegreeOfSuccess += roll.degreeOfSuccess;
  }
  
  return {
    distribution: results,
    successRate: successCount / rollCount,
    averageSuccesses: totalSuccesses / rollCount,
    averageDegreeOfSuccess: totalDegreeOfSuccess / rollCount,
    rollCount
  };
}

/**
 * Simulate all advantage levels for a given target value
 * @param targetValue - Target value to test against
 * @param rollCount - Number of rolls per advantage level
 * @returns Results for all advantage levels
 */
export function simulateAllAdvantageLevels(
  targetValue: number, 
  rollCount: number = 100000
): Record<AdvantageLevel, SimulationResult> {
  const results = {} as Record<AdvantageLevel, SimulationResult>;
  
  for (const advantageLevel of Object.keys(ADVANTAGE_CONFIGS) as AdvantageLevel[]) {
    results[advantageLevel] = simulateRolls({
      advantageLevel,
      targetValue
    }, rollCount);
  }
  
  return results;
}

// Legacy support removed for cleaner interface

// ===== UTILITY FUNCTIONS =====

/**
 * Get advantage configuration by level
 * @param advantageLevel - The advantage level
 * @returns Advantage configuration
 */
export function getAdvantageConfig(advantageLevel: AdvantageLevel): AdvantageConfig {
  return ADVANTAGE_CONFIGS[advantageLevel];
}

/**
 * Get all available advantage levels
 * @returns Array of all advantage levels
 */
export function getAllAdvantageLevels(): readonly AdvantageLevel[] {
  return Object.keys(ADVANTAGE_CONFIGS) as AdvantageLevel[];
}

/**
 * Validate roll parameters
 * @param params - Parameters to validate
 * @returns Validation result with any errors
 */
export function validateRollParameters(params: Partial<RollParameters>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (params.advantageLevel && !(params.advantageLevel in ADVANTAGE_CONFIGS)) {
    errors.push(`Invalid advantage level: ${params.advantageLevel}`);
  }
  
  if (params.skill !== undefined && (params.skill < 0 || params.skill > 10)) {
    errors.push(`Skill must be between 0 and 10, got: ${params.skill}`);
  }
  
  if (params.attribute !== undefined && (params.attribute < 0 || params.attribute > 10)) {
    errors.push(`Attribute must be between 0 and 10, got: ${params.attribute}`);
  }
  
  if (params.modifier !== undefined && (params.modifier < -10 || params.modifier > 10)) {
    errors.push(`Modifier must be between -10 and 10, got: ${params.modifier}`);
  }
  
  if (params.targetValue !== undefined && params.targetValue < 1) {
    errors.push(`Target value must be at least 1, got: ${params.targetValue}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Create a roll parameters object with validation
 * @param params - Roll parameters
 * @returns Validated roll parameters
 * @throws Error if parameters are invalid
 */
export function createRollParameters(params: Partial<RollParameters>): RollParameters {
  const validation = validateRollParameters(params);
  
  if (!validation.isValid) {
    throw new Error(`Invalid roll parameters: ${validation.errors.join(', ')}`);
  }
  
  return {
    advantageLevel: params.advantageLevel || 'normal',
    targetValue: params.targetValue || 10,
    skill: params.skill || 0,
    attribute: params.attribute || 0,
    modifier: params.modifier || 0
  };
}

/**
 * Format dice roll result for display
 * @param result - Dice roll result
 * @returns Formatted string representation
 */
export function formatDiceRoll(result: DiceRollResult): string {
  const { dice, selectedValue, advantageLevel, targetValue, isSuccess, successes } = result;
  const diceStr = dice.join(', ');
  const successStr = isSuccess ? `SUCCESS (${successes} successes)` : 'FAILURE';
  
  return `${advantageLevel}: [${diceStr}] → ${selectedValue} vs ${targetValue} = ${successStr}`;
}

/**
 * Calculate success probability for given parameters
 * @param params - Roll parameters
 * @param rollCount - Number of simulation rolls
 * @returns Success probability (0-1)
 */
export function calculateSuccessProbability(
  params: RollParameters, 
  rollCount: number = 100000
): number {
  const result = simulateRolls(params, rollCount);
  return result.successRate;
}
