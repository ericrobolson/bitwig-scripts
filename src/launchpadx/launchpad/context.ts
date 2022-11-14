interface Context {
  /**
   * The title of the context. Used for debugging.
   */
  title(): string;
  /**
   * Returns whether the context should replace history or not. Typically things such as volume control or recording arming will not replace history, but the default arrange mode or edit modes should.
   */
  shouldReplaceHistory(): boolean;
  /**
   * Attempts to transition the context. If no new context transition would be made, return null.
   * @param lp
   * @param note
   * @param velocity
   * @param prevVelocity
   * @param state
   * @param x
   * @param y
   * @param isGridButton
   */
  transition(
    lp: LaunchpadObject,
    note: number,
    velocity: number,
    prevVelocity: number,
    state: ButtonState,
    x: number,
    y: number,
    isGridButton: boolean
  ): Context | null;
  /**
   * The state the context should render.
   * @param lp
   * @param renderQueue
   */
  render(lp: LaunchpadObject, renderQueue: RenderQueue): void;
}

/**
 * Default, system wide transitions.
 * @param lp
 * @param context
 * @returns
 */
const contextDefaultTransition = (
  lp: LaunchpadObject,
  context: Context
): Context => {
  const controlButtons = lp.controlButtons();
  // Non navigation control buttons
  {
    if (controlButtons.volume) {
      return ContextVolume;
    } else if (controlButtons.recordArm) {
      return ContextRecordArm;
    } else if (controlButtons.pan) {
      return ContextPanControl;
    }
  }

  // Navigation
  {
    if (controlButtons.up) {
      trackBankHandler.bank.scrollBackwards();
    } else if (controlButtons.down) {
      trackBankHandler.bank.scrollForwards();
    }

    if (controlButtons.left) {
      trackBankHandler.bank.sceneBank().scrollBackwards();
    } else if (controlButtons.right) {
      trackBankHandler.bank.sceneBank().scrollForwards();
    }
  }

  return context;
};
