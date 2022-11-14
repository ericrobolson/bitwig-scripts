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
// src/out/core/core_handlerApplication.js
//
var ApplicationHandler = /** @class */ (function () {
    function ApplicationHandler(host) {
        var _this = this;
        this.panelLayout = "ARRANGE" /* PanelLayout.arrange */;
        this.application = host.createApplication();
        var observer = this.application.panelLayout();
        observer.markInterested();
        observer.addValueObserver(function (layout) {
            _this.panelLayout = layout;
        });
    }
    ApplicationHandler.prototype.layout = function () {
        return this.panelLayout;
    };
    return ApplicationHandler;
}());
//
// src/out/core/core_handlerTrack.js
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
        this.trackQueuedForStop = new Array(numTracks);
        this.bank = host.createMainTrackBank(numTracks, numSends, numScenes);
        this.cursor = host.createCursorTrack(id, name, 0, 0, true);
        var bankSize = this.bank.getSizeOfBank();
        var track, element;
        var _loop_1 = function () {
            var idx = bankIndex;
            track = this_1.bank.getItemAt(idx);
            this_1.trackQueuedForStop[idx] = false;
            track.isQueuedForStop().markInterested();
            track.isQueuedForStop().addValueObserver(function (isQueuedForStop) {
                _this.trackQueuedForStop[idx] = isQueuedForStop;
            });
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
        for (var bankIndex = 0; bankIndex < bankSize; bankIndex++) {
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
// src/out/core/core_handlerTransport.js
//
var TransportHandler = /** @class */ (function () {
    function TransportHandler(host) {
        this.transport = host.createTransport();
    }
    return TransportHandler;
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
// src/out/consts.js
//
var ButtonState;
(function (ButtonState) {
    ButtonState[ButtonState["ToggledOn"] = 0] = "ToggledOn";
    ButtonState[ButtonState["ToggledOff"] = 1] = "ToggledOff";
    ButtonState[ButtonState["On"] = 2] = "On";
    ButtonState[ButtonState["Off"] = 3] = "Off";
})(ButtonState || (ButtonState = {}));
var NUM_TRACKS = 8;
var NUM_SENDS = 8;
var NUM_SCENES = 8;
var GRID_WIDTH = 8;
var GRID_HEIGHT = 8;
var NUM_NOTES = 128;
var BACKGROUND_LIGHT_STRENGTH = 0.1;
//
// src/out/controlButtons.js
//
/**
 * State representing a Launchpad's Control Buttons.
 */
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
        this.recordArm = false;
    }
    ControlButtons.prototype.isUp = function (x, y) {
        return x == 0 && y == GRID_HEIGHT;
    };
    ControlButtons.prototype.isDown = function (x, y) {
        return x == 1 && y == GRID_HEIGHT;
    };
    ControlButtons.prototype.isLeft = function (x, y) {
        return x == 2 && y == GRID_HEIGHT;
    };
    ControlButtons.prototype.isRight = function (x, y) {
        return x == 3 && y == GRID_HEIGHT;
    };
    ControlButtons.prototype.isSession = function (x, y) {
        return x == 4 && y == GRID_HEIGHT;
    };
    ControlButtons.prototype.isNote = function (x, y) {
        return x == 5 && y == GRID_HEIGHT;
    };
    ControlButtons.prototype.isCustom = function (x, y) {
        return x == 6 && y == GRID_HEIGHT;
    };
    ControlButtons.prototype.isCaptureMidi = function (x, y) {
        return x == 7 && y == GRID_HEIGHT;
    };
    ControlButtons.prototype.isVolume = function (x, y) {
        return x == GRID_WIDTH && y == 7;
    };
    ControlButtons.prototype.isPan = function (x, y) {
        return x == GRID_WIDTH && y == 6;
    };
    ControlButtons.prototype.isSendA = function (x, y) {
        return x == GRID_WIDTH && y == 5;
    };
    ControlButtons.prototype.isSendB = function (x, y) {
        return x == GRID_WIDTH && y == 4;
    };
    ControlButtons.prototype.isStopClip = function (x, y) {
        return x == GRID_WIDTH && y == 3;
    };
    ControlButtons.prototype.isMute = function (x, y) {
        return x == GRID_WIDTH && y == 2;
    };
    ControlButtons.prototype.isSolo = function (x, y) {
        return x == GRID_WIDTH && y == 1;
    };
    ControlButtons.prototype.isRecordArm = function (x, y) {
        return x == GRID_WIDTH && y == 0;
    };
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
// src/out/light.js
//
var setClipLight = function (x, y, clip, renderer) {
    if (clip.isRecordingQueued) {
        renderer.pulsingLight(x, y, "04" /* ColorPalette.RedLighter */);
    }
    else if (clip.isPlaybackQueued) {
        renderer.pulsingLight(x, y, "14" /* ColorPalette.GreenLighter */);
    }
    else if (clip.isStopQueued) {
        renderer.pulsingLight(x, y, "47" /* ColorPalette.Dirt */);
    }
    else if (clip.isRecording) {
        renderer.flashingLight(x, y, "07" /* ColorPalette.RedDarker */, "48" /* ColorPalette.Red */);
    }
    else if (clip.isPlaying) {
        renderer.flashingLight(x, y, "7B" /* ColorPalette.GreenDarker */, "57" /* ColorPalette.Green */);
    }
    else {
        var _a = clip.color, clipR = _a[0], clipG = _a[1], clipB = _a[2];
        renderer.rgbLight(x, y, clipR, clipG, clipB);
    }
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
// src/out/renderer.js
//
var LaunchpadRenderer = /** @class */ (function () {
    function LaunchpadRenderer(width, height) {
        this.queuedLights = "";
        this.isDirty = false;
        var capacity = width * height;
        this.width = width;
        this.height = height;
        this.previousLights = new Array(capacity);
    }
    LaunchpadRenderer.prototype.pulsingLight = function (x, y, color) {
        this.setLight(x, y, pulsingLight(x, y, color));
    };
    LaunchpadRenderer.prototype.staticLight = function (x, y, color) {
        this.setLight(x, y, staticLight(x, y, color));
    };
    LaunchpadRenderer.prototype.flashingLight = function (x, y, a, b) {
        this.setLight(x, y, flashingLight(x, y, a, b));
    };
    LaunchpadRenderer.prototype.rgbLight = function (x, y, rUint8, gUint8, bUint8) {
        this.setLight(x, y, rgbLight(x, y, rUint8, gUint8, bUint8));
    };
    /**
     * Attempts to set the given light. If a given light already has that value, will skip sending that message.
     * @param x
     * @param y
     * @param sysexMsg
     */
    LaunchpadRenderer.prototype.setLight = function (x, y, sysexMsg) {
        var index = index2dTo1d(x, y, this.width, this.height);
        if (this.previousLights[index] !== sysexMsg) {
            this.previousLights[index] = sysexMsg;
            this.queuedLights += sysexMsg;
            this.isDirty = true;
        }
    };
    /**
     * Renders the given lights.
     */
    LaunchpadRenderer.prototype.present = function () {
        if (this.isDirty) {
            var sysex = "F0 00 20 29 02 0C 03 ".concat(this.queuedLights, " f7");
            sendSysex(sysex);
            this.clearQueue();
        }
    };
    /**
     * Resets the light queue.
     */
    LaunchpadRenderer.prototype.clearQueue = function () {
        this.isDirty = false;
        this.queuedLights = "";
    };
    return LaunchpadRenderer;
}());
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
// src/out/core/core_handlerApplication.js
//
var ApplicationHandler = /** @class */ (function () {
    function ApplicationHandler(host) {
        var _this = this;
        this.panelLayout = "ARRANGE" /* PanelLayout.arrange */;
        this.application = host.createApplication();
        var observer = this.application.panelLayout();
        observer.markInterested();
        observer.addValueObserver(function (layout) {
            _this.panelLayout = layout;
        });
    }
    ApplicationHandler.prototype.layout = function () {
        return this.panelLayout;
    };
    return ApplicationHandler;
}());
//
// src/out/core/core_handlerTrack.js
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
        this.trackQueuedForStop = new Array(numTracks);
        this.bank = host.createMainTrackBank(numTracks, numSends, numScenes);
        this.cursor = host.createCursorTrack(id, name, 0, 0, true);
        var bankSize = this.bank.getSizeOfBank();
        var track, element;
        var _loop_1 = function () {
            var idx = bankIndex;
            track = this_1.bank.getItemAt(idx);
            this_1.trackQueuedForStop[idx] = false;
            track.isQueuedForStop().markInterested();
            track.isQueuedForStop().addValueObserver(function (isQueuedForStop) {
                _this.trackQueuedForStop[idx] = isQueuedForStop;
            });
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
        for (var bankIndex = 0; bankIndex < bankSize; bankIndex++) {
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
// src/out/core/core_handlerTransport.js
//
var TransportHandler = /** @class */ (function () {
    function TransportHandler(host) {
        this.transport = host.createTransport();
    }
    return TransportHandler;
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
// src/out/launchpad/context.js
//
/**
 * Default, system wide transitions.
 * @param lp
 * @param context
 * @returns
 */
var contextDefaultTransition = function (lp, context) {
    var controlButtons = lp.controlButtons();
    // Non navigation control buttons
    {
        if (controlButtons.volume) {
            return ContextVolume;
        }
        else if (controlButtons.recordArm) {
            return ContextRecordArm;
        }
        else if (controlButtons.pan) {
            return ContextPanControl;
        }
    }
    // Navigation
    {
        if (controlButtons.up) {
            trackBankHandler.bank.scrollBackwards();
        }
        else if (controlButtons.down) {
            trackBankHandler.bank.scrollForwards();
        }
        if (controlButtons.left) {
            trackBankHandler.bank.sceneBank().scrollBackwards();
        }
        else if (controlButtons.right) {
            trackBankHandler.bank.sceneBank().scrollForwards();
        }
    }
    return context;
};
//
// src/out/launchpad/contextArrange.js
//
var ContextArrange = {
    title: function () {
        return "ContextArrange";
    },
    shouldReplaceHistory: function () {
        return true;
    },
    transition: function (lp, note, velocity, prevVelocity, state, x, y, isGridButton) {
        var controlButtons = lp.controlButtons();
        if (state == ButtonState.ToggledOn && isGridButton) {
            var track = trackBankHandler.bank.getItemAt(7 - y);
            var clipLauncher = track.clipLauncherSlotBank();
            // Select things
            // track.select();
            // clipLauncher.select(x);
            if (controlButtons.record) {
                clipLauncher.record(x);
            }
            else if (controlButtons.stopClip) {
                clipLauncher.stop();
            }
            else if (controlButtons.custom) {
                // delete clip
                clipLauncher.getItemAt(x).deleteObject();
            }
            else {
                clipLauncher.launch(x);
            }
            return this;
        }
        return null;
    },
    render: function (lp, renderer) {
        var controlButtons = lp.controlButtons();
        // Paint grid
        {
            for (var row = 0; row < NUM_SCENES; row++) {
                for (var col = 0; col < NUM_SCENES; col++) {
                    // Y needs to be inverted.
                    var y = 7 - col;
                    var x_1 = row;
                    var queuedForStop = trackBankHandler.trackQueuedForStop[col];
                    var clip = trackBankHandler.clips[col][row];
                    var _a = trackBankHandler.colors[col], trackR = _a[0], trackG = _a[1], trackB = _a[2];
                    if (queuedForStop) {
                        renderer.pulsingLight(x_1, y, "04" /* ColorPalette.RedLighter */);
                    }
                    else if (clip.hasContent) {
                        setClipLight(x_1, y, clip, renderer);
                    }
                    else {
                        renderer.rgbLight(x_1, y, trackR * BACKGROUND_LIGHT_STRENGTH, trackG * BACKGROUND_LIGHT_STRENGTH, trackB * BACKGROUND_LIGHT_STRENGTH);
                    }
                }
            }
        }
        // Paint side bar
        {
            var x_2 = GRID_WIDTH;
            for (var col = 0; col < NUM_SCENES; col++) {
                var y = col;
                var _b = trackBankHandler.colors[7 - y], r = _b[0], g = _b[1], b = _b[2];
                var isHeld = false;
                if (isHeld) {
                    renderer.staticLight(x_2, y, "50" /* ColorPalette.Purple */);
                }
                else if (r === 0 && g === 0 && b === 0) {
                    renderer.staticLight(x_2, y, "77" /* ColorPalette.White */);
                }
                else {
                    renderer.rgbLight(x_2, y, r, g, b);
                }
            }
        }
        // Paint top
        {
            var y = GRID_HEIGHT;
            for (var x = 0; x < NUM_SCENES; x++) {
                if (controlButtons.isUp(x, y)) {
                    renderer.staticLight(x, y, "50" /* ColorPalette.Purple */);
                }
                else if (controlButtons.isCaptureMidi(x, y)) {
                    renderer.staticLight(x, y, "07" /* ColorPalette.RedDarker */);
                }
                else {
                    renderer.staticLight(x, y, "4F" /* ColorPalette.Blue */);
                }
            }
        }
        // Paint logo
        {
            renderer.pulsingLight(8, 8, "5F" /* ColorPalette.HotPink */);
        }
    },
};
//
// src/out/launchpad/contextPanControl.js
//
var ContextPanControl = {
    title: function () {
        return "ContextPanControl";
    },
    shouldReplaceHistory: function () {
        return false;
    },
    transition: function (lp, note, velocity, prevVelocity, state, x, y, isGridButton) {
        var controlButtons = lp.controlButtons();
        var shouldReturnToPrevious = controlButtons.pan && !isGridButton && state == ButtonState.ToggledOn;
        if (shouldReturnToPrevious) {
            return lp.lastContext();
        }
        return contextDefaultTransition(lp, this);
    },
    render: function (lp, renderer) {
        // Paint grid
        {
            for (var row = 0; row < NUM_SCENES + 1; row++) {
                for (var col = 0; col < NUM_SCENES + 1; col++) {
                    renderer.staticLight(row, col, "25" /* ColorPalette.BlueLighter */);
                }
            }
        }
        // Paint logo
        {
            renderer.pulsingLight(8, 8, "27" /* ColorPalette.BlueDarker */);
        }
    },
};
//
// src/out/launchpad/contextRecordArm.js
//
var ContextRecordArm = {
    title: function () {
        return "ContextRecordArm";
    },
    shouldReplaceHistory: function () {
        return false;
    },
    transition: function (lp, note, velocity, prevVelocity, state, x, y, isGridButton) {
        var controlButtons = lp.controlButtons();
        var shouldReturnToPrevious = controlButtons.recordArm &&
            !isGridButton &&
            state == ButtonState.ToggledOn;
        if (shouldReturnToPrevious) {
            return lp.lastContext();
        }
        return contextDefaultTransition(lp, this);
    },
    render: function (lp, renderer) {
        // Paint grid
        {
            for (var row = 0; row < NUM_SCENES + 1; row++) {
                for (var col = 0; col < NUM_SCENES + 1; col++) {
                    renderer.staticLight(row, col, "07" /* ColorPalette.RedDarker */);
                }
            }
        }
        // Paint logo
        {
            renderer.pulsingLight(8, 8, "27" /* ColorPalette.BlueDarker */);
        }
    },
};
//
// src/out/launchpad/contextVolume.js
//
var ContextVolume = {
    title: function () {
        return "ContextVolume";
    },
    shouldReplaceHistory: function () {
        return false;
    },
    transition: function (lp, note, velocity, prevVelocity, state, x, y, isGridButton) {
        var controlButtons = lp.controlButtons();
        var shouldReturnToPrevious = controlButtons.volume && !isGridButton && state == ButtonState.ToggledOn;
        if (shouldReturnToPrevious) {
            return lp.lastContext();
        }
        return contextDefaultTransition(lp, this);
    },
    render: function (lp, renderer) {
        // Paint grid
        {
            for (var row = 0; row < NUM_SCENES + 1; row++) {
                for (var col = 0; col < NUM_SCENES + 1; col++) {
                    renderer.staticLight(row, col, "5F" /* ColorPalette.HotPink */);
                }
            }
        }
        // Paint logo
        {
            renderer.pulsingLight(8, 8, "27" /* ColorPalette.BlueDarker */);
        }
    },
};
//
// src/out/launchpad/launchpadx.js
//
/**
 * A class representing a Launchpad object.
 */
var LaunchpadObject = /** @class */ (function () {
    function LaunchpadObject() {
        var _this = this;
        /**
         * Attempts to set a control button's state.
         * @param x
         * @param y
         * @param isOn
         */
        this.maybeSetControlButtons = function (x, y, isOn) {
            // Set top row
            if (y == GRID_WIDTH && x >= 0 && x < GRID_WIDTH) {
                switch (x) {
                    case 0:
                        _this.controlButtonState.up = isOn;
                        break;
                    case 1:
                        _this.controlButtonState.down = isOn;
                        break;
                    case 2:
                        _this.controlButtonState.left = isOn;
                        break;
                    case 3:
                        _this.controlButtonState.right = isOn;
                        break;
                    case 4:
                        _this.controlButtonState.session = isOn;
                        break;
                    case 5:
                        _this.controlButtonState.note = isOn;
                        break;
                    case 6:
                        _this.controlButtonState.custom = isOn;
                        break;
                    case 7:
                        _this.controlButtonState.record = isOn;
                        break;
                }
            }
            // Set side buttons
            else if (x == GRID_WIDTH && y >= 0 && y < GRID_HEIGHT) {
                switch (y) {
                    case 0:
                        _this.controlButtonState.recordArm = isOn;
                        break;
                    case 1:
                        _this.controlButtonState.solo = isOn;
                        break;
                    case 2:
                        _this.controlButtonState.mute = isOn;
                        break;
                    case 3:
                        _this.controlButtonState.stopClip = isOn;
                        break;
                    case 4:
                        _this.controlButtonState.sendB = isOn;
                        break;
                    case 5:
                        _this.controlButtonState.sendA = isOn;
                        break;
                    case 6:
                        _this.controlButtonState.pan = isOn;
                        break;
                    case 7:
                        _this.controlButtonState.volume = isOn;
                        break;
                }
            }
        };
        this.contextPrevious = null;
        this.context = ContextArrange;
        this.renderer = new LaunchpadRenderer(GRID_WIDTH, GRID_HEIGHT);
        this.gridButtons = new GridButtons(GRID_WIDTH, GRID_HEIGHT);
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
        this.controlButtonState = new ControlButtons();
        this.gridButtons = new GridButtons(GRID_WIDTH, GRID_HEIGHT);
    }
    /**
     * Returns the panel layout for the DAW.
     */
    LaunchpadObject.prototype.layout = function () {
        return applicationHandler.layout();
    };
    /**
     * Returns the control button state.
     * @returns the control button state.
     */
    LaunchpadObject.prototype.controlButtons = function () {
        return this.controlButtonState;
    };
    /**
     * Returns the last context page.
     * @returns
     */
    LaunchpadObject.prototype.lastContext = function () {
        return this.contextPrevious ? this.contextPrevious : ContextArrange;
    };
    /**
     * Callback for handling midi notes.
     * @param _status
     * @param note
     * @param velocity
     */
    LaunchpadObject.prototype.handleMidi = function (_status, note, velocity) {
        var x = (note % 10) - 1;
        var y = Math.floor(note / 10) - 1;
        var prevVelocity = this.noteVelocities[note];
        this.prevVelocities[note] = prevVelocity;
        this.noteVelocities[note] = velocity;
        var toggledOn = prevVelocity === 0 && velocity !== 0;
        var toggledOff = prevVelocity > 0 && velocity === 0;
        var isOn = velocity > 0;
        var isGridButton = x < GRID_WIDTH && y < GRID_HEIGHT;
        if (isGridButton) {
            this.gridButtons.set(x, y, isOn);
        }
        else {
            this.maybeSetControlButtons(x, y, isOn);
        }
        var buttonState = ButtonState.Off;
        if (toggledOn) {
            buttonState = ButtonState.ToggledOn;
        }
        else if (toggledOff) {
            buttonState = ButtonState.ToggledOff;
        }
        else if (isOn) {
            buttonState = ButtonState.On;
        }
        var newContext = this.context.transition(this, note, velocity, prevVelocity, buttonState, x, y, isGridButton);
        if (newContext === null) {
            newContext = contextDefaultTransition(this, this.context);
        }
        if (this.context.shouldReplaceHistory()) {
            this.contextPrevious = this.context;
        }
        this.context = newContext;
    };
    /**
     * Flushes the Launchpad, performing any rendering updates.
     */
    LaunchpadObject.prototype.flush = function () {
        this.context.render(this, this.renderer);
        this.renderer.present();
    };
    return LaunchpadObject;
}());
//
// src/out/**/**/*.js
//

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
var applicationHandler;
var init = function () {
    sendSysex("F0 00 20 29 02 0C 00 7F F7" /* Sysex.programmerMode */);
    var inputPort = host.getMidiInPort(0);
    inputPort.setMidiCallback(onMidi);
    inputPort.setSysexCallback(onSysex);
    launchpad = new LaunchpadObject();
    applicationHandler = new ApplicationHandler(host);
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
