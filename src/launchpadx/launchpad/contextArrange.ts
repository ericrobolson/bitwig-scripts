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
  /*
  render(lp: LaunchpadObject, renderer: RenderQueue) {
    paintGridTrackView(renderer);

    // Paint side bar
    {
      const x = GRID_WIDTH;
      for (var col = 0; col < NUM_SCENES; col++) {
        const y = col;
        const [r, g, b] = trackBankHandler.colors[7 - y];

        let isHeld = false;

        if (isHeld) {
          renderer.staticLight(x, y, ColorPalette.Purple);
        } else if (r === 0 && g === 0 && b === 0) {
          renderer.staticLight(x, y, ColorPalette.White);
        } else {
          renderer.rgbLight(x, y, r, g, b);
        }
      }
    }

    // Paint top
    {
      paintNavigationButtons(renderer);

      const y = GRID_HEIGHT;
      for (var x = DIRECTIONAL_BTN_COUNT; x < NUM_SCENES; x++) {
        if (ControlButtons.isCaptureMidi(x, y)) {
          renderer.staticLight(x, y, ColorPalette.RedDarker);
        } else {
          renderer.staticLight(x, y, ColorPalette.Blue);
        }
      }
    }

    // Paint logo
    {
      renderer.pulsingLight(8, 8, ColorPalette.HotPink);
    }
  },*/
  isTargetButton: ControlButtons.isSession,

  renderInstructions: {
    targetButton: ColorPalette.Blue,
    navigationButtons: ColorPalette.Green,
    otherButtons: ColorPalette.Orange,
    grid: ColorPalette.DefaultTrackBehavior,
  },
};
