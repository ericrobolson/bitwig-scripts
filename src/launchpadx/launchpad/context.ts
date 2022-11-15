type RenderInstructions = {
  targetButton: ColorPalette;
  navigationButtons: ColorPalette;
  otherButtons: ColorPalette;
  grid: ColorPalette;
  gridOverride: null | DrawGrid;
};

type DrawGrid = (renderer: RenderQueue, x: number, y: number) => void;

interface Context {
  /**
   * The title of the context. Used for debugging.
   */
  title(): string;
  /**
   * Returns whether the context should replace history or not. Typically things such as volume control or recording arming will not replace history, but the default arrange mode or edit modes should.
   */
  shouldReplaceHistory(): boolean;

  /**
   * Returns whether the given coordinates are the target button.
   * If not present means that there is no target button.
   */
  isTargetButton: (x: number, y: number) => boolean;

  renderInstructions: RenderInstructions;

  /**
   * Attempts to transition the context. If no new context transition would be made, return null.
   * @param lp
   * @param note
   * @param velocity
   * @param prevVelocity
   * @param state
   * @param x
   * @param y
   * @param isGridButton
   */
  transition(
    lp: LaunchpadObject,
    note: number,
    velocity: number,
    prevVelocity: number,
    state: ButtonState,
    x: number,
    y: number,
    isGridButton: boolean
  ): Context | null;
}

/**
 * Default, system wide transitions.
 * @param lp
 * @param context
 * @returns
 */
const contextDefaultTransition = (
  lp: LaunchpadObject,
  context: Context
): Context => {
  const controlButtons = lp.controlButtons();
  // Non navigation control buttons
  {
    if (controlButtons.session) {
      return ContextArrange;
    } else if (controlButtons.custom) {
      return ContextCustom;
    } else if (controlButtons.volume) {
      //  return ContextVolume;
    } else if (controlButtons.pan) {
      //  return ContextPanControl;
    } else if (controlButtons.sendA) {
      //   return ContextSendA;
    } else if (controlButtons.sendB) {
      //   return ContextSendB;
    } else if (controlButtons.stopClip) {
      return ContextStopClip;
    } else if (controlButtons.mute) {
      //  return ContextMute;
    } else if (controlButtons.solo) {
      // return ContextSolo;
    } else if (controlButtons.recordArm) {
      return ContextRecordArm;
    }
  }

  // Navigation
  {
    if (controlButtons.up) {
      trackBankHandler.bank.scrollBackwards();
    } else if (controlButtons.down) {
      trackBankHandler.bank.scrollForwards();
    }

    if (controlButtons.left) {
      trackBankHandler.bank.sceneBank().scrollBackwards();
    } else if (controlButtons.right) {
      trackBankHandler.bank.sceneBank().scrollForwards();
    }
  }

  return context;
};

const getTrackFromGrid = (y: number): Track => {
  return trackBankHandler.bank.getItemAt(7 - y);
};

const paintTrackViewCell = (
  renderer: RenderQueue,
  row: number,
  col: number
): void => {
  // Y needs to be inverted.
  const y = 7 - col;
  const x = row;

  const clip = trackBankHandler.clips[col][row];
  const queuedForStop =
    trackBankHandler.trackQueuedForStop[col] || clip.isStopQueued;

  if (clip.isPlaybackQueued) {
    renderer.pulsingLight(x, y, ColorPalette.GreenLighter);
  } else if (queuedForStop) {
    renderer.pulsingLight(x, y, ColorPalette.RedLighter);
  } else if (clip.isRecordingQueued) {
    renderer.pulsingLight(x, y, ColorPalette.RedLighter);
  } else if (clip.isRecording) {
    renderer.flashingLight(x, y, ColorPalette.RedDarker, ColorPalette.Red);
  } else if (clip.isPlaying) {
    renderer.flashingLight(
      x,
      y,
      ColorPalette.GreenDarker,
      ColorPalette.GreenLighter
    );
  } else if (clip.hasContent) {
    const [clipR, clipG, clipB] = clip.color;
    renderer.rgbLight(x, y, clipR, clipG, clipB);
  } else {
    const [trackR, trackG, trackB] = trackBankHandler.colors[col];
    renderer.rgbLight(
      x,
      y,
      trackR * BACKGROUND_LIGHT_STRENGTH,
      trackG * BACKGROUND_LIGHT_STRENGTH,
      trackB * BACKGROUND_LIGHT_STRENGTH
    );
  }
};

const paintGridTrackView = (renderer: RenderQueue): void => {
  for (var row = 0; row < NUM_SCENES; row++) {
    for (var col = 0; col < NUM_SCENES; col++) {
      paintTrackViewCell(renderer, row, col);
    }
  }
};

const paintFlashingGrid = (
  renderer: RenderQueue,
  a: ColorPalette,
  b: ColorPalette
): void => {
  for (var row = 0; row < NUM_SCENES; row++) {
    for (var col = 0; col < NUM_SCENES; col++) {
      // Y needs to be inverted.
      const y = 7 - col;
      const x = row;

      renderer.flashingLight(x, y, a, b);
    }
  }
};

const paintColoredContext = (context: Context, renderer: RenderQueue) => {
  if (context.renderInstructions.gridOverride !== null) {
    for (var row = 0; row < NUM_SCENES; row++) {
      for (var col = 0; col < NUM_SCENES; col++) {
        context.renderInstructions.gridOverride(renderer, row, col);
      }
    }
  } else if (
    context.renderInstructions.grid === ColorPalette.DefaultTrackBehavior
  ) {
    paintGridTrackView(renderer);
  } else {
    println(
      `Need to figure out how I want to do alternate grid painting behavior. Defaulting to flashing pink and green.`
    );
    paintFlashingGrid(
      renderer,
      ColorPalette.BlueLighter,
      ColorPalette.GreenLighter
    );
  }

  // Navigation buttons are secondary
  for (var x = 0; x < DIRECTIONAL_BTN_COUNT; x++) {
    renderer.staticLight(
      x,
      GRID_HEIGHT,
      context.renderInstructions.navigationButtons
    );
  }

  // Paint other control buttons
  {
    const draw = (x: number, y: number) => {
      return context.isTargetButton(x, y)
        ? renderer.pulsingLight(x, y, context.renderInstructions.targetButton)
        : renderer.staticLight(x, y, context.renderInstructions.otherButtons);
    };

    var x = 0;
    var y = GRID_HEIGHT;

    for (x = DIRECTIONAL_BTN_COUNT; x < NUM_SCENES; x++) {
      draw(x, y);
    }

    x = GRID_WIDTH;
    for (y = 0; y < NUM_SCENES; y++) {
      draw(x, y);
    }
  }

  // Paint logo
  {
    renderer.pulsingLight(GRID_WIDTH, GRID_HEIGHT, ColorPalette.RedLighter);
  }
};
