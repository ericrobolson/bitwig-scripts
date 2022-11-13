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
  public readonly trackQueuedForStop: Array<boolean>;
  public readonly cursor: CursorTrack;
  public readonly colors: Array<[number, number, number]>;
  public readonly clips: Array<Array<Clip>>;

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
        element.setIndication(true);

        element = track.volume();
        element.markInterested();
        element.setIndication(true);
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
