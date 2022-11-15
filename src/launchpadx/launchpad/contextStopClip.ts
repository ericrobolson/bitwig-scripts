const ContextStopClip: Context = {
  title(): string {
    return "ContextStopClip";
  },
  shouldReplaceHistory() {
    return false;
  },
  transition(
    lp: LaunchpadObject,
    note: number,
    velocity: number,
    prevVelocity: number,
    state: ButtonState,
    x: number,
    y: number,
    isGridButton: boolean
  ): Context {
    const shouldReturnToPrevious =
      ControlButtons.isStopClip(x, y) && state == ButtonState.ToggledOn;

    if (shouldReturnToPrevious) {
      return lp.lastContext();
    }

    if (state == ButtonState.ToggledOn && isGridButton) {
      getTrackFromGrid(y).stop();

      return this;
    }

    return contextDefaultTransition(lp, this);
  },
  isTargetButton: ControlButtons.isStopClip,
  renderInstructions: {
    targetButton: ColorPalette.Green,
    navigationButtons: ColorPalette.Blue,
    otherButtons: ColorPalette.Red,
    grid: ColorPalette.DefaultTrackBehavior,
  },
};
