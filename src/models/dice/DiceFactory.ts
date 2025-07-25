import { DiceRoll } from './DiceRoll';
import { DiceType, RollType } from './Dice';

/**
 * Factory class for creating different types of dice rolls
 */
export class DiceFactory {
  /**
   * Create a d4 die
   */
  static createD4(rollType: RollType = RollType.NORMAL): DiceRoll {
    return new DiceRoll(DiceType.D4, rollType);
  }

  /**
   * Create a d6 die
   */
  static createD6(rollType: RollType = RollType.NORMAL): DiceRoll {
    return new DiceRoll(DiceType.D6, rollType);
  }

  /**
   * Create a d8 die
   */
  static createD8(rollType: RollType = RollType.NORMAL): DiceRoll {
    return new DiceRoll(DiceType.D8, rollType);
  }

  /**
   * Create a d10 die
   */
  static createD10(rollType: RollType = RollType.NORMAL): DiceRoll {
    return new DiceRoll(DiceType.D10, rollType);
  }

  /**
   * Create a d12 die
   */
  static createD12(rollType: RollType = RollType.NORMAL): DiceRoll {
    return new DiceRoll(DiceType.D12, rollType);
  }

  /**
   * Create a d20 die
   */
  static createD20(rollType: RollType = RollType.NORMAL): DiceRoll {
    return new DiceRoll(DiceType.D20, rollType);
  }

  /**
   * Create a d100 die
   */
  static createD100(rollType: RollType = RollType.NORMAL): DiceRoll {
    return new DiceRoll(DiceType.D100, rollType);
  }

  /**
   * Create a custom die with the specified number of sides
   */
  static createCustomDie(type: DiceType, rollType: RollType = RollType.NORMAL): DiceRoll {
    return new DiceRoll(type, rollType);
  }
}
