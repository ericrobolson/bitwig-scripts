const index1dTo2d = (index: number, width: number): [number, number] => {
  return [index % width, index / width];
};

const index2dTo1d = (
  x: number,
  y: number,
  width: number,
  height: number
): number => {
  return (y % height) * width + (x % width);
};
