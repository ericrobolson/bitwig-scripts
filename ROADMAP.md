# UX Ideas

- Play with single hand navigation. E.g. if you want to record over something, you tap record, then tap the clip you want to record.
- Play with holding buttons down to do actions. If you want to do other actions that may require multiple things at once, like stopping multiple tracks, make it so you hold the button down and then select all tracks

# Current Roadmap

- [x] Add context for record arm control.Tap once to go to record arm control state, tap again to go to default state.
- [x] Add context for volume control. Tap once to go to volume control state, tap again to go to default state.
- [x] Add context for pan control. Tap once to go to pan control state, tap again to go to default state.

- [ ] Add in displaying of values for arm controls. If a track is armed, use a high light intensity. Make it flash. If not armed, static low light.
- [ ] When in volume context, show volume sliders colored by each track.

- [ ] Add in setting of values for arm controls.
- [ ] When in volume context, allow setting of volume level.

- [ ] Add context for pan control
- [ ] Add context for stop control
- [ ] Add context for mute control
- [ ] Add context for solo control
- [ ] Add context for Send A control
- [ ] Add context for Send B control

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
- [ ] Wire up deletion of clips. Make a double tap?
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
