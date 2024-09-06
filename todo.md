
# art

new indicators scheme
- liberties
  - liberty-move
    - `liberty-move-neutral`
    - `liberty-move-team1`
    - `liberty-move-team2`
  - liberty-attack
    - `liberty-attack-neutral`
    - `liberty-attack-team1`
    - `liberty-attack-team2`
  - liberty-spawn
    - `liberty-spawn-neutral`
    - `liberty-spawn-team1`
    - `liberty-spawn-team2`
  - liberty-heal
    - `liberty-heal-neutral`
    - `liberty-heal-team1`
    - `liberty-heal-team2`
- claims
  - `claim-depleted`
  - stake
    - `claim-stake-on`
    - `claim-stake-off`
  - tech
    - `claim-tech-knight`
    - `claim-tech-rook`
    - `claim-tech-bishop`
    - `claim-tech-queen`
    - `claim-tech-elephant`

# code

refactors
- rename `spawn` to `summon`

------

features

- [x] queen healing ability
- [ ] attack arcs
- [ ] undo one action
- [x] spawn-ghosts
- [ ] endgame state
  - game should be frozen, no further turns
  - lift the fog-of-war, revealing the whole board state to both teams
  - display a game over sign
  - add a ui button to leave the match
- [ ] 10 second pregame
- [ ] obstacle vision

- [ ] multi-selection and multi-commands
- [ ] control groups

- [x] reveal enemies on attack
- [x] resource depletion
- [x] inspector ui
- [x] linear health bars
- [x] decide what to do with investment mechanic
- [x] camera starting angle, camera smoothing
- [x] turn counter (cycles count)
- [x] fog of war visuals

- [x] roster unlocks
- [x] fix orbitcam cursor desync (limit verticality)
- [x] fix annoying dropped websocket rejection error
- [x] **potential bug:**
  - leap king into fog of war on high ground, spawn a rook where an enemy is -- glitch!?!?

