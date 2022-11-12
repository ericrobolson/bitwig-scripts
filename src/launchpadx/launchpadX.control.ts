enum Sysex {
  programmerMode = "F0 00 20 29 02 0C 00 7F F7",
  sessionMode = "F0 00 20 29 02 0C 00 00 F7",
  lightsTestSequence = "F0 00 20 29 02 0C 03 00 0B 0D 01 0C 15 17 02 0D 25 F7",
}

const LaunchpadX = {
  setLight: () => {
    sendSysex(Sysex.lightsTestSequence);
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
  "Generic",
  "Launchpad X-Treme - Eric Olson",
  "0.2",
  "FC7C731D-C6D9-4627-875C-D0AA397BA73A"
);
host.defineMidiPorts(1, 1);
host.addDeviceNameBasedDiscoveryPair(["Launchpad X"], ["Launchpad X"]);

const NUM_TRACKS = 8;
const NUM_SENDS = 8;
const NUM_SCENES = 8;

var buttons: ButtonGrid = new ButtonGrid(9, 9);
for (var x = 0; x < buttons.width; x++) {
  for (var y = 0; y < buttons.height; y++) {
    buttons.setCallback(x, y, (x, y, event, velocity) => {
      println(`Button event: ${x},${y} - ${event}`);
    });

    buttons.setMidiGridMap((note) => {
      const x = (note - 1) % 10;
      const y = (note - 1) / 10;
      println(`Note: ${note}. ${x},${y}`);

      return [x, y];
    });
  }
}

const init = () => {
  // Do not perform allocations in here.
  sendSysex(Sysex.programmerMode);
  LaunchpadX.setLight();

  host.getMidiInPort(0).setMidiCallback(onMidi);
  host.getMidiInPort(0).setSysexCallback(onSysex);
};

// Called when a short MIDI message is received on MIDI input port 0.
function onMidi(status: number, note: number, velocity: number) {
  // TODO: Implement your MIDI input handling code here.
  const x = (note % 10) - 1;
  const y = Math.floor(note / 10) - 1;

  println(`MIDI: ${status} - ${note} - ${velocity}. (${x},${y})`);
}

// Called when a MIDI sysex message is received on MIDI input port 0.
function onSysex(data: string) {
  println(`sysex: ${data}`);
}

function flush() {
  // TODO: Flush any output to your controller here.
  println(`FLUSH`);
}

const exit = () => {
  sendSysex(Sysex.sessionMode);
};
/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////// BOILERPLATE //////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
