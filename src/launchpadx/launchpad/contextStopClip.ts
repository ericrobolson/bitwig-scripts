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
    const triggerButton = lp.controlButtons().stopClip;
    const shouldReturnToPrevious =
      triggerButton && !isGridButton && state == ButtonState.ToggledOn;

    if (shouldReturnToPrevious) {
      return lp.lastContext();
    }

    if (state == ButtonState.ToggledOn && isGridButton) {
      getClipLauncherFromTrackGrid(y).stop();

      return this;
    }

    return contextDefaultTransition(lp, this);
  },
  render(lp: LaunchpadObject, renderer: RenderQueue) {
    paintGridTrackView(renderer);

    // Paint other colors
    {
      paintTopRow(renderer);
      paintSideBar(renderer);
    }

    // Paint logo
    {
      renderer.pulsingLight(GRID_WIDTH, GRID_HEIGHT, ColorPalette.RedLighter);
    }
  },
};

const paintTopRow = (renderer: RenderQueue) => {
  const y = GRID_HEIGHT;
  for (var x = 0; x < NUM_SCENES; x++) {
    renderer.flashingLight(x, y, ColorPalette.RedDarker, ColorPalette.Red);
  }
};

const paintSideBar = (renderer: RenderQueue) => {
  const x = GRID_WIDTH;
  for (var y = 0; y < NUM_SCENES; y++) {
    renderer.flashingLight(x, y, ColorPalette.RedDarker, ColorPalette.Red);
  }
};
