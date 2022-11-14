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

  isUp(x: number, y: number): boolean {
    return x == 0 && y == GRID_HEIGHT;
  }
  isDown(x: number, y: number): boolean {
    return x == 1 && y == GRID_HEIGHT;
  }
  isLeft(x: number, y: number): boolean {
    return x == 2 && y == GRID_HEIGHT;
  }
  isRight(x: number, y: number): boolean {
    return x == 3 && y == GRID_HEIGHT;
  }
  isSession(x: number, y: number): boolean {
    return x == 4 && y == GRID_HEIGHT;
  }
  isNote(x: number, y: number): boolean {
    return x == 5 && y == GRID_HEIGHT;
  }
  isCustom(x: number, y: number): boolean {
    return x == 6 && y == GRID_HEIGHT;
  }
  isCaptureMidi(x: number, y: number): boolean {
    return x == 7 && y == GRID_HEIGHT;
  }
  isVolume(x: number, y: number): boolean {
    return x == GRID_WIDTH && y == 7;
  }
  isPan(x: number, y: number): boolean {
    return x == GRID_WIDTH && y == 6;
  }
  isSendA(x: number, y: number): boolean {
    return x == GRID_WIDTH && y == 5;
  }
  isSendB(x: number, y: number): boolean {
    return x == GRID_WIDTH && y == 4;
  }
  isStopClip(x: number, y: number): boolean {
    return x == GRID_WIDTH && y == 3;
  }
  isMute(x: number, y: number): boolean {
    return x == GRID_WIDTH && y == 2;
  }
  isSolo(x: number, y: number): boolean {
    return x == GRID_WIDTH && y == 1;
  }
  isRecordArm(x: number, y: number): boolean {
    return x == GRID_WIDTH && y == 0;
  }
}
