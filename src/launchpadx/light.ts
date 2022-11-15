const light = (
  x: number,
  y: number,
  type: LightType,
  color: string
): string => {
  const index = x + 1 + (y + 1) * 10;
  return `${type} ${uint8ToHex(index)} ${color}`;
};

const rgbLight = (
  x: number,
  y: number,
  r: number,
  g: number,
  b: number
): string => {
  const color = `${uint8ToHex(r)} ${uint8ToHex(g)} ${uint8ToHex(b)}`;
  return light(x, y, LightType.RGB, color);
};

const flashingLight = (
  x: number,
  y: number,
  colorA: ColorPalette,
  colorB: ColorPalette
): string => {
  return light(x, y, LightType.Flashing, `${colorA} ${colorB}`);
};

const staticLight = (x: number, y: number, color: ColorPalette): string => {
  return light(x, y, LightType.Static, color);
};

const pulsingLight = (x: number, y: number, color: ColorPalette): string => {
  return light(x, y, LightType.Pulsing, color);
};
