declare const isActiveSensing: (status: number) => boolean;
declare const isChannelController: (status: number) => boolean;
declare const isChannelPressure: (status: number) => boolean;
declare const isKeyPressure: (status: number) => boolean;
const isMaxVelocity = (velocity: number): boolean => {
  return velocity === 127;
};
const isMinVelocity = (velocity: number): boolean => {
  return velocity === 0;
};
declare const isMIDIContinue: (status: number) => boolean;
declare const isMIDIStart: (status: number) => boolean;
declare const isMIDIStop: (status: number) => boolean;
declare const isMTCQuarterFrame: (status: number) => boolean;
declare const isNoteOff: (status: number, data2: number) => boolean;
declare const isNoteOn: (status: number) => boolean;
declare const isPitchBend: (status: number) => boolean;
declare const isProgramChange: (status: number) => boolean;
declare const isSongPositionPointer: (status: number) => boolean;
declare const isSongSelect: (status: number) => boolean;
declare const isSystemReset: (status: number) => boolean;
declare const isTimingClock: (status: number) => boolean;
declare const isTuneRequest: (status: number) => boolean;
declare const MIDIChannel: (status: number) => number;
declare const pitchBendValue: (data1: number, data2: number) => number;
declare const println: (s: string) => void;
declare const sendChannelController: (
  channel: number,
  controller: number,
  value: number
) => void;
declare const sendChannelPressure: (channel: number, pressure: number) => void;
declare const sendKeyPressure: (
  channel: number,
  key: number,
  pressure: number
) => void;
declare const sendMidi: (status: number, data1: number, data2: number) => void;
declare const sendNoteOff: (
  channel: number,
  key: number,
  velocity: number
) => void;
declare const sendNoteOn: (
  channel: number,
  key: number,
  velocity: number
) => void;
declare const sendPitchBend: (channel: number, value: number) => void;
declare const sendProgramChange: (channel: number, program: number) => void;
declare const sendSysex: (data: string) => void;

interface Com {}

interface Host {
  addDeviceNameBasedDiscoveryPair(a: Array<string>, b: Array<string>): void;

  createTransport(): Transport;

  defineController(
    instrument: String,
    title: String,
    version: String,
    uuid: String
  ): void;
  defineMidiPorts(inputs: number, outputs: number): void;

  getMidiInPort(port: number): MidiInPort;

  platformIsLinux(): boolean;
  platformIsMac(): boolean;
  platformIsWindows(): boolean;

  setShouldFailOnDeprecatedUse(shouldFail: boolean): void;
}

interface MidiInPort {
  setMidiCallback(
    callback: (status: number, note: number, velocity: number) => void
  ): void;
  setSysexCallback(callback: (data: string) => void): void;
}

interface Transport {
  play: () => void;
  stop: () => void;
  record: () => void;
  fastForward: () => void;
  rewind: () => void;
  tapTempo: () => void;
  togglePlay: () => void;
  restart: () => void;
  isPlaying: () => boolean;
  addIsPlayingObserver: (callback: (active: boolean) => void) => void;
  addIsRecordingObserver: (callback: (active: boolean) => void) => void;
  addOverdubObserver: (callback: (active: boolean) => void) => void;
}

declare const com: Com;
declare const host: Host;
declare const loadAPI: Function;
