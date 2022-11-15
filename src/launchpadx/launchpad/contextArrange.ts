const ContextArrange: Context = {
  title(): string {
    return "ContextArrange";
  },
  shouldReplaceHistory() {
    return true;
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
    const controlButtons = lp.controlButtons();

    if (state == ButtonState.ToggledOn && isGridButton) {
      const track = getTrackFromGrid(y);
      const clipLauncher = track.clipLauncherSlotBank();

      if (controlButtons.record) {
        clipLauncher.record(x);
      } else if (controlButtons.custom) {
        // delete clip
        clipLauncher.getItemAt(x).deleteObject();
      } else {
        clipLauncher.select(x);
        clipLauncher.launch(x);
      }

      return this;
    }

    return null;
  },
  isTargetButton: ControlButtons.isSession,
  renderInstructions: {
    targetButton: ColorPalette.Blue,
    navigationButtons: ColorPalette.Green,
    otherButtons: ColorPalette.Orange,
    grid: ColorPalette.DefaultTrackBehavior,
  },
};
