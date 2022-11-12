enum ButtonEvent {
  Pressed,
  Held,
  Released,
}

type OnButtonEvent = (
  x: number,
  y: number,
  event: ButtonEvent,
  velocity: number,
  prevVelocity: number
) => void;

class ButtonGrid {
  readonly width: number;
  readonly height: number;
  private readonly callbacks: Array<OnButtonEvent>;
  private readonly velocities: Array<number>;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.callbacks = new Array(width * height);
    this.velocities = new Array(width * height);

    var x, y, idx;
    for (x = 0; x < width; x++) {
      for (y = 0; y < height; y++) {
        idx = index2dTo1d(x, y, width, height);
        this.callbacks[idx] = () => {};
        this.velocities[idx] = 0;
      }
    }
  }

  setCallback(x: number, y: number, callback: OnButtonEvent) {
    this.callbacks[index2dTo1d(x, y, this.width, this.height)] = callback;
  }

  handleNote(x: number, y: number, velocity: number) {
    const idx = index2dTo1d(x, y, this.width, this.height);

    let event = null;
    if (this.velocities[idx] > 0 && velocity == 0) {
      event = ButtonEvent.Released;
    } else if (this.velocities[idx] !== velocity) {
      event = ButtonEvent.Held;
    } else {
      event = ButtonEvent.Pressed;
    }

    // Update values and trigger callback.
    this.callbacks[idx](x, y, event, velocity, this.velocities[idx]);
    this.velocities[idx] = velocity;
  }
}
