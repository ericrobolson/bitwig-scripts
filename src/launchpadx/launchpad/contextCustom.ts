const ContextCustom: Context = {
  title(): string {
    return "ContextCustom/Delete";
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
  ): Context | null {
    const shouldReturnToPrevious =
      this.isTargetButton(x, y) && state == ButtonState.ToggledOn;

    if (shouldReturnToPrevious) {
      return lp.lastContext();
    }

    if (state == ButtonState.ToggledOn && isGridButton) {
      const track = getTrackFromGrid(y);
      const clipLauncher = track.clipLauncherSlotBank();

      clipLauncher.getItemAt(x).deleteObject();

      return this;
    }

    return contextDefaultTransition(lp, this);
  },
  isTargetButton: ControlButtons.isCustom,
  renderInstructions: {
    targetButton: ColorPalette.Red,
    navigationButtons: ColorPalette.Dirt,
    otherButtons: ColorPalette.GreenDarker,
    grid: ColorPalette.DefaultTrackBehavior,
    gridOverride: null,
  },
};
