const ContextRecordArm: Context = {
  title(): string {
    return "ContextRecordArm";
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
    const triggerButton = lp.controlButtons().recordArm;
    const shouldReturnToPrevious =
      triggerButton && !isGridButton && state == ButtonState.ToggledOn;

    if (shouldReturnToPrevious) {
      return lp.lastContext();
    }

    if (state == ButtonState.ToggledOn && isGridButton) {
      getTrackFromGrid(y).arm().toggle();

      return this;
    }

    return contextDefaultTransition(lp, this);
  },
  isTargetButton: ControlButtons.isRecordArm,
  renderInstructions: {
    targetButton: ColorPalette.GreenLighter,
    navigationButtons: ColorPalette.BlueLighter,
    otherButtons: ColorPalette.HotPink,
    grid: ColorPalette.DefaultTrackBehavior,
  },
};
