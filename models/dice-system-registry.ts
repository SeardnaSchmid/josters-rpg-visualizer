import type { DiceSystem } from "./dice-system.js";

export const diceSystems: DiceSystem[] = [
    {
        id: 'custom-3d20',
        label: 'Custom 3d20 System',
        dicePoolConfig: {
            isFixed: true,
            defaultValue: 3
        },
        roll: (dicePoolSize, attribute, skill, modifier) => {
            const rolls = Array.from({ length: 3 }, () => Math.ceil(Math.random() * 20));
            const total = rolls.reduce((a, b) => a + b, 0) + attribute + skill + modifier;
            
            return {
                rolls,
                distribution: { [total.toString()]: 1 },
                meta: { attribute, skill, modifier }
            };
        },
        calculateSuccess: (rollResult, targetNumber, dicePool, attribute, skill, modifier) => {
            const firstKey = Object.keys(rollResult.distribution)[0];
            const rollValue = firstKey ? parseInt(firstKey) : 0;
            const isSuccess = rollValue >= targetNumber;
            const degree = rollValue - targetNumber;
            
            let successType = "normal";
            if (isSuccess) {
                if (degree >= 20) successType = "critical";
                else if (degree >= 10) successType = "good";
            } else {
                if (degree <= -20) successType = "critical_failure";
                else if (degree <= -10) successType = "bad_failure";
            }

            return {
                isSuccess,
                degree,
                rollValue,
                targetValue: targetNumber,
                successType,
                meta: { dicePool: 3 }
            };
        },
        description: 'Roll 3d20 and add attribute, skill, and modifier.'
    }
];

// Export function to get all dice systems
export function getDiceSystems() {
    return diceSystems;
}
