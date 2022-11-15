/**
 * A class representing a Launchpad object.
 */
class LaunchpadObject {
  private noteVelocities: Array<number>;
  private prevVelocities: Array<number>;
  private previousLights: Array<string>;
  private controlButtonState: ControlButtons;
  private gridButtons: GridButtons;
  private context: Context;
  private contextPrevious: Context | null;
  private renderer: Renderer & RenderQueue;

  constructor() {
    this.contextPrevious = null;
    this.context = ContextArrange;
    this.renderer = new LaunchpadRenderer(GRID_WIDTH, GRID_HEIGHT);
    this.gridButtons = new GridButtons(GRID_WIDTH, GRID_HEIGHT);

    this.prevVelocities = new Array(NUM_NOTES);
    this.noteVelocities = new Array(NUM_NOTES);
    for (var i = 0; i < NUM_NOTES; i++) {
      this.prevVelocities[i] = 0;
      this.noteVelocities[i] = 0;
    }

    const previousLightsSize = GRID_WIDTH * GRID_HEIGHT;
    this.previousLights = new Array(previousLightsSize);
    for (var i = 0; i < previousLightsSize; i++) {
      this.previousLights[i] = "";
    }

    this.controlButtonState = new ControlButtons();
    this.gridButtons = new GridButtons(GRID_WIDTH, GRID_HEIGHT);
  }

  /**
   * Returns the panel layout for the DAW.
   */
  layout(): PanelLayout {
    return applicationHandler.layout();
  }

  /**
   * Returns the control button state.
   * @returns the control button state.
   */
  controlButtons(): ControlButtons {
    return this.controlButtonState;
  }

  /**
   * Returns the last context page.
   * @returns
   */
  lastContext(): Context {
    return this.contextPrevious ? this.contextPrevious : ContextArrange;
  }

  /**
   * Callback for handling midi notes.
   * @param _status
   * @param note
   * @param velocity
   */
  handleMidi(_status: number, note: number, velocity: number) {
    const x = (note % 10) - 1;
    const y = Math.floor(note / 10) - 1;

    const prevVelocity = this.noteVelocities[note];
    this.prevVelocities[note] = prevVelocity;
    this.noteVelocities[note] = velocity;

    const toggledOn = prevVelocity === 0 && velocity !== 0;
    const toggledOff = prevVelocity > 0 && velocity === 0;

    const isOn = velocity > 0;
    const isGridButton = x < GRID_WIDTH && y < GRID_HEIGHT;

    if (isGridButton) {
      this.gridButtons.set(x, y, isOn);
    } else {
      this.maybeSetControlButtons(x, y, isOn);
    }

    var buttonState = ButtonState.Off;
    if (toggledOn) {
      buttonState = ButtonState.ToggledOn;
    } else if (toggledOff) {
      buttonState = ButtonState.ToggledOff;
    } else if (isOn) {
      buttonState = ButtonState.On;
    }

    var newContext = this.context.transition(
      this,
      note,
      velocity,
      prevVelocity,
      buttonState,
      x,
      y,
      isGridButton
    );

    if (newContext === null) {
      newContext = contextDefaultTransition(this, this.context);
    }

    if (this.context.shouldReplaceHistory()) {
      this.contextPrevious = this.context;
    }

    this.context = newContext;
  }

  /**
   * Flushes the Launchpad, performing any rendering updates.
   */
  flush() {
    paintColoredContext(this.context, this.renderer);
    this.renderer.present();
  }

  /**
   * Attempts to set a control button's state.
   * @param x
   * @param y
   * @param isOn
   */
  private maybeSetControlButtons = (x: number, y: number, isOn: boolean) => {
    // Set top row
    if (y == GRID_WIDTH && x >= 0 && x < GRID_WIDTH) {
      switch (x) {
        case 0:
          this.controlButtonState.up = isOn;
          break;
        case 1:
          this.controlButtonState.down = isOn;
          break;
        case 2:
          this.controlButtonState.left = isOn;
          break;
        case 3:
          this.controlButtonState.right = isOn;
          break;
        case 4:
          this.controlButtonState.session = isOn;
          break;
        case 5:
          this.controlButtonState.note = isOn;
          break;
        case 6:
          this.controlButtonState.custom = isOn;
          break;
        case 7:
          this.controlButtonState.record = isOn;
          break;
      }
    }
    // Set side buttons
    else if (x == GRID_WIDTH && y >= 0 && y < GRID_HEIGHT) {
      switch (y) {
        case 0:
          this.controlButtonState.recordArm = isOn;
          break;
        case 1:
          this.controlButtonState.solo = isOn;
          break;
        case 2:
          this.controlButtonState.mute = isOn;
          break;
        case 3:
          this.controlButtonState.stopClip = isOn;
          break;
        case 4:
          this.controlButtonState.sendB = isOn;
          break;
        case 5:
          this.controlButtonState.sendA = isOn;
          break;
        case 6:
          this.controlButtonState.pan = isOn;
          break;
        case 7:
          this.controlButtonState.volume = isOn;
          break;
      }
    }
  };
}
