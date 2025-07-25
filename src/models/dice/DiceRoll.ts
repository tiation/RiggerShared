import { Dice, DiceType, RollType } from './Dice';

/**
 * Represents the result of a dice roll
 */
export interface RollResult {
  originalValue: number;
  modifiedValue: number;
  type: RollType;
  timestamp: Date;
  diceType: DiceType;
}

/**
 * Class responsible for handling dice roll operations
 */
export class DiceRoll extends Dice {
  private readonly rollType: RollType;

  constructor(type: DiceType, rollType: RollType = RollType.NORMAL) {
    super(type);
    this.rollType = rollType;
  }

  /**
   * Generate a random number between 1 and the maximum value
   */
  private generateRandomNumber(): number {
    return Math.floor(Math.random() * this.getMaxValue()) + 1;
  }

  /**
   * Execute a dice roll based on the roll type
   */
  roll(): RollResult {
    let originalValue: number;

    switch (this.rollType) {
      case RollType.ADVANTAGE: {
        const roll1 = this.generateRandomNumber();
        const roll2 = this.generateRandomNumber();
        originalValue = Math.max(roll1, roll2);
        break;
      }
      case RollType.DISADVANTAGE: {
        const roll1 = this.generateRandomNumber();
        const roll2 = this.generateRandomNumber();
        originalValue = Math.min(roll1, roll2);
        break;
      }
      default:
        originalValue = this.generateRandomNumber();
    }

    const modifiedValue = this.applyModifiers(originalValue);

    return {
      originalValue,
      modifiedValue,
      type: this.rollType,
      timestamp: new Date(),
      diceType: this.getMaxValue() as DiceType
    };
  }

  /**
   * Execute multiple dice rolls
   */
  rollMultiple(count: number): RollResult[] {
    if (count < 1) {
      throw new Error('Roll count must be greater than 0');
    }

    return Array.from({ length: count }, () => this.roll());
  }
}
