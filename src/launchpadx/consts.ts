const enum Sysex {
  programmerMode = "F0 00 20 29 02 0C 00 7F F7",
  sessionMode = "F0 00 20 29 02 0C 00 00 F7",
}

const enum PanelLayout {
  edit = "EDIT",
  arrange = "ARRANGE",
  mix = "MIX",
}

const enum ColorPalette {
  Off = "00",

  Purple = "50",

  Red = "48",
  RedLighter = "04",
  RedDarker = "07",

  Green = "57",
  GreenLighter = "14",
  GreenDarker = "7B",

  Blue = "4F",
  BlueLighter = "25",
  BlueDarker = "27",

  HotPink = "5F",
  White = "77",
  Dirt = "47",
}

const enum LightType {
  Static = "00",
  Flashing = "01",
  Pulsing = "02",
  RGB = "03",
}

const NUM_TRACKS = 8;
const NUM_SENDS = 8;
const NUM_SCENES = 8;

const BACKGROUND_LIGHT_STRENGTH = 0.1;
