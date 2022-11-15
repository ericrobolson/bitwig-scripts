/**
 * State representing a Launchpad's Control Buttons.
 */
class ControlButtons {
  up: boolean = false;
  down: boolean = false;
  left: boolean = false;
  right: boolean = false;
  session: boolean = false;
  note: boolean = false;
  custom: boolean = false;
  record: boolean = false;
  volume: boolean = false;
  pan: boolean = false;
  sendA: boolean = false;
  sendB: boolean = false;
  stopClip: boolean = false;
  mute: boolean = false;
  solo: boolean = false;
  recordArm: boolean = false;

  static isUp(x: number, y: number): boolean {
    return x == 0 && y == GRID_HEIGHT;
  }
  static isDown(x: number, y: number): boolean {
    return x == 1 && y == GRID_HEIGHT;
  }
  static isLeft(x: number, y: number): boolean {
    return x == 2 && y == GRID_HEIGHT;
  }
  static isRight(x: number, y: number): boolean {
    return x == 3 && y == GRID_HEIGHT;
  }
  static isSession(x: number, y: number): boolean {
    return x == 4 && y == GRID_HEIGHT;
  }
  static isNote(x: number, y: number): boolean {
    return x == 5 && y == GRID_HEIGHT;
  }
  static isCustom(x: number, y: number): boolean {
    return x == 6 && y == GRID_HEIGHT;
  }
  static isCaptureMidi(x: number, y: number): boolean {
    return x == 7 && y == GRID_HEIGHT;
  }
  static isVolume(x: number, y: number): boolean {
    return x == GRID_WIDTH && y == 7;
  }
  static isPan(x: number, y: number): boolean {
    return x == GRID_WIDTH && y == 6;
  }
  static isSendA(x: number, y: number): boolean {
    return x == GRID_WIDTH && y == 5;
  }
  static isSendB(x: number, y: number): boolean {
    return x == GRID_WIDTH && y == 4;
  }
  static isStopClip(x: number, y: number): boolean {
    return x == GRID_WIDTH && y == 3;
  }
  static isMute(x: number, y: number): boolean {
    return x == GRID_WIDTH && y == 2;
  }
  static isSolo(x: number, y: number): boolean {
    return x == GRID_WIDTH && y == 1;
  }
  static isRecordArm(x: number, y: number): boolean {
    return x == GRID_WIDTH && y == 0;
  }
}
