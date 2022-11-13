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
declare const uint8ToHex: (num: number) => string;
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
const createNoteIn = (name: string, input: MidiInPort): NoteInput => {
  return input.createNoteInput(
    name,
    // midi messages

    "80????", // note off
    "90????", // note on
    "B0????", // cc commands
    "D0????", // aftertouch
    "E0????" // pitchbend
  );
};

interface NoteInput {}

/**
 * file:///C:/Program%20Files/Bitwig%20Studio/4.4/resources/doc/control-surface/api/a01249.html#aa872f1370063a74bf6ccc8872216b46c
 */
interface ClipLauncherSlotBank {
  addHasContentObserver(
    callback: (slotIndex: number, hasContent: boolean) => void
  ): void;

  addColorObserver(
    callback: (slotIndex: number, r: number, g: number, b: number) => void
  ): void;

  addIsPlaybackQueuedObserver(
    callback: (slotIndex: number, isQueued: boolean) => void
  ): void;
  addIsPlayingObserver(
    callback: (slotIndex: number, isPlaying: boolean) => void
  ): void;

  addIsStopQueuedObserver(
    callback: (slotIndex: number, isStopQueued: boolean) => void
  ): void;

  addIsRecordingObserver(
    callback: (slotIndex: number, isRecording: boolean) => void
  ): void;
  addIsRecordingQueuedObserver(
    callback: (slotIndex: number, isQueued: boolean) => void
  ): void;

  select(slot: number): void;
  record(slot: number): void;
  showInEditor(slot: number): void;
  createEmptyClip(slot: number, lengthInBeats: number): void;
  deleteClip(slot: number): void;
  duplicateClip(slot: number): void;
  launch(slot: number): void;
  stop(): void;
}

interface Com {}
interface CursorTrack {
  solo(): Subscribable<boolean> & Toggleable;
  mute(): Subscribable<boolean> & Toggleable;
}

interface Host {
  addDeviceNameBasedDiscoveryPair(a: Array<string>, b: Array<string>): void;

  createCursorTrack(
    id: string,
    name: string,
    numSends: number,
    numScenes: number,
    shouldFollowSelection: boolean
  ): CursorTrack;
  createMainTrackBank(
    numTracks: number,
    numSends: number,
    numScenes: number
  ): TrackBank;
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
  showPopupNotification(msg: string): void;
}

interface MidiInPort {
  setMidiCallback(
    callback: (status: number, note: number, velocity: number) => void
  ): void;
  setSysexCallback(callback: (data: string) => void): void;
  createNoteInput: Function;
}
interface TrackBank {
  scrollForwards(): void;
  scrollBackwards(): void;

  scrollPageBackwards(): void;
  scrollPageForwards(): void;

  scrollScenesUp(): void;
  scrollScenesDown(): void;

  scrollTracksUp(): void;
  scrollTrackDown(): void;

  scrollToTrack(trackIdx: number): void;

  getSizeOfBank(): number;
  getItemAt(idx: number): Track;
  followCursorTrack(track: CursorTrack): void;
}
interface SettableBool {
  set(value: boolean): void;
  toggle(): void;
}

interface Track {
  arm(): SettableBool;
  stop(): void;

  select(): void;
  pan(): Subscribable<number>;
  volume(): Subscribable<number>;
  color(): {
    addValueObserver: (
      callback: (r: number, g: number, b: number) => void
    ) => void;
  };
  clipLauncherSlotBank(): ClipLauncherSlotBank;
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
  isPlaying: () => Subscribable<boolean>;
  isArrangerRecordEnabled: () => Subscribable<boolean>;
  addIsPlayingObserver: (callback: (active: boolean) => void) => void;
  addIsRecordingObserver: (callback: (active: boolean) => void) => void;
  addOverdubObserver: (callback: (active: boolean) => void) => void;
}

interface Subscribable<T> {
  markInterested: () => void;
  setIndication: (indication: boolean) => void;
  addValueObserver: (callback: (value: T) => void) => void;
}
interface Toggleable {
  toggle: () => void;
}

declare const com: Com;
declare const host: Host;
declare const loadAPI: Function;
