//
// Copyright (c) 2022 Eric Robert Olson
// MIT License
//
// THIS IS AN AUTOGENERATED FILE AND SHOULD NOT BE MODIFIED BY HAND
// THIS IS AN AUTOGENERATED FILE AND SHOULD NOT BE MODIFIED BY HAND
// THIS IS AN AUTOGENERATED FILE AND SHOULD NOT BE MODIFIED BY HAND
// THIS IS AN AUTOGENERATED FILE AND SHOULD NOT BE MODIFIED BY HAND
//

//
// src/out/core/core_bitwig.js
//
var isMaxVelocity = function (velocity) {
    return velocity === 127;
};
var isMinVelocity = function (velocity) {
    return velocity === 0;
};
var createNoteIn = function (name, input) {
    return input.createNoteInput(name, 
    // midi messages
    "80????", // note off
    "90????", // note on
    "B0????", // cc commands
    "D0????", // aftertouch
    "E0????" // pitchbend
    );
};
//
// src/out/core/core_color.js
//
/**
 * Normalizes a color in a 0..1 range to a 0..127 range
 * @param c
 * @returns
 */
var normalizeColor = function (c) {
    return Math.round(c * 127);
};
//
// src/out/core/core_math.js
//
var index1dTo2d = function (index, width) {
    return [index % width, index / width];
};
var index2dTo1d = function (x, y, width, height) {
    return (y % height) * width + (x % width);
};
//
// src/out/core/core_trackHandler.js
//
var Clip = /** @class */ (function () {
    function Clip() {
        this.hasContent = false;
        this.color = [0, 0, 0];
        this.index = -1;
        this.isStopQueued = false;
        this.isPlaying = false;
        this.isPlaybackQueued = false;
        this.isRecording = false;
        this.isRecordingQueued = false;
    }
    return Clip;
}());
var TrackHandler = /** @class */ (function () {
    function TrackHandler(host, id, name, numTracks, numSends, numScenes) {
        var _this = this;
        this.colors = new Array(numTracks);
        this.clips = new Array(numTracks);
        this.bank = host.createMainTrackBank(numTracks, numSends, numScenes);
        this.cursor = host.createCursorTrack(id, name, 0, 0, true);
        var bankSize = this.bank.getSizeOfBank();
        var track, element;
        var _loop_1 = function () {
            var idx = i;
            track = this_1.bank.getItemAt(idx);
            // Track elements
            {
                element = track.pan();
                element.markInterested();
                element.setIndication(true);
                element = track.volume();
                element.markInterested();
                element.setIndication(true);
            }
            // Clip data
            {
                var clipLauncher = track.clipLauncherSlotBank();
                clips = new Array(numScenes);
                for (var j = 0; j < numScenes; j++) {
                    clips[j] = new Clip();
                }
                this_1.clips[idx] = clips;
                clipLauncher.addHasContentObserver(function (slotIndex, hasContent) {
                    _this.clips[idx][slotIndex].index = slotIndex;
                    _this.clips[idx][slotIndex].hasContent = hasContent;
                });
                clipLauncher.addIsStopQueuedObserver(function (slotIndex, isStopQueued) {
                    _this.clips[idx][slotIndex].isStopQueued = isStopQueued;
                });
                clipLauncher.addIsPlayingObserver(function (slotIndex, isPlaying) {
                    _this.clips[idx][slotIndex].isPlaying = isPlaying;
                });
                clipLauncher.addIsPlaybackQueuedObserver(function (slotIndex, isQueued) {
                    _this.clips[idx][slotIndex].isPlaybackQueued = isQueued;
                });
                clipLauncher.addIsRecordingObserver(function (slotIndex, isRecording) {
                    _this.clips[idx][slotIndex].isRecording = isRecording;
                });
                clipLauncher.addIsRecordingQueuedObserver(function (slotIndex, isQueued) {
                    _this.clips[idx][slotIndex].isRecordingQueued = isQueued;
                });
                clipLauncher.addColorObserver(function (slotIndex, r, g, b) {
                    _this.clips[idx][slotIndex].index = slotIndex;
                    _this.clips[idx][slotIndex].color = [
                        normalizeColor(r),
                        normalizeColor(g),
                        normalizeColor(b),
                    ];
                });
            }
            // Set colors for track
            {
                this_1.colors[idx] = [0, 0, 0];
                track.color().addValueObserver(function (r, g, b) {
                    _this.colors[idx] = [
                        normalizeColor(r),
                        normalizeColor(g),
                        normalizeColor(b),
                    ];
                });
            }
        };
        var this_1 = this, clips;
        for (var i = 0; i < bankSize; i++) {
            _loop_1();
        }
        this.bank.followCursorTrack(this.cursor);
        this.cursor.solo().markInterested();
        this.cursor.mute().markInterested();
    }
    return TrackHandler;
}());
//
// src/out/core/core_transportHandler.js
//
var TransportHandler = /** @class */ (function () {
    function TransportHandler(host) {
        this.transport = host.createTransport();
    }
    return TransportHandler;
}());
//
// src/out/consts.js
//
var NUM_TRACKS = 8;
var NUM_SENDS = 8;
var NUM_SCENES = 8;
var BACKGROUND_LIGHT_STRENGTH = 0.1;
//
// src/out/gridButtons.js
//
var GridButtons = /** @class */ (function () {
    function GridButtons(width, height) {
        var _this = this;
        this.isOn = function (x, y) {
            return _this.items[index2dTo1d(x, y, _this.width, _this.height)];
        };
        this.set = function (x, y, isOn) {
            _this.items[index2dTo1d(x, y, _this.width, _this.height)] = isOn;
        };
        var capacity = width * height;
        this.width = width;
        this.height = height;
        this.items = new Array(capacity);
        for (var i = 0; i < capacity; i++) {
            this.items[i] = false;
        }
    }
    return GridButtons;
}());
//
// src/out/launchpadx.js
//
/*
class LaunchpadObject {
  private noteVelocities: Array<number>;
  private prevVelocities: Array<number>;

  constructor() {
    const NUM_NOTES = 128;
    this.prevVelocities = new Array(NUM_NOTES);
    this.noteVelocities = new Array(NUM_NOTES);
    for (var i = 0; i < NUM_NOTES; i++) {
      this.prevVelocities[i] = 0;
      this.noteVelocities[i] = 0;
    }
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

        let isHeld = false;

        if (isHeld) {
          light = staticLight(x, y, ColorPalette.Purple);
        } else if (r === 0 && g === 0 && b === 0) {
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
        lights += staticLight(x, y, ColorPalette.Blue);
      }
    }

    // Paint logo
    {
      lights += pulsingLight(8, 8, ColorPalette.HotPink);
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
*/
//
// src/out/light.js
//
var clipLight = function (x, y, clip) {
    if (clip.isRecordingQueued) {
        return pulsingLight(x, y, "04" /* ColorPalette.RedLighter */);
    }
    else if (clip.isPlaybackQueued) {
        return pulsingLight(x, y, "14" /* ColorPalette.GreenLighter */);
    }
    else if (clip.isStopQueued) {
        return pulsingLight(x, y, "47" /* ColorPalette.Dirt */);
    }
    else if (clip.isRecording) {
        return flashingLight(x, y, "07" /* ColorPalette.RedDarker */, "48" /* ColorPalette.Red */);
    }
    else if (clip.isPlaying) {
        return flashingLight(x, y, "7B" /* ColorPalette.GreenDarker */, "57" /* ColorPalette.Green */);
    }
    var _a = clip.color, clipR = _a[0], clipG = _a[1], clipB = _a[2];
    return rgbLight(x, y, clipR, clipG, clipB);
};
var light = function (x, y, type, color) {
    var index = x + 1 + (y + 1) * 10;
    return "".concat(type, " ").concat(uint8ToHex(index), " ").concat(color);
};
var rgbLight = function (x, y, r, g, b) {
    var color = "".concat(uint8ToHex(r), " ").concat(uint8ToHex(g), " ").concat(uint8ToHex(b));
    return light(x, y, "03" /* LightType.RGB */, color);
};
var flashingLight = function (x, y, colorA, colorB) {
    return light(x, y, "01" /* LightType.Flashing */, "".concat(colorA, " ").concat(colorB));
};
var staticLight = function (x, y, color) {
    return light(x, y, "00" /* LightType.Static */, color);
};
var pulsingLight = function (x, y, color) {
    return light(x, y, "02" /* LightType.Pulsing */, color);
};
//
// src/out/states.js
//
var Launchpad;
(function (Launchpad) {
    var MAX_X_TILES = 8;
    var MAX_Y_TILES = 8;
    var button = function () {
        return {
            value: false,
            previousValue: false,
        };
    };
    var context = function () {
        return {
            shouldTransition: function (state) {
                return false;
            },
        };
    };
    Launchpad.init = function () {
        return {
            context: context(),
            lightDisplay: new LightDisplay(),
            inputs: {
                controlButtons: {
                    directional: {
                        up: button(),
                        down: button(),
                        left: button(),
                        right: button(),
                    },
                    session: button(),
                    note: button(),
                    custom: button(),
                    captureMidi: button(),
                    volume: button(),
                    pan: button(),
                    sendA: button(),
                    sendB: button(),
                    stopClip: button(),
                    mute: button(),
                    solo: button(),
                    recordArm: button(),
                },
                buttonGrid: {},
            },
        };
    };
    Launchpad.render = function (state) { };
    var LightDisplay = /** @class */ (function () {
        function LightDisplay() {
            this.sysex = "";
            this.initialize();
        }
        LightDisplay.prototype.initialize = function () {
            this.sysex = "";
        };
        LightDisplay.prototype.send = function () {
            sendSysex(this.sysex);
        };
        return LightDisplay;
    }());
    Launchpad.handle_midi = function (state, status, note, velocity) {
        println("MIDI: ".concat(status, " - ").concat(note, " - ").concat(velocity));
        mapMidiToButton(state, status, note, velocity);
        if (state.context.shouldTransition(state)) {
        }
    };
    var mapMidiToButton = function (state, status, note, velocity) {
        var x = (note % 10) - 1;
        var y = Math.floor(note / 10) - 1;
        var isGridButton = x < MAX_X_TILES && y < MAX_Y_TILES;
        if (isGridButton) {
            updateButtonGrid(state.inputs.buttonGrid, x, y, velocity);
        }
        else {
            updateControlButtons(state.inputs.controlButtons, x, y, velocity);
        }
    };
    var updateControlButtons = function (ctl, x, y, value) {
        println("need to update control buttons.");
    };
    var updateButtonGrid = function (grid, x, y, value) {
        println("need to update button grid.");
    };
})(Launchpad || (Launchpad = {}));
//
// src/out/launchpadX.control.js
//
/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////// SCRIPT INIT //////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
loadAPI(17);
host.setShouldFailOnDeprecatedUse(true);
host.defineController("Generic", "Launchpad X-Treme - Eric Olson", "0.2", "FC7C731D-C6D9-4627-875C-D0AA397BA73A");
host.defineMidiPorts(1, 1);
host.addDeviceNameBasedDiscoveryPair(["Launchpad X"], ["Launchpad X"]);
for (var i = 0; i < 10; i++) {
    host.addDeviceNameBasedDiscoveryPair(["MIDIIN".concat(i, " (LPX MIDI)")], ["MIDIOUT".concat(i, " (LPX MIDI)")]);
}
host.addDeviceNameBasedDiscoveryPair(["LPX MIDI"], ["LPX MIDI"]);
//TODO: need to add in more named discovery pairs.
var transportHandler;
var trackBankHandler;
var state;
var init = function () {
    sendSysex("F0 00 20 29 02 0C 00 7F F7" /* Sysex.programmerMode */);
    var inputPort = host.getMidiInPort(0);
    inputPort.setMidiCallback(onMidi);
    inputPort.setSysexCallback(onSysex);
    state = Launchpad.init();
    transportHandler = new TransportHandler(host);
    trackBankHandler = new TrackHandler(host, "LPX_TrackHandler", "LPX_TrackHandler_Cursor", NUM_TRACKS, NUM_SCENES, NUM_SENDS);
};
// Called when a short MIDI message is received on MIDI input port 0.
function onMidi(status, note, velocity) {
    Launchpad.handle_midi(state, status, note, velocity);
}
// Called when a MIDI sysex message is received on MIDI input port 0.
function onSysex(data) {
    // println(`sysex: ${data}`);
}
function flush() {
    Launchpad.render(state);
}
var exit = function () {
    sendSysex("F0 00 20 29 02 0C 00 00 F7" /* Sysex.sessionMode */);
};
/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////// SCRIPT INIT //////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
