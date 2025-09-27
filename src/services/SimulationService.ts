import type { DiceSystem, DiceRollResult, SuccessResult } from "../../models/dice-system.js";

export interface SimulationStats {
  mean: number;
  min: number;
  max: number;
  stddev: number;
}

export interface SimulationResult {
  distribution: Record<string, number>;
  stats: SimulationStats;
  meta?: Record<string, any>;
}

export function simulateRolls(
  system: DiceSystem,
  dicePool: number,
  attribute: number,
  skill: number,
  modifier: number,
  rollCount: number
): SimulationResult {
  const allResults: DiceRollResult[] = [];
  const values: number[] = [];
  const distribution: Record<string, number> = {};
  let meta: Record<string, any> = {};

  for (let i = 0; i < rollCount; i++) {
    const result = system.roll(dicePool, attribute, skill, modifier);
    allResults.push(result);
    // Assume the key for distribution is the first key in result.distribution
    const key = Object.keys(result.distribution)[0];
    if (key) {
      distribution[key] = (distribution[key] || 0) + 1;
      // Try to extract a numeric value for stats
      const num = Number(key);
      if (!isNaN(num)) values.push(num);
    }
    // Optionally merge meta
    if (result.meta) {
      for (const k in result.meta) {
        if (typeof result.meta[k] === "number") {
          meta[k] = (meta[k] || 0) + result.meta[k];
        }
      }
    }
  }

  // Calculate stats
  const mean = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  const min = values.length ? Math.min(...values) : 0;
  const max = values.length ? Math.max(...values) : 0;
  const stddev = values.length ? Math.sqrt(values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length) : 0;

  return {
    distribution,
    stats: { mean, min, max, stddev },
    meta,
  };
}

/**
 * Calculate success rate for a given target number using the system's calculateSuccess function
 */
export function calculateSuccessRate(
  system: DiceSystem,
  targetNumber: number,
  dicePool: number,
  attribute: number,
  skill: number,
  modifier: number,
  rollCount: number = 1000
): {
  successRate: number;
  results: SuccessResult[];
  stats: {
    totalAttempts: number;
    successes: number;
    failures: number;
    averageDegree: number;
    successTypes: Record<string, number>;
  };
} {
  const results: SuccessResult[] = [];
  let successes = 0;
  const successTypes: Record<string, number> = {};
  let totalDegree = 0;

  for (let i = 0; i < rollCount; i++) {
    const rollResult = system.roll(dicePool, attribute, skill, modifier);
    const successResult = system.calculateSuccess(rollResult, targetNumber, dicePool, attribute, skill, modifier);
    
    results.push(successResult);
    
    if (successResult.isSuccess) {
      successes++;
    }
    
    totalDegree += successResult.degree;
    
    if (successResult.successType) {
      successTypes[successResult.successType] = (successTypes[successResult.successType] || 0) + 1;
    }
  }

  return {
    successRate: (successes / rollCount) * 100,
    results,
    stats: {
      totalAttempts: rollCount,
      successes,
      failures: rollCount - successes,
      averageDegree: totalDegree / rollCount,
      successTypes
    }
  };
}
