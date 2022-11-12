class GridButtons {
  private items: Array<boolean>;
  private readonly width: number;
  private readonly height: number;

  constructor(width: number, height: number) {
    const capacity = width * height;
    this.width = width;
    this.height = height;
    this.items = new Array(capacity);
    for (var i = 0; i < capacity; i++) {
      this.items[i] = false;
    }
  }

  isOn = (x: number, y: number): boolean => {
    return this.items[index2dTo1d(x, y, this.width, this.height)];
  };

  set = (x: number, y: number, isOn: boolean) => {
    this.items[index2dTo1d(x, y, this.width, this.height)] = isOn;
  };
}
