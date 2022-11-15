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
      const clipLauncher = getClipLauncherFromTrackGrid(y);

      // track.select();
      // clipLauncher.select(x);

      if (controlButtons.record) {
        clipLauncher.record(x);
      } else if (controlButtons.custom) {
        // delete clip
        clipLauncher.getItemAt(x).deleteObject();
      } else {
        clipLauncher.launch(x);
      }

      return this;
    }

    return null;
  },
  render(lp: LaunchpadObject, renderer: RenderQueue) {
    const controlButtons = lp.controlButtons();
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
      const y = GRID_HEIGHT;
      for (var x = 0; x < NUM_SCENES; x++) {
        if (controlButtons.isUp(x, y)) {
          renderer.staticLight(x, y, ColorPalette.Purple);
        } else if (controlButtons.isCaptureMidi(x, y)) {
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
  },
};

const paintGridTrackView = (renderer: RenderQueue): void => {
  for (var row = 0; row < NUM_SCENES; row++) {
    for (var col = 0; col < NUM_SCENES; col++) {
      // Y needs to be inverted.
      const y = 7 - col;
      const x = row;

      const queuedForStop = trackBankHandler.trackQueuedForStop[col];

      const clip = trackBankHandler.clips[col][row];
      const [trackR, trackG, trackB] = trackBankHandler.colors[col];

      if (queuedForStop) {
        renderer.pulsingLight(x, y, ColorPalette.RedLighter);
      } else if (clip.hasContent) {
        setClipLight(x, y, clip, renderer);
      } else {
        renderer.rgbLight(
          x,
          y,
          trackR * BACKGROUND_LIGHT_STRENGTH,
          trackG * BACKGROUND_LIGHT_STRENGTH,
          trackB * BACKGROUND_LIGHT_STRENGTH
        );
      }
    }
  }
};
