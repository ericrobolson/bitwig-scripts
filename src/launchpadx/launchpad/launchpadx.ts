class LaunchpadObject {
  private noteVelocities: Array<number>;
  private prevVelocities: Array<number>;
  private previousLights: Array<string>;
  private controlButtons: ControlButtons;
  private gridButtons: GridButtons;
  private state: State;
  private renderer: Renderer & RenderQueue;

  constructor() {
    this.state = DefaultArrangeState;
    this.renderer = new LaunchpadRenderer(GRID_WIDTH, GRID_HEIGHT);
    this.gridButtons = new GridButtons(GRID_WIDTH, GRID_HEIGHT);

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

    //
    // This should be moved to transition state
    //
    {
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
    //
    //
    //

    this.state = this.state.transition(this);
  }

  flush() {
    this.state.render(this, this.renderer);
    this.renderer.present();
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

const Buttons = {
  isUp(x: number, y: number): boolean {
    return x == 0 && y == GRID_HEIGHT;
  },
  isDown(x: number, y: number): boolean {
    return x == 1 && y == GRID_HEIGHT;
  },
  isLeft(x: number, y: number): boolean {
    return x == 2 && y == GRID_HEIGHT;
  },
  isRight(x: number, y: number): boolean {
    return x == 3 && y == GRID_HEIGHT;
  },

  isSession(x: number, y: number): boolean {
    return x == 4 && y == GRID_HEIGHT;
  },
  isNote(x: number, y: number): boolean {
    return x == 5 && y == GRID_HEIGHT;
  },
  isCustom(x: number, y: number): boolean {
    return x == 6 && y == GRID_HEIGHT;
  },
  isCaptureMidi(x: number, y: number): boolean {
    return x == 7 && y == GRID_HEIGHT;
  },
  isVolume(x: number, y: number): boolean {
    return x == GRID_WIDTH && y == 7;
  },
  isPan(x: number, y: number): boolean {
    return x == GRID_WIDTH && y == 6;
  },
  isSendA(x: number, y: number): boolean {
    return x == GRID_WIDTH && y == 5;
  },
  isSendB(x: number, y: number): boolean {
    return x == GRID_WIDTH && y == 4;
  },
  isStopClip(x: number, y: number): boolean {
    return x == GRID_WIDTH && y == 3;
  },
  isMute(x: number, y: number): boolean {
    return x == GRID_WIDTH && y == 2;
  },
  isSolo(x: number, y: number): boolean {
    return x == GRID_WIDTH && y == 1;
  },
  isRecordArm(x: number, y: number): boolean {
    return x == GRID_WIDTH && y == 0;
  },
};
