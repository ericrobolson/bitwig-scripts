enum ButtonState {
  ToggledOn,
  ToggledOff,
  On,
  Off,
}

const enum Sysex {
  programmerMode = "F0 00 20 29 02 0C 00 7F F7",
  sessionMode = "F0 00 20 29 02 0C 00 00 F7",
}

/**
 * Hexadecimal or behavioral color pallete options.
 */
const enum ColorPalette {
  TrackColor,
  TrackColorBackground,
  DefaultTrackBehavior,
  Orange,
  Off,
  Purple,
  Red,
  RedLighter,
  RedDarker,
  Green,
  GreenLighter,
  GreenDarker,
  Blue,
  BlueLighter,
  BlueDarker,
  HotPink,
  White,
  Dirt,
  Yellow,
}

const getHexFromColorPalette = (c: ColorPalette): string => {
  switch (c) {
    case ColorPalette.Yellow:
      return "74";
    case ColorPalette.HotPink:
      return "5F";
    case ColorPalette.White:
      return "77";
    case ColorPalette.Dirt:
      return "47";
    case ColorPalette.Blue:
      return "4F";
    case ColorPalette.BlueLighter:
      return "25";
    case ColorPalette.BlueDarker:
      return "27";
    case ColorPalette.Green:
      return "57";
    case ColorPalette.GreenLighter:
      return "19";
    case ColorPalette.GreenDarker:
      return "17";
    case ColorPalette.Red:
      return "05";
    case ColorPalette.RedDarker:
      return "07";
    case ColorPalette.RedLighter:
      return "04";
    case ColorPalette.Orange:
      return "54";
    case ColorPalette.Purple:
      return "37";
    case ColorPalette.Off:
    default:
      println(`Got unmapped color ${c}`);
      return "00";
  }
};

const enum LightType {
  Static = "00",
  Flashing = "01",
  Pulsing = "02",
  RGB = "03",
}

const NUM_TRACKS = 8;
const NUM_SENDS = 8;
const NUM_SCENES = 8;

const GRID_WIDTH: number = 8;
const GRID_HEIGHT: number = 8;

const DIRECTIONAL_BTN_COUNT = 4;

const NUM_NOTES = 128;

const BACKGROUND_LIGHT_STRENGTH = 0.1;
