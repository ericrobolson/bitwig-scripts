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
  render(lp: LaunchpadObject, renderer: RenderQueue) {
    paintGridTrackView(renderer);

    // Paint other colors
    {
      paintNavigationButtons(renderer);
      paintTopRow(renderer);
      paintSideBar(renderer);
    }

    // Paint logo
    {
      renderer.pulsingLight(GRID_WIDTH, GRID_HEIGHT, ColorPalette.RedLighter);
    }
  },
};

const DIRECTIONAL_BTN_COUNT = 4;

const paintTopRow = (renderer: RenderQueue) => {
  const y = GRID_HEIGHT;
  for (var x = DIRECTIONAL_BTN_COUNT; x < NUM_SCENES; x++) {
    renderer.flashingLight(x, y, ColorPalette.RedDarker, ColorPalette.Red);
  }
};

const paintSideBar = (renderer: RenderQueue) => {
  const x = GRID_WIDTH;
  for (var y = 0; y < NUM_SCENES; y++) {
    ControlButtons.isStopClip(x, y)
      ? renderer.staticLight(x, y, ColorPalette.Green)
      : renderer.flashingLight(x, y, ColorPalette.RedDarker, ColorPalette.Red);
  }
};
