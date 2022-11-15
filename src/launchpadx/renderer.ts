interface Renderer {
  /**
   * Presents the render.
   */
  present(): void;
}
interface RenderQueue {
  pulsingLight(x: number, y: number, color: ColorPalette): void;
  staticLight(x: number, y: number, color: ColorPalette): void;
  flashingLight(x: number, y: number, a: ColorPalette, b: ColorPalette): void;
  rgbLight(
    x: number,
    y: number,
    rUint8: number,
    gUint8: number,
    bUint8: number
  ): void;
}

class LaunchpadRenderer implements Renderer, RenderQueue {
  private queuedLights: string = "";
  private previousLights: Array<string>;
  private isDirty: boolean = false;
  private currentCount: number = 0;
  private readonly width: number;
  private readonly height: number;
  private readonly MAX_LIGHTS: number = 81;

  constructor(width: number, height: number) {
    const capacity = width * height;
    this.width = width;
    this.height = height;

    this.previousLights = new Array(capacity);
  }
  pulsingLight(x: number, y: number, color: ColorPalette): void {
    this.setLight(x, y, pulsingLight(x, y, color));
  }
  staticLight(x: number, y: number, color: ColorPalette): void {
    this.setLight(x, y, staticLight(x, y, color));
  }
  flashingLight(x: number, y: number, a: ColorPalette, b: ColorPalette): void {
    this.setLight(x, y, flashingLight(x, y, a, b));
  }
  rgbLight(
    x: number,
    y: number,
    rUint8: number,
    gUint8: number,
    bUint8: number
  ): void {
    this.setLight(x, y, rgbLight(x, y, rUint8, gUint8, bUint8));
  }

  /**
   * Attempts to set the given light. If a given light already has that value, will skip sending that message.
   * @param x
   * @param y
   * @param sysexMsg
   */
  private setLight(x: number, y: number, sysexMsg: string) {
    if (this.currentCount < this.MAX_LIGHTS) {
      const index = index2dTo1d(x, y, this.width, this.height);
      if (this.previousLights[index] !== sysexMsg) {
        this.previousLights[index] = sysexMsg;
        this.queuedLights += sysexMsg;
        this.isDirty = true;
        this.currentCount += 1;
      }
    }
  }

  /**
   * Renders the given lights.
   */
  present(): void {
    if (this.isDirty) {
      const sysex = `F0 00 20 29 02 0C 03 ${this.queuedLights} f7`;
      println(this.queuedLights);
      sendSysex(sysex);
      this.clearQueue();
    }
  }

  /**
   * Resets the light queue.
   */
  private clearQueue(): void {
    this.isDirty = false;
    this.currentCount = 0;
    this.queuedLights = "";
  }
}
