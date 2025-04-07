import { toArray, type OneOrMany } from "./utils";

/**
 * A bitmask-based state manager. This class keeps an internal integer (`store`)
 * and allows setting, unsetting, toggling, and checking multiple flags.
 */
export class State {
  /** Internal bitmask representing the current state. */
  private store = 0;

  /**
   * Optionally initialize the state with one or more flags.
   *
   * @param initial - A single flag number or an array of flags
   *   (bitmask values). Defaults to an empty array, meaning
   *   no flags are set initially.
   */
  constructor(initial?: OneOrMany<number>) {
    this.set(initial ?? []);
  }

  /**
   * Checks if all provided flags are currently set on the internal bitmask.
   *
   * @param flags - A single flag or array of flags to verify.
   * @returns `true` if *every* flag in `flags` is set; otherwise `false`.
   */
  public is(flags: OneOrMany<number>): boolean {
    return toArray(flags).every((flag) => this.store & flag);
  }

  /**
   * Sets (turns on) one or more flags in the internal bitmask.
   * Flags that are already set remain set.
   *
   * @param flags - A single flag or array of flags to set.
   */
  public set(flags: OneOrMany<number>): void {
    for (const flag of toArray(flags)) {
      this.store |= flag;
    }
  }

  /**
   * Unsets (turns off) one or more flags in the internal bitmask.
   *
   * @param flags - A single flag or array of flags to unset.
   */
  public unset(flags: OneOrMany<number>): void {
    for (const flag of toArray(flags)) {
      this.store &= ~flag;
    }
  }

  /**
   * Toggles one or more flags in the internal bitmask.
   * Any set bits become unset, and any unset bits become set.
   *
   * @param flags - A single flag or array of flags to toggle.
   */
  public toggle(flags: OneOrMany<number>): void {
    for (const flag of toArray(flags)) {
      this.store ^= flag;
    }
  }
}
