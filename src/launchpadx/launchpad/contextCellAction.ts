/**
 * Generates a context that performs a single action on a cell. No other values are displayed.
 * Examples are stop or delete.
 * @param title
 * @param isTargetButton
 * @param toggleAction
 * @param trackValueIsActive
 * @param contextButtonColor
 * @param otherButtonsColor
 * @param navigationButtonsColor
 * @param replaceHistory
 * @returns
 */
const contextCellAction = (
  title: string,
  isTargetButton: (x: number, y: number) => boolean,
  action: (lp: LaunchpadObject, x: number, y: number) => void,
  contextButtonColor: ColorPalette,
  otherButtonsColor: ColorPalette,
  navigationButtonsColor: ColorPalette,
  replaceHistory: boolean = false
): Context => {
  return {
    title(): string {
      return title;
    },
    shouldReplaceHistory() {
      return replaceHistory;
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
        action(lp, x, y);

        return this;
      }

      return contextDefaultTransition(lp, this);
    },
    renderInstructions: {
      targetButton: contextButtonColor,
      navigationButtons: navigationButtonsColor,
      otherButtons: otherButtonsColor,
      grid: ColorPalette.DefaultTrackBehavior,
      gridOverride: null,
    },
  };
};

const ContextStopClip: Context = contextCellAction(
  "ContextStopClip",
  ControlButtons.isStopClip,
  (_lp: LaunchpadObject, _x: number, y: number) =>
    trackBankHandler.getTrackFromGrid(y).stop(),
  ColorPalette.Green,
  ColorPalette.Red,
  ColorPalette.Blue
);

const ContextCustom: Context = contextCellAction(
  "ContextCustom/Delete",
  ControlButtons.isCustom,
  (_lp: LaunchpadObject, x: number, y: number) => {
    const track = trackBankHandler.getTrackFromGrid(y);
    const clipLauncher = track.clipLauncherSlotBank();

    clipLauncher.getItemAt(x).deleteObject();
  },
  ColorPalette.Red,
  ColorPalette.GreenDarker,
  ColorPalette.Blue
);

const ContextArrange: Context = contextCellAction(
  "ContextArrange",
  ControlButtons.isSession,
  (lp: LaunchpadObject, x: number, y: number) => {
    const track = trackBankHandler.getTrackFromGrid(y);
    const clipLauncher = track.clipLauncherSlotBank();
    const controlButtons = lp.controlButtons();

    if (controlButtons.record) {
      clipLauncher.record(x);
    } else {
      clipLauncher.select(x);
      clipLauncher.launch(x);
    }
  },
  ColorPalette.Blue,
  ColorPalette.Green,
  ColorPalette.Orange,
  true
);
