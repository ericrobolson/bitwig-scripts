/**
 * Normalizes a color in a 0..1 range to a 0..127 range
 * @param c
 * @returns
 */
const normalizeColor = (c: number): number => {
  return Math.round(c * 127);
};
