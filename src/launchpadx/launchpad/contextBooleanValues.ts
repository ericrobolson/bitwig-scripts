/**
 * Creates a context that renders and sets a track's boolean value. An example would be 'record arm' or 'solo'.
 * @param title
 * @param isTargetButton
 * @param toggleAction
 * @param trackValueIsActive
 * @param contextButtonColor
 * @returns
 */
const trackBooleanValueContext = (
  title: string,
  isTargetButton: (x: number, y: number) => boolean,
  toggleAction: (x: number, y: number) => void,
  trackValueIsActive: (row: number, col: number) => boolean,
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
        this.isTargetButton(x, y) &&
        !isGridButton &&
        state == ButtonState.ToggledOn;

      if (shouldReturnToPrevious) {
        return lp.lastContext();
      }

      if (state == ButtonState.ToggledOn && isGridButton) {
        toggleAction(x, y);

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
        drawTrackGridWithInformationColumns(
          renderer,
          row,
          col,
          trackValueIsActive,
          contextButtonColor
        );
      },
    },
  };
};

const ContextSolo = trackBooleanValueContext(
  "ContextSolo",
  ControlButtons.isSolo,
  (x: number, y: number) => {
    getTrackFromGrid(y).solo().toggle();
  },
  (row: number, col: number) => {
    return trackBankHandler.trackIsSoloed[col];
  },
  ColorPalette.YellowDarker,
  ColorPalette.Purple,
  ColorPalette.BlueLighter
);

const ContextMute = trackBooleanValueContext(
  "ContextMute",
  ControlButtons.isMute,
  (x: number, y: number) => {
    getTrackFromGrid(y).mute().toggle();
  },
  (row: number, col: number) => {
    return trackBankHandler.trackIsMuted[col];
  },
  ColorPalette.Orange,
  ColorPalette.BlueLighter,
  ColorPalette.Purple
);

const ContextRecordArm = trackBooleanValueContext(
  "ContextRecordArm",
  ControlButtons.isRecordArm,
  (x: number, y: number) => {
    getTrackFromGrid(y).arm().toggle();
  },
  (row: number, col: number) => {
    return trackBankHandler.trackIsArmed[col];
  },
  ColorPalette.Red,
  ColorPalette.GreenLighter,
  ColorPalette.Blue
);
