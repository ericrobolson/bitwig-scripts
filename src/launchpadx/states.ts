/**
 * Notes:
 * Launchpad grid goes from bottom left to top right.
 */
module Launchpad {
  const MAX_X_TILES = 8;
  const MAX_Y_TILES = 8;

  type PadGrid = {};
  type Pad = {
    value: number;
    previousValue: number;
    update: (b: Pad, newValue: number) => void;
  };
  const pad = (): Pad => {
    return {
      value: 0,
      previousValue: 0,
      update: (b, newValue) => {
        b.previousValue = b.value;
        b.value = newValue;
      },
    };
  };

  type Context = {
    shouldTransition(state: State): boolean;
  };
  const context = (): Context => {
    return {
      shouldTransition(state) {
        return false;
      },
    };
  };

  export type ControlButtons = {
    directional: {
      up: Pad;
      down: Pad;
      left: Pad;
      right: Pad;
    };
    session: Pad;
    note: Pad;
    custom: Pad;
    captureMidi: Pad;
    volume: Pad;
    pan: Pad;
    sendA: Pad;
    sendB: Pad;
    stopClip: Pad;
    mute: Pad;
    solo: Pad;
    recordArm: Pad;
  };

  export type State = {
    context: Context;
    inputs: {
      controlButtons: ControlButtons;
      buttonGrid: PadGrid;
    };
    lightDisplay: LightDisplay;
  };

  export const init = (): State => {
    return {
      context: context(),
      lightDisplay: new LightDisplay(),
      inputs: {
        controlButtons: {
          directional: {
            up: pad(),
            down: pad(),
            left: pad(),
            right: pad(),
          },
          session: pad(),
          note: pad(),
          custom: pad(),
          captureMidi: pad(),
          volume: pad(),
          pan: pad(),
          sendA: pad(),
          sendB: pad(),
          stopClip: pad(),
          mute: pad(),
          solo: pad(),
          recordArm: pad(),
        },
        buttonGrid: {},
      },
    };
  };

  export const render = (state: State): void => {};

  class LightDisplay {
    private sysex: string = "";

    constructor() {
      this.initialize();
    }

    initialize() {
      this.sysex = "";
    }

    send() {
      sendSysex(this.sysex);
    }
  }

  export const handle_midi = (
    state: State,
    status: number,
    note: number,
    velocity: number
  ): void => {
    println(`MIDI: ${status} - ${note} - ${velocity}`);
    mapMidiToButton(state, status, note, velocity);
    if (state.context.shouldTransition(state)) {
    }
  };

  const mapMidiToButton = (
    state: State,
    _status: number,
    note: number,
    velocity: number
  ): void => {
    const x = (note % 10) - 1;
    const y = Math.floor(note / 10) - 1;

    const isGridButton = x < MAX_X_TILES && y < MAX_Y_TILES;
    if (isGridButton) {
      updatePadGrid(state.inputs.buttonGrid, x, y, velocity);
    } else {
      updateControlButtons(state.inputs.controlButtons, x, y, velocity);
    }
  };

  const updateControlButtons = (
    ctl: ControlButtons,
    x: number,
    y: number,
    value: number
  ) => {
    const update = (pad: Pad) => {
      pad.update(pad, value);
    };

    // Top row
    if (y === 8) {
      (x === 0 && update(ctl.directional.up)) ||
        (x === 1 && update(ctl.directional.down)) ||
        (x === 2 && update(ctl.directional.left)) ||
        (x === 3 && update(ctl.directional.right)) ||
        (x === 4 && update(ctl.session)) ||
        (x === 5 && update(ctl.note)) ||
        (x === 6 && update(ctl.custom)) ||
        (x === 7 && update(ctl.captureMidi));
    }
    // Side column
    else {
      (y === 0 && update(ctl.recordArm)) ||
        (y === 1 && update(ctl.solo)) ||
        (y === 2 && update(ctl.mute)) ||
        (y === 3 && update(ctl.stopClip)) ||
        (y === 4 && update(ctl.sendB)) ||
        (y === 5 && update(ctl.sendA)) ||
        (y === 6 && update(ctl.pan)) ||
        (y === 7 && update(ctl.volume));
    }

    println("need to update control buttons.");
  };

  const updatePadGrid = (
    grid: PadGrid,
    x: number,
    y: number,
    value: number
  ) => {
    println("need to update button grid.");
  };
}
