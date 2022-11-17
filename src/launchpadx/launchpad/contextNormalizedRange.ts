const contextNormalizedRange = (
  title: string,
  isTargetButton: (x: number, y: number) => boolean,
  action: (lp: LaunchpadObject, x: number, y: number) => void,
  contextButtonColor: ColorPalette,
  otherButtonsColor: ColorPalette,
  navigationButtonsColor: ColorPalette
): Context => {
  return {
    title(): string {
      return title;
    },
    shouldReplaceHistory() {
      return false;
    },
    isTargetButton: isTargetButton,
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
        this.isTargetButton(x, y) && state == ButtonState.ToggledOn;

      if (shouldReturnToPrevious) {
        return lp.lastContext();
      }

      if (state == ButtonState.ToggledOn && isGridButton) {
        //  action(lp, x, y);
        println("TODO: need to figure out actions");

        return this;
      }

      return contextDefaultTransition(lp, this);
    },
    renderInstructions: {
      targetButton: contextButtonColor,
      navigationButtons: navigationButtonsColor,
      otherButtons: otherButtonsColor,
      grid: ColorPalette.DefaultTrackBehavior,
      gridOverride: (renderer: RenderQueue, row: number, col: number) => {
        // Y needs to be inverted.
        const y = 7 - col;
        const x = row;

        const volume = trackBankHandler.getTrackVolumeNormalized(y);

        const volumeToGrid = volume * GRID_WIDTH;
        const rem = volumeToGrid % 1;
        const gridSquare = volumeToGrid - rem;
        const isGridSquare = x < gridSquare;

        const strength = isGridSquare ? 1.0 : 0.01;
        const [trackR, trackG, trackB] = trackBankHandler.colors[col];

        if (x == gridSquare) {
          renderer.rgbLight(x, y, trackR * rem, trackG * rem, trackB * rem);
        } else {
          renderer.rgbLight(
            x,
            y,
            trackR * strength,
            trackG * strength,
            trackB * strength
          );
        }
      },
    },
  };
};

const ContextVolume: Context = contextNormalizedRange(
  "ContextVolume",
  ControlButtons.isVolume,
  (_lp: LaunchpadObject, _x: number, y: number) => getTrackFromGrid(y).stop(),
  ColorPalette.Green,
  ColorPalette.Red,
  ColorPalette.Blue
);
