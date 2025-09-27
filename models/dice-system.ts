/**
 * Result of a dice system simulation.
 * Includes raw rolls, a frequency distribution, and optional metadata.
 */
export type DiceRollResult = {
    /**
     * Raw roll results:
     * - number[]: e.g., [4, 5, 6]
     * - string[]: e.g., ["success", "fail", "critical"]
     */
  rolls: number[] | string[];


    /**
     * Frequency of each outcome.
     * Example: { "3": 120, "pair": 500 }
     */
  distribution: Record<string, number>;

    /**
     * Optional: Additional metadata for custom visualizations or system-specific info.
     * Example: { successes: 7, criticals: 2 }
     */
  meta?: Record<string, any>;
}

/**
 * Result of a success calculation for a dice system.
 */
export type SuccessResult = {
  isSuccess: boolean;
  degree: number;           // How much the roll succeeded/failed by
  rollValue: number;        // The actual roll result value
  targetValue: number;      // The target value that was compared against
  successType?: string;     // Optional: "critical", "normal", "marginal", etc.
  meta?: Record<string, any>; // System-specific additional data
}

// A. Modular, system-specific success counting (supports many systems/customizations)
export type DiceSystem = {
  id: string;
  label: string;
  description?: string;
  dicePoolConfig?: {
    isFixed: boolean;        // If true, dice pool input is disabled
    defaultValue: number;    // Default/fixed value for dice pool
    min?: number;           // Minimum allowed value (when not fixed)
    max?: number;           // Maximum allowed value (when not fixed)
  };
  roll: (
    dicePool: number,
    attribute: number,
    skill: number,
    modifier: number
  ) => DiceRollResult;
  calculateSuccess: (
    rollResult: DiceRollResult,
    targetNumber: number,
    dicePool: number,
    attribute: number,
    skill: number,
    modifier: number
  ) => SuccessResult;
}