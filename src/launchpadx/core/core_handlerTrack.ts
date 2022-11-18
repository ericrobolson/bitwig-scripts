class Clip {
  hasContent: boolean = false;
  color: [number, number, number] = [0, 0, 0];
  index: number = -1;

  isStopQueued: boolean = false;

  isPlaying: boolean = false;
  isPlaybackQueued: boolean = false;

  isRecording: boolean = false;
  isRecordingQueued: boolean = false;
}

class TrackHandler {
  public readonly bank: TrackBank;
  public readonly trackIsArmed: Array<boolean>;
  public readonly trackQueuedForStop: Array<boolean>;
  public readonly trackIsSoloed: Array<boolean>;
  private readonly trackVolumeNormalized: Array<number>;
  private readonly trackPanNormalized: Array<number>;
  public readonly trackIsMuted: Array<boolean>;
  public readonly cursor: CursorTrack;
  public readonly colors: Array<[number, number, number]>;
  public readonly clips: Array<Array<Clip>>;

  private yToCol(y: number): number {
    return 7 - y;
  }

  getTrackPanNormalized(y: number): number {
    return this.trackPanNormalized[this.yToCol(y)];
  }

  /**
   * Sets the pan of a track.
   * @param y
   * @param normalizedPan A value from 0..1
   */
  setTrackPanNormalized(y: number, normalizedPan: number) {
    this.getTrackFromGrid(y).pan().value().setImmediately(normalizedPan);
  }
  getTrackVolumeNormalized(y: number): number {
    return this.trackVolumeNormalized[this.yToCol(y)];
  }
  /**
   * Sets the volume of a track.
   * @param y
   * @param normalizedVolume A value from 0..1
   */
  setTrackVolumeNormalized(y: number, normalizedVolume: number) {
    this.getTrackFromGrid(y).volume().value().setImmediately(normalizedVolume);
  }

  getTrackFromGrid(y: number): Track {
    return this.bank.getItemAt(7 - y);
  }

  constructor(
    host: Host,
    id: string,
    name: string,
    numTracks: number,
    numSends: number,
    numScenes: number,
    showIndications: boolean
  ) {
    this.colors = new Array(numTracks);
    this.clips = new Array(numTracks);
    this.trackQueuedForStop = new Array(numTracks);
    this.trackIsMuted = new Array(numTracks);
    this.trackIsArmed = new Array(numTracks);
    this.trackIsSoloed = new Array(numTracks);
    this.trackPanNormalized = new Array(numTracks);
    this.trackVolumeNormalized = new Array(numTracks);

    this.bank = host.createMainTrackBank(numTracks, numSends, numScenes);
    this.cursor = host.createCursorTrack(id, name, 0, 0, true);

    const bankSize = this.bank.getSizeOfBank();
    var track, element;
    for (var bankIndex = 0; bankIndex < bankSize; bankIndex++) {
      const idx = bankIndex;
      track = this.bank.getItemAt(idx);

      this.trackQueuedForStop[idx] = false;
      track.isQueuedForStop().markInterested();
      track.isQueuedForStop().addValueObserver((isQueuedForStop) => {
        this.trackQueuedForStop[idx] = isQueuedForStop;
      });

      // Track elements
      {
        element = track.pan();
        element.markInterested();

        element.value().addValueObserver((pan) => {
          this.trackPanNormalized[idx] = pan;
        });

        element = track.volume();
        element.markInterested();
        element.value().addValueObserver((volume) => {
          this.trackVolumeNormalized[idx] = volume;
        });

        element = track.arm();
        element.markInterested();
        element.addValueObserver((isArmed) => {
          this.trackIsArmed[idx] = isArmed;
        });

        element = track.solo();
        element.markInterested();
        element.addValueObserver((isSoloed) => {
          this.trackIsSoloed[idx] = isSoloed;
        });

        element = track.mute();
        element.markInterested();
        element.addValueObserver((isMuted) => {
          this.trackIsMuted[idx] = isMuted;
        });
      }

      // Clip data
      {
        const clipLauncher = track.clipLauncherSlotBank();

        var clips = new Array(numScenes);
        for (var j = 0; j < numScenes; j++) {
          clips[j] = new Clip();
        }
        this.clips[idx] = clips;
        clipLauncher.addHasContentObserver((slotIndex, hasContent) => {
          this.clips[idx][slotIndex].index = slotIndex;
          this.clips[idx][slotIndex].hasContent = hasContent;
        });

        clipLauncher.addIsStopQueuedObserver((slotIndex, isStopQueued) => {
          this.clips[idx][slotIndex].isStopQueued = isStopQueued;
        });

        clipLauncher.addIsPlayingObserver((slotIndex, isPlaying) => {
          this.clips[idx][slotIndex].isPlaying = isPlaying;
        });
        clipLauncher.addIsPlaybackQueuedObserver((slotIndex, isQueued) => {
          this.clips[idx][slotIndex].isPlaybackQueued = isQueued;
        });

        clipLauncher.addIsRecordingObserver((slotIndex, isRecording) => {
          this.clips[idx][slotIndex].isRecording = isRecording;
        });
        clipLauncher.addIsRecordingQueuedObserver((slotIndex, isQueued) => {
          this.clips[idx][slotIndex].isRecordingQueued = isQueued;
        });

        clipLauncher.addColorObserver((slotIndex, r, g, b) => {
          this.clips[idx][slotIndex].index = slotIndex;
          this.clips[idx][slotIndex].color = [
            normalizeColor(r),
            normalizeColor(g),
            normalizeColor(b),
          ];
        });
      }

      // Set colors for track
      {
        this.colors[idx] = [0, 0, 0];
        track.color().addValueObserver((r, g, b) => {
          this.colors[idx] = [
            normalizeColor(r),
            normalizeColor(g),
            normalizeColor(b),
          ];
        });
      }
    }

    this.bank.followCursorTrack(this.cursor);
    this.cursor.solo().markInterested();
    this.cursor.mute().markInterested();

    this.bank.sceneBank().setIndication(showIndications);
  }
}
