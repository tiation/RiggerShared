/**
 * Represents the different types of dice available in the system
 */
export enum DiceType {
  D4 = 4,
  D6 = 6,
  D8 = 8,
  D10 = 10,
  D12 = 12,
  D20 = 20,
  D100 = 100
}

/**
 * Represents different types of dice rolls
 */
export enum RollType {
  NORMAL = 'normal',
  ADVANTAGE = 'advantage',
  DISADVANTAGE = 'disadvantage'
}

/**
 * Represents a modifier that can be applied to a dice roll
 */
export interface DiceModifier {
  value: number;
  type: 'add' | 'subtract' | 'multiply' | 'divide';
  description?: string;
}

/**
 * Core dice class representing a single die in the system
 */
export class Dice {
  private readonly type: DiceType;
  private readonly modifiers: DiceModifier[];

  constructor(type: DiceType) {
    this.type = type;
    this.modifiers = [];
  }

  /**
   * Get the maximum possible value for this die
   */
  getMaxValue(): number {
    return this.type;
  }

  /**
   * Add a modifier to this die
   */
  addModifier(modifier: DiceModifier): void {
    this.modifiers.push(modifier);
  }

  /**
   * Clear all modifiers from this die
   */
  clearModifiers(): void {
    this.modifiers.length = 0;
  }

  /**
   * Get all current modifiers
   */
  getModifiers(): DiceModifier[] {
    return [...this.modifiers];
  }

  /**
   * Apply modifiers to a roll result
   */
  protected applyModifiers(result: number): number {
    return this.modifiers.reduce((value, modifier) => {
      switch (modifier.type) {
        case 'add':
          return value + modifier.value;
        case 'subtract':
          return value - modifier.value;
        case 'multiply':
          return value * modifier.value;
        case 'divide':
          return Math.floor(value / modifier.value);
        default:
          return value;
      }
    }, result);
  }
}
