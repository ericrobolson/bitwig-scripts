/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////// SCRIPT INIT //////////////////////////////////////////
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

var transportHandler: TransportHandler;
var trackBankHandler: TrackHandler;
var launchpad: LaunchpadObject;

const init = () => {
  sendSysex(Sysex.programmerMode);

  const inputPort = host.getMidiInPort(0);
  inputPort.setMidiCallback(onMidi);
  inputPort.setSysexCallback(onSysex);

  launchpad = new LaunchpadObject();

  transportHandler = new TransportHandler(host);
  trackBankHandler = new TrackHandler(
    host,
    "LPX_TrackHandler",
    "LPX_TrackHandler_Cursor",
    NUM_TRACKS,
    NUM_SCENES,
    NUM_SENDS,
    true
  );
};

// Called when a short MIDI message is received on MIDI input port 0.
function onMidi(status: number, note: number, velocity: number) {
  launchpad.handleMidi(status, note, velocity);
}

// Called when a MIDI sysex message is received on MIDI input port 0.
function onSysex(data: string) {
  println(`sysex: ${data}`);
}

function flush() {
  launchpad.flush();
}

const exit = () => {
  sendSysex(Sysex.sessionMode);
};
/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////// SCRIPT INIT //////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
