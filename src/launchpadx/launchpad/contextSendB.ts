const ContextSendB: Context = {
  title(): string {
    return "ContextSendB";
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
    const triggerButton = lp.controlButtons().sendB;
    const shouldReturnToPrevious =
      triggerButton && !isGridButton && state == ButtonState.ToggledOn;

    if (shouldReturnToPrevious) {
      return lp.lastContext();
    }

    return contextDefaultTransition(lp, this);
  },
  render(lp: LaunchpadObject, renderer: RenderQueue) {
    // Paint grid
    {
      for (var row = 0; row < NUM_SCENES + 1; row++) {
        for (var col = 0; col < NUM_SCENES + 1; col++) {
          renderer.staticLight(row, col, ColorPalette.Green);
        }
      }
    }

    // Paint logo
    {
      renderer.pulsingLight(8, 8, ColorPalette.BlueDarker);
    }
  },
};