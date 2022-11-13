const GRID_WIDTH: number = 8;
const GRID_HEIGHT: number = 8;
const NUM_NOTES = 128;

class LaunchpadObject {
  private noteVelocities: Array<number>;
  private prevVelocities: Array<number>;
  private previousLights: Array<string>;
  private controlButtons: ControlButtons;
  private gridButtons: GridButtons = new GridButtons(GRID_WIDTH, GRID_HEIGHT);

  constructor() {
    this.prevVelocities = new Array(NUM_NOTES);
    this.noteVelocities = new Array(NUM_NOTES);
    for (var i = 0; i < NUM_NOTES; i++) {
      this.prevVelocities[i] = 0;
      this.noteVelocities[i] = 0;
    }

    const previousLightsSize = GRID_WIDTH * GRID_HEIGHT;
    this.previousLights = new Array(previousLightsSize);
    for (var i = 0; i < previousLightsSize; i++) {
      this.previousLights[i] = "";
    }

    this.controlButtons = new ControlButtons();
    this.gridButtons = new GridButtons(GRID_WIDTH, GRID_HEIGHT);
  }

  handleMidi(_status: number, note: number, velocity: number) {
    const x = (note % 10) - 1;
    const y = Math.floor(note / 10) - 1;

    const prevVelocity = this.noteVelocities[note];
    this.prevVelocities[note] = prevVelocity;
    this.noteVelocities[note] = velocity;

    const toggledOn = prevVelocity === 0 && velocity !== 0;
    const toggledOff = prevVelocity > 0 && velocity === 0;

    const isOn = velocity > 0;
    const isOff = velocity === 0;
    const isGridButton = x < 8 && y < 8;

    if (isGridButton) {
      this.maybeSetGridButtons(x, y, isOn);
    } else {
      this.maybeSetTopControlButtons(x, y, isOn, toggledOn);
      this.maybeSetSideControlButtons(x, y, isOn, toggledOn);
    }

    if (toggledOn) {
      if (isGridButton) {
        const track = trackBankHandler.bank.getItemAt(7 - y);
        const clipLauncher = track.clipLauncherSlotBank();

        // Select things
        track.select();
        clipLauncher.select(x);
        if (this.controlButtons.record) {
          clipLauncher.record(x);
        } else if (this.controlButtons.stopClip) {
          clipLauncher.stop();
        } else if (this.controlButtons.custom) {
          // delete clip
          clipLauncher.getItemAt(x).deleteObject();
        } else {
          // TODO: need to differentiate between get item at and launch
          clipLauncher.launch(x);
          // clipLauncher.getItemAt(x);
        }
      } else {
        if (this.controlButtons.up) {
          trackBankHandler.bank.scrollBackwards();
        } else if (this.controlButtons.down) {
          trackBankHandler.bank.scrollForwards();
        }

        if (this.controlButtons.left) {
          trackBankHandler.bank.sceneBank().scrollBackwards();
        } else if (this.controlButtons.right) {
          trackBankHandler.bank.sceneBank().scrollForwards();
        }
      }
    }
  }

  flush() {
    var lights = "";
    var lightIndex = 0;
    var changedLights = 0;

    // Paint grid
    {
      for (var row = 0; row < NUM_SCENES; row++) {
        for (var col = 0; col < NUM_SCENES; col++) {
          // Y needs to be inverted.
          const y = 7 - col;
          const x = row;

          const clip = trackBankHandler.clips[col][row];
          const [trackR, trackG, trackB] = trackBankHandler.colors[col];

          const light = clip.hasContent
            ? clipLight(x, y, clip)
            : rgbLight(
                x,
                y,
                trackR * BACKGROUND_LIGHT_STRENGTH,
                trackG * BACKGROUND_LIGHT_STRENGTH,
                trackB * BACKGROUND_LIGHT_STRENGTH
              );

          if (this.previousLights[lightIndex] !== light) {
            lights += light;
            this.previousLights[lightIndex] = light;
            changedLights += 1;
          }

          lightIndex += 1;
        }
      }
    }

    // Paint side bar
    {
      const x = GRID_WIDTH;
      for (var col = 0; col < NUM_SCENES; col++) {
        const y = col;
        const [r, g, b] = trackBankHandler.colors[7 - y];

        let light;
        let isHeld = false;

        if (isHeld) {
          light = staticLight(x, y, ColorPalette.Purple);
        } else if (r === 0 && g === 0 && b === 0) {
          light = staticLight(x, y, ColorPalette.White);
        } else {
          light = rgbLight(x, y, r, g, b);
        }

        if (this.previousLights[lightIndex] !== light) {
          lights += light;
          this.previousLights[lightIndex] = light;
          changedLights += 1;
        }
        lightIndex += 1;
      }
    }

    // Paint top
    {
      const y = GRID_HEIGHT;
      for (var x = 0; x < NUM_SCENES; x++) {
        const light = staticLight(x, y, ColorPalette.Blue);

        if (this.previousLights[lightIndex] !== light) {
          lights += light;
          this.previousLights[lightIndex] = light;
          changedLights += 1;
        }
        lightIndex += 1;
      }
    }

    // Paint logo
    {
      const light = pulsingLight(8, 8, ColorPalette.HotPink);
      if (this.previousLights[lightIndex] !== light) {
        lights += light;
        this.previousLights[lightIndex] = light;
        changedLights += 1;
      }
      lightIndex += 1;
    }

    if (changedLights > 0) {
      const sysex = `F0 00 20 29 02 0C 03 ${lights} f7`;
      sendSysex(sysex);
    }
  }

  private maybeSetGridButtons = (x: number, y: number, isOn: boolean) => {
    if (x < GRID_WIDTH && y < GRID_HEIGHT) {
      this.gridButtons.set(x, y, isOn);
    }
  };

  private maybeSetTopControlButtons = (
    x: number,
    y: number,
    isOn: boolean,
    toggledOn: boolean
  ) => {
    if (y == GRID_WIDTH && x >= 0 && x < GRID_WIDTH) {
      switch (x) {
        case 0:
          this.controlButtons.up = isOn;
          break;
        case 1:
          this.controlButtons.down = isOn;
          break;
        case 2:
          this.controlButtons.left = isOn;
          break;
        case 3:
          this.controlButtons.right = isOn;
          break;
        case 4:
          this.controlButtons.session = isOn;
          break;
        case 5:
          this.controlButtons.note = isOn;
          break;
        case 6:
          this.controlButtons.custom = isOn;
          break;
        case 7:
          this.controlButtons.record = isOn;
          break;
      }
    }
  };

  private maybeSetSideControlButtons = (
    x: number,
    y: number,
    isOn: boolean,
    toggledOn: boolean
  ) => {
    if (x == GRID_WIDTH && y >= 0 && y < GRID_HEIGHT) {
      switch (y) {
        case 0:
          this.controlButtons.arm = isOn;
          break;
        case 1:
          this.controlButtons.solo = isOn;
          break;
        case 2:
          this.controlButtons.mute = isOn;
          break;
        case 3:
          this.controlButtons.stopClip = isOn;
          break;
        case 4:
          this.controlButtons.sendB = isOn;
          break;
        case 5:
          this.controlButtons.sendA = isOn;
          break;
        case 6:
          this.controlButtons.pan = isOn;
          break;
        case 7:
          this.controlButtons.volume = isOn;
          break;
      }
    }
  };
}
