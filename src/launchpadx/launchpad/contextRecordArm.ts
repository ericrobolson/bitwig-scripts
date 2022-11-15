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
    const shouldReturnToPrevious =
      this.isTargetButton(x, y) &&
      !isGridButton &&
      state == ButtonState.ToggledOn;

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
    gridOverride: (renderer: RenderQueue, row: number, col: number) => {
      // Y needs to be inverted.
      const y = 7 - col;
      const x = row;
      const shouldDrawRecordArmed = x > 5 || x < 2;
      if (trackBankHandler.trackIsArmed[col] && shouldDrawRecordArmed) {
        renderer.flashingLight(
          x,
          y,
          ColorPalette.RedDarker,
          ColorPalette.RedLighter
        );
      } else {
        paintTrackViewCell(renderer, row, col);
      }
    },
  },
};
