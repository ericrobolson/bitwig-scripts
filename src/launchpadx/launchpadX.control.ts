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
for (var i = 0; i < 10; i++) {
  host.addDeviceNameBasedDiscoveryPair(
    [`MIDIIN${i} (LPX MIDI)`],
    [`MIDIOUT${i} (LPX MIDI)`]
  );
}
host.addDeviceNameBasedDiscoveryPair(["LPX MIDI"], ["LPX MIDI"]);
//TODO: need to add in more named discovery pairs.

const NUM_TRACKS = 8;
const NUM_SENDS = 8;
const NUM_SCENES = 8;

var buttons: ButtonGrid;
var transport: Transport;

const init = () => {
  sendSysex(Sysex.programmerMode);
  LaunchpadX.setLight();
  const inputPort = host.getMidiInPort(0);
  inputPort.setMidiCallback(onMidi);
  inputPort.setSysexCallback(onSysex);

  transport = host.createTransport();

  buttons = new ButtonGrid(9, 9);
  for (var x = 0; x < buttons.width; x++) {
    for (var y = 0; y < buttons.height; y++) {
      const callback = (
        x: number,
        y: number,
        event: ButtonEvent,
        velocity: number,
        prevVelocity: number
      ) => {
        if (x === 7 && y == 8 && prevVelocity === 0 && velocity !== 0) {
          println("Is record!");
          transport.togglePlay();
        }
        println(`Button event: ${x},${y} - ${event}: ${velocity}`);
      };

      buttons.setCallback(x, y, callback);
    }
  }
};

// Called when a short MIDI message is received on MIDI input port 0.
function onMidi(status: number, note: number, velocity: number) {
  // TODO: Implement your MIDI input handling code here.
  const x = (note % 10) - 1;
  const y = Math.floor(note / 10) - 1;

  println(`MIDI: ${status} - ${note} - ${velocity}. (${x},${y})`);

  println(`is note off: ${isNoteOff(status, velocity)}`);
  println(`channel: ${MIDIChannel(status)}`);

  buttons.handleNote(x, y, velocity);
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
