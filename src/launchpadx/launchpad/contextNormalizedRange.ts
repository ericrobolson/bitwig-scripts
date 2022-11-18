const contextNormalizedRange = (
  title: string,
  isTargetButton: (x: number, y: number) => boolean,
  targetDisplayValue: (y: number) => number,
  setTargetValue: (y: number, normalizedValue: number) => void,
  contextButtonColor: ColorPalette,
  otherButtonsColor: ColorPalette,
  navigationButtonsColor: ColorPalette,
  normalizeAtCenter: boolean
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

      if (
        (state == ButtonState.On || state == ButtonState.ToggledOn) &&
        isGridButton
      ) {
        let value = 0;
        if (
          lp.gridButtons().isOn(GRID_HALF_VALUE_LOWER, y) &&
          lp.gridButtons().isOn(GRID_HALF_VALUE_HIGHER, y)
        ) {
          value = 0.5;
        } else {
          value = mapRange(x, 0, 7, 0, 1);
        }

        setTargetValue(y, value);
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

        const value = targetDisplayValue(y);
        const valueToGrid = value * GRID_WIDTH;
        const rem = valueToGrid % 1;
        const gridSquare = valueToGrid - rem;
        const isGridSquare = x < gridSquare;

        var strength = isGridSquare ? 1.0 : 0.05;
        if (normalizeAtCenter) {
          if (
            (x >= gridSquare && x < GRID_HALF_VALUE_HIGHER) ||
            (x <= gridSquare && x > GRID_HALF_VALUE_LOWER)
          ) {
            strength = 1.0;
          } else {
            strength = 0.05;
          }
        }

        const [trackR, trackG, trackB] = trackBankHandler.colors[col];

        if (
          (value == 0.5 &&
            (x == GRID_HALF_VALUE_LOWER || x == GRID_HALF_VALUE_HIGHER)) ||
          (value == 1 && x == 7) ||
          x == gridSquare
        ) {
          renderer.pulsingLight(x, y, ColorPalette.White);
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
  (y: number) => {
    return trackBankHandler.getTrackVolumeNormalized(y);
  },
  (y: number, normalizedVolume: number) =>
    trackBankHandler.setTrackVolumeNormalized(y, normalizedVolume),
  ColorPalette.Green,
  ColorPalette.Red,
  ColorPalette.Blue,
  false
);

const ContextPan: Context = contextNormalizedRange(
  "ContextPan",
  ControlButtons.isPan,
  (y: number) => {
    return trackBankHandler.getTrackPanNormalized(y);
  },
  (y: number, normalizedPan: number) =>
    trackBankHandler.setTrackPanNormalized(y, normalizedPan),
  ColorPalette.HotPink,
  ColorPalette.GreenLighter,
  ColorPalette.BlueLighter,
  true
);
