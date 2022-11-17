# UX Ideas

- Play with single hand navigation. E.g. if you want to record over something, you tap record, then tap the clip you want to record.
- Play with holding buttons down to do actions. If you want to do other actions that may require multiple things at once, like stopping multiple tracks, make it so you hold the button down and then select all tracks

# Current Roadmap

- [x] Implement context for stop control
- [x] Add context for record arm control.Tap once to go to record arm control state, tap again to go to default state.
- [x] Add context for volume control. Tap once to go to volume control state, tap again to go to default state.
- [x] Add context for pan control. Tap once to go to pan control state, tap again to go to default state.
- [x] Fixed issue with lights not displaying real time
- [x] Focus on 3 contexts: stop, arrange, record arm
- [x] Standardize interfaces. Take the `contextArrange` and `contextStopClip` and move out the similiar parts and make it data driven. E.g. make the differences interfaces, then call those interfaces from a single unified render method. Follow UX of solid tertiary color nav buttons, pulsing primary color for a border and a solid contrasting color for the menu. Take stop clip as an example and use fun border color combinations for each track.
- [x] Add in setting of values for arm controls.
- [x] Implement deletion context
- [x] Add in displaying of values for arm controls. If a track is armed, use a high light intensity. Make it flash. If not armed, static low light.
- [x] Implement solo. Copy pasta arm track code.
- [x] Implement mute. Refactor solo + arm track code to share it and have consistent behavior.
- [x] Implement context for solo control
- [x] Implement context for mute control
- [x] Refactor contexts to use builder functions.
- [x] Implement volume context. (make value slider control)
- [x] When in volume context, show volume sliders colored by each track.
- [ ] When in volume context, add setting of volume level.
- [ ] Implement context for pan control
- [ ] Implement display for pan control
- [ ] Implement setting for pan control
- [ ] Maybe make swap, copy, and delete the note, custom and capture midi buttons? That would give you most sequencer needs you have.
- [ ] Implement context for Send A control
- [ ] Implement context for Send B control
- [ ] Solidify color scheme
- [ ] Merge to master
- [ ] Hide anywhere where you do `y = 7 - col` and abstract it with a function.

- [ ] Update layouts depending on which mode you're in.
- [ ] Add switching between mix, arrange, and edit modes
- [ ] Edit mode navigation + functionality
- [ ] Add copying of tracks
- [ ] Mix mode navigation: left/right
- [ ] Mix mode navigation: up/down
- [ ] Mix mode functionality
- [ ] Make buttons glow a color if pressed.
- [ ] Add triggering of metronome
- [ ] If unable to navigate in a direction, make that light fade a bit
- [ ] Figure out a way to drive clip editing and arrangment editing with launchpad
- [ ] Wire addition of new tracks
- [ ] Add in quanitzation settings menu for track for launchpad. Maybe set under 'note'? Have it display text and use a slider.
- [ ] Add in global stopping of project
- [ ] Add in global playing of project
- [ ] Add in trimming of clips that are recorded?

Maybe features:

- [ ] UX: Make side control buttons scene colors to help orient you. Make control buttons flash scene colors

- [ ] Add visible outline for grid on Bitwig
- [ ] Add in pixel drawing of text
- [ ] Add overdub for midi tracks?
- [ ] Add overdub for audio tracks?
- [ ] Wire up deletion of new tracks
- [ ] Wire up creation of new scenes
- [ ] Wire up deletion of scenes
- [ ] Add in variations so if a grid column is say even or odd with respect to bitwig, it's lighter or darker on the launchpad.

# Finished

- [x] Wire up reading of colors
- [x] Wire up displaying of clip colors
- [x] Wire up displaying of track colors on grid if no clips present. Make the RGB about 40% of the strength.
- [x] Wire up playing of clips
- [x] Wire up stopping of clips
- [x] Wire up recording of clips
- [x] PERF: don't send lights if not modified
- [x] Arrange mode navigation: up/down on window + lpad
- [x] Arrange mode navigation: left/right
- [x] If a track is queued to stop, make the entire track pulse red.
- [x] Break out light renderer
- [x] Add in 'context' concept so you can modify volumes, pans, etc vs launching clips
- [x] Break out state transitions from handle midi
