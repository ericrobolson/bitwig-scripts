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
// src/out/core/core_containers.js
//
var ButtonEvent;
(function (ButtonEvent) {
    ButtonEvent[ButtonEvent["Pressed"] = 0] = "Pressed";
    ButtonEvent[ButtonEvent["Held"] = 1] = "Held";
    ButtonEvent[ButtonEvent["Released"] = 2] = "Released";
})(ButtonEvent || (ButtonEvent = {}));
var ButtonGrid = /** @class */ (function () {
    function ButtonGrid(width, height) {
        this.width = width;
        this.height = height;
        this.callbacks = new Array(width * height);
        this.velocities = new Array(width * height);
        var x, y, idx;
        for (x = 0; x < width; x++) {
            for (y = 0; y < height; y++) {
                idx = index2dTo1d(x, y, width, height);
                this.callbacks[idx] = function () { };
                this.velocities[idx] = 0;
            }
        }
    }
    ButtonGrid.prototype.setCallback = function (x, y, callback) {
        this.callbacks[index2dTo1d(x, y, this.width, this.height)] = callback;
    };
    ButtonGrid.prototype.handleNote = function (x, y, velocity) {
        var idx = index2dTo1d(x, y, this.width, this.height);
        var event = null;
        if (this.velocities[idx] > 0 && velocity == 0) {
            event = ButtonEvent.Released;
        }
        else if (this.velocities[idx] !== velocity) {
            event = ButtonEvent.Held;
        }
        else {
            event = ButtonEvent.Pressed;
        }
        // Update values and trigger callback.
        this.callbacks[idx](x, y, event, velocity, this.velocities[idx]);
        this.velocities[idx] = velocity;
    };
    return ButtonGrid;
}());
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
// src/out/core/core_scenes.js
//

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
    function TrackHandler(host, id, name, numTracks, numSends, numScenes, showIndications) {
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
        this.bank.sceneBank().setIndication(showIndications);
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
// src/out/controlButtons.js
//
var ControlButtons = /** @class */ (function () {
    function ControlButtons() {
        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;
        this.session = false;
        this.note = false;
        this.custom = false;
        this.record = false;
        this.volume = false;
        this.pan = false;
        this.sendA = false;
        this.sendB = false;
        this.stopClip = false;
        this.mute = false;
        this.solo = false;
        this.arm = false;
    }
    return ControlButtons;
}());
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
var GRID_WIDTH = 8;
var GRID_HEIGHT = 8;
var NUM_NOTES = 128;
var LaunchpadObject = /** @class */ (function () {
    function LaunchpadObject() {
        var _this = this;
        this.gridButtons = new GridButtons(GRID_WIDTH, GRID_HEIGHT);
        this.maybeSetGridButtons = function (x, y, isOn) {
            if (x < GRID_WIDTH && y < GRID_HEIGHT) {
                _this.gridButtons.set(x, y, isOn);
            }
        };
        this.maybeSetTopControlButtons = function (x, y, isOn, toggledOn) {
            if (y == GRID_WIDTH && x >= 0 && x < GRID_WIDTH) {
                switch (x) {
                    case 0:
                        _this.controlButtons.up = isOn;
                        break;
                    case 1:
                        _this.controlButtons.down = isOn;
                        break;
                    case 2:
                        _this.controlButtons.left = isOn;
                        break;
                    case 3:
                        _this.controlButtons.right = isOn;
                        break;
                    case 4:
                        _this.controlButtons.session = isOn;
                        break;
                    case 5:
                        _this.controlButtons.note = isOn;
                        break;
                    case 6:
                        _this.controlButtons.custom = isOn;
                        break;
                    case 7:
                        _this.controlButtons.record = isOn;
                        break;
                }
            }
        };
        this.maybeSetSideControlButtons = function (x, y, isOn, toggledOn) {
            if (x == GRID_WIDTH && y >= 0 && y < GRID_HEIGHT) {
                switch (y) {
                    case 0:
                        _this.controlButtons.arm = isOn;
                        break;
                    case 1:
                        _this.controlButtons.solo = isOn;
                        break;
                    case 2:
                        _this.controlButtons.mute = isOn;
                        break;
                    case 3:
                        _this.controlButtons.stopClip = isOn;
                        break;
                    case 4:
                        _this.controlButtons.sendB = isOn;
                        break;
                    case 5:
                        _this.controlButtons.sendA = isOn;
                        break;
                    case 6:
                        _this.controlButtons.pan = isOn;
                        break;
                    case 7:
                        _this.controlButtons.volume = isOn;
                        break;
                }
            }
        };
        this.prevVelocities = new Array(NUM_NOTES);
        this.noteVelocities = new Array(NUM_NOTES);
        for (var i = 0; i < NUM_NOTES; i++) {
            this.prevVelocities[i] = 0;
            this.noteVelocities[i] = 0;
        }
        var previousLightsSize = GRID_WIDTH * GRID_HEIGHT;
        this.previousLights = new Array(previousLightsSize);
        for (var i = 0; i < previousLightsSize; i++) {
            this.previousLights[i] = "";
        }
        this.controlButtons = new ControlButtons();
        this.gridButtons = new GridButtons(GRID_WIDTH, GRID_HEIGHT);
    }
    LaunchpadObject.prototype.handleMidi = function (_status, note, velocity) {
        var x = (note % 10) - 1;
        var y = Math.floor(note / 10) - 1;
        var prevVelocity = this.noteVelocities[note];
        this.prevVelocities[note] = prevVelocity;
        this.noteVelocities[note] = velocity;
        var toggledOn = prevVelocity === 0 && velocity !== 0;
        var toggledOff = prevVelocity > 0 && velocity === 0;
        var isOn = velocity > 0;
        var isOff = velocity === 0;
        var isGridButton = x < 8 && y < 8;
        if (isGridButton) {
            this.maybeSetGridButtons(x, y, isOn);
        }
        else {
            this.maybeSetTopControlButtons(x, y, isOn, toggledOn);
            this.maybeSetSideControlButtons(x, y, isOn, toggledOn);
        }
        if (toggledOn) {
            if (isGridButton) {
                var track = trackBankHandler.bank.getItemAt(7 - y);
                var clipLauncher = track.clipLauncherSlotBank();
                // Select things
                track.select();
                clipLauncher.select(x);
                if (this.controlButtons.record) {
                    clipLauncher.record(x);
                }
                else if (this.controlButtons.stopClip) {
                    clipLauncher.stop();
                }
                else if (this.controlButtons.custom) {
                    // delete clip
                    clipLauncher.getItemAt(x).deleteObject();
                }
                else {
                    // TODO: need to differentiate between get item at and launch
                    clipLauncher.launch(x);
                    // clipLauncher.getItemAt(x);
                }
            }
            else {
                if (this.controlButtons.up) {
                    trackBankHandler.bank.scrollBackwards();
                }
                else if (this.controlButtons.down) {
                    trackBankHandler.bank.scrollForwards();
                }
                if (this.controlButtons.left) {
                    trackBankHandler.bank.sceneBank().scrollBackwards();
                }
                else if (this.controlButtons.right) {
                    trackBankHandler.bank.sceneBank().scrollForwards();
                }
            }
        }
    };
    LaunchpadObject.prototype.flush = function () {
        var lights = "";
        var lightIndex = 0;
        var changedLights = 0;
        // Paint grid
        {
            for (var row = 0; row < NUM_SCENES; row++) {
                for (var col = 0; col < NUM_SCENES; col++) {
                    // Y needs to be inverted.
                    var y = 7 - col;
                    var x_1 = row;
                    var clip = trackBankHandler.clips[col][row];
                    var _a = trackBankHandler.colors[col], trackR = _a[0], trackG = _a[1], trackB = _a[2];
                    var light_1 = clip.hasContent
                        ? clipLight(x_1, y, clip)
                        : rgbLight(x_1, y, trackR * BACKGROUND_LIGHT_STRENGTH, trackG * BACKGROUND_LIGHT_STRENGTH, trackB * BACKGROUND_LIGHT_STRENGTH);
                    if (this.previousLights[lightIndex] !== light_1) {
                        lights += light_1;
                        this.previousLights[lightIndex] = light_1;
                        changedLights += 1;
                    }
                    lightIndex += 1;
                }
            }
        }
        // Paint side bar
        {
            var x_2 = GRID_WIDTH;
            for (var col = 0; col < NUM_SCENES; col++) {
                var y = col;
                var _b = trackBankHandler.colors[7 - y], r = _b[0], g = _b[1], b = _b[2];
                var light_2 = void 0;
                var isHeld = false;
                if (isHeld) {
                    light_2 = staticLight(x_2, y, "50" /* ColorPalette.Purple */);
                }
                else if (r === 0 && g === 0 && b === 0) {
                    light_2 = staticLight(x_2, y, "77" /* ColorPalette.White */);
                }
                else {
                    light_2 = rgbLight(x_2, y, r, g, b);
                }
                if (this.previousLights[lightIndex] !== light_2) {
                    lights += light_2;
                    this.previousLights[lightIndex] = light_2;
                    changedLights += 1;
                }
                lightIndex += 1;
            }
        }
        // Paint top
        {
            var y = GRID_HEIGHT;
            for (var x = 0; x < NUM_SCENES; x++) {
                var light_3 = staticLight(x, y, "4F" /* ColorPalette.Blue */);
                if (this.previousLights[lightIndex] !== light_3) {
                    lights += light_3;
                    this.previousLights[lightIndex] = light_3;
                    changedLights += 1;
                }
                lightIndex += 1;
            }
        }
        // Paint logo
        {
            var light_4 = pulsingLight(8, 8, "5F" /* ColorPalette.HotPink */);
            if (this.previousLights[lightIndex] !== light_4) {
                lights += light_4;
                this.previousLights[lightIndex] = light_4;
                changedLights += 1;
            }
            lightIndex += 1;
        }
        if (changedLights > 0) {
            var sysex = "F0 00 20 29 02 0C 03 ".concat(lights, " f7");
            sendSysex(sysex);
        }
    };
    return LaunchpadObject;
}());
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
var launchpad;
var init = function () {
    sendSysex("F0 00 20 29 02 0C 00 7F F7" /* Sysex.programmerMode */);
    var inputPort = host.getMidiInPort(0);
    inputPort.setMidiCallback(onMidi);
    inputPort.setSysexCallback(onSysex);
    launchpad = new LaunchpadObject();
    transportHandler = new TransportHandler(host);
    trackBankHandler = new TrackHandler(host, "LPX_TrackHandler", "LPX_TrackHandler_Cursor", NUM_TRACKS, NUM_SCENES, NUM_SENDS, true);
};
// Called when a short MIDI message is received on MIDI input port 0.
function onMidi(status, note, velocity) {
    launchpad.handleMidi(status, note, velocity);
}
// Called when a MIDI sysex message is received on MIDI input port 0.
function onSysex(data) {
    println("sysex: ".concat(data));
}
function flush() {
    launchpad.flush();
}
var exit = function () {
    sendSysex("F0 00 20 29 02 0C 00 00 F7" /* Sysex.sessionMode */);
};
/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////// SCRIPT INIT //////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
