enum Sysex {
  programmerMode = "F0 00 20 29 02 0C 00 7F F7",
  sessionMode = "F0 00 20 29 02 0C 00 00 F7",
  lightsTestSequence = "F0 00 20 29 02 0C 03 00 0B 0D 01 0C 15 17 02 0D 25 F7",
}

const Mpd218 = {};

/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////// BOILERPLATE //////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

loadAPI(17);
host.setShouldFailOnDeprecatedUse(true);

host.defineController(
  "Generic",
  "MPD218 is great - Eric Olson",
  "0.2",
  "FC7C731D-C6D9-4627-875C-D0AA527BA73A"
);
host.defineMidiPorts(1, 1);
host.addDeviceNameBasedDiscoveryPair(["Launchpad X"], ["Launchpad X"]);

const NUM_TRACKS = 8;
const NUM_SENDS = 8;
const NUM_SCENES = 8;

var ext: Ext;

class Ext {
  transport: Transport;

  constructor(host: Host) {
    this.transport = host.createTransport();
  }
}

const init = () => {
  sendSysex(Sysex.programmerMode);
  ext = new Ext(host);

  host.getMidiInPort(0).setMidiCallback(onMidi);
  host.getMidiInPort(0).setSysexCallback(onSysex);
};

// Called when a short MIDI message is received on MIDI input port 0.
function onMidi(status: number, note: number, velocity: number) {
  // TODO: Implement your MIDI input handling code here.
  println(`MIDI: ${status} - ${note} - ${velocity}`);
  if (note === 19) {
    println("Hit a side button!");
  }
}

// Called when a MIDI sysex message is received on MIDI input port 0.
function onSysex(data: string) {
  println(`sysex: ${data}`);
}

function flush() {
  // TODO: Flush any output to your controller here.
  println("FLUSH");
}

const exit = () => {
  sendSysex(Sysex.sessionMode);
};
/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////// BOILERPLATE //////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
