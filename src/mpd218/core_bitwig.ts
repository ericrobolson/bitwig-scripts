declare const host: Host;
declare const loadAPI: Function;
declare const println: (s: string) => void;
declare const sendMidi: Function;
declare const sendSysex: Function;
declare const com: any;

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

interface Transport {}
