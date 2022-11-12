class LaunchpadObject {
  private noteVelocities: Array<number>;
  private prevVelocities: Array<number>;
  private controlButtons: ControlButtons = new ControlButtons();
  private gridButtons: GridButtons = new GridButtons(8, 8);

  constructor() {
    const NUM_NOTES = 128;
    this.prevVelocities = new Array(NUM_NOTES);
    this.noteVelocities = new Array(NUM_NOTES);
    for (var i = 0; i < NUM_NOTES; i++) {
      this.prevVelocities[i] = 0;
      this.noteVelocities[i] = 0;
    }
  }

  setLed(x: number, y: number, r: number, g: number, b: number) {
    println("TODO: need to queue op setting of LED");
  }

  flush() {
    var lights = "";

    // Paint grid
    {
      for (var row = 0; row < NUM_SCENES; row++) {
        for (var col = 0; col < NUM_SCENES; col++) {
          // Y needs to be inverted.
          const y = 7 - col;
          const x = row;

          const clip = trackBankHandler.clips[col][row];
          const [trackR, trackG, trackB] = trackBankHandler.colors[col];

          lights += clip.hasContent
            ? clipLight(x, y, clip)
            : rgbLight(
                x,
                y,
                trackR * BACKGROUND_LIGHT_STRENGTH,
                trackG * BACKGROUND_LIGHT_STRENGTH,
                trackB * BACKGROUND_LIGHT_STRENGTH
              );
        }
      }
    }

    // Paint side bar
    {
      const x = 8;
      for (var col = 0; col < NUM_SCENES; col++) {
        const y = col;
        const [r, g, b] = trackBankHandler.colors[7 - y];
        let light;
        if (r === 0 && g === 0 && b === 0) {
          light = staticLight(x, y, ColorPalette.White);
        } else {
          light = rgbLight(x, y, r, g, b);
        }

        lights += light;
      }
    }

    // Paint top
    {
      const y = 8;
      for (var x = 0; x < NUM_SCENES; x++) {
        const y = col;
        lights += pulsingLight(x, y, ColorPalette.Blue);
      }
    }

    const sysex = `F0 00 20 29 02 0C 03 ${lights} f7`;
    sendSysex(sysex);
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
          track.arm().set(true);
          clipLauncher.record(x);
        } else if (this.controlButtons.stopClip) {
          clipLauncher.stop();
        } else {
          clipLauncher.launch(x);
        }
      } else {
        if (this.controlButtons.up) {
          trackBankHandler.bank.scrollBackwards();
        }
        if (this.controlButtons.down) {
          trackBankHandler.bank.scrollForwards();
        }
      }
    }
  }

  private maybeSetGridButtons = (x: number, y: number, isOn: boolean) => {
    if (x < 8 && y < 8) {
      this.gridButtons.set(x, y, isOn);
    }
  };

  private maybeSetTopControlButtons = (
    x: number,
    y: number,
    isOn: boolean,
    toggledOn: boolean
  ) => {
    if (y == 8 && x >= 0 && x <= 7) {
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
    if (x == 8 && y >= 0 && y <= 7) {
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
