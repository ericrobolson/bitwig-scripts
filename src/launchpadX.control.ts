const SYSEX = {
  programmerMode: "F0 00 20 29 02 0C 00 7F F7",
  sessionMode: "F0 00 20 29 02 0C 00 00 F7",
};

const LaunchpadX = {
  setLight: () => {
    println("Hi world!");
    sendSysex("F0 00 20 29 02 0C 03 00 0B 0D 01 0C 15 17 02 0D 25 F7");
  },
};

const enum PanelLayout {
  edit = "EDIT",
  arrange = "ARRANGE",
  mix = "MIX",
}

/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////// BOILERPLATE //////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

loadAPI(17);
host.setShouldFailOnDeprecatedUse(true);

host.defineController(
  "Novation",
  "Launchpad X-treme - Eric Olson",
  "0.1",
  "FC7C731D-C6D9-4627-875C-D0AA527BA73A"
);
host.defineMidiPorts(1, 1);
host.addDeviceNameBasedDiscoveryPair(["Launchpad X"], ["Launchpad X"]);

const NUM_TRACKS = 8;
const NUM_SENDS = 8;
const NUM_SCENES = 8;

const ext = {
  transport: null,
};

const init = () => {
  sendSysex(SYSEX.programmerMode);
  LaunchpadX.setLight();
  ext.transport = host.createTransport();

  host.getMidiInPort(0).setMidiCallback(onMidi0);
  host.getMidiInPort(0).setSysexCallback(onSysex0);
};

// Called when a short MIDI message is received on MIDI input port 0.
function onMidi0(status, note, velocity) {
  // TODO: Implement your MIDI input handling code here.
  println(`MIDI: ${status} - ${note} - ${velocity}`);
  if (note === 19) {
    println("Hit a side button!");
  }
}

// Called when a MIDI sysex message is received on MIDI input port 0.
function onSysex0(data) {
  println(`sysex: ${data}`);

  // MMC Transport Controls:
  switch (data) {
    case "f07f7f0605f7":
      ext.transport.rewind();
      break;
    case "f07f7f0604f7":
      ext.transport.fastForward();
      break;
    case "f07f7f0601f7":
      ext.transport.stop();
      break;
    case "f07f7f0602f7":
      ext.transport.play();
      break;
    case "f07f7f0606f7":
      ext.transport.record();
      break;
  }
}

function flush() {
  // TODO: Flush any output to your controller here.
  println("FLUSH");
}

const exit = () => {
  sendSysex(SYSEX.sessionMode);
};
/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////// BOILERPLATE //////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
