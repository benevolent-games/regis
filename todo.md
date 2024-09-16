
# art

new indicators scheme
- color sources -- *i will yoink the colors from these sources to apply to other stuff*
  - `color-neutral` -- *white*
  - `color-team1` -- *cyan*
  - `color-team2` -- *yellowy-orange*
  - `color-angry` -- *red*
  - `color-happy` -- *green*
- liberties
  - `liberty-move`
  - `liberty-attack`
  - `liberty-recruit`
  - `liberty-heal`
- claims
  - `claim-depleted` *(some kinda alert)*
  - staking *(four corners thing, maybe)*
    - `claim-stake-on`
    - `claim-stake-off`
  - tech
    - `claim-tech-knight`
    - `claim-tech-rook`
    - `claim-tech-bishop`
    - `claim-tech-queen`
    - `claim-tech-elephant`
  - resources
    - `claim-special-resource`
    - `claim-resource1`
    - `claim-resource2`
    - `claim-resource3`
- danger and attacks
  - `damage` -- *unit on this tile was hurt last turn*
  - `threat` -- *identifies when your own unit is in danger*
  - `attack-arc` -- *trajectory of an attack, through the air*
  - `dead` -- *a unit died here*
  - `healed` -- *unit on this tile was healed last turn*
- fog of war
  - `aura`
- selection and hover
  - `hover`
  - `selected`
- moves
  - `move-straight`
  - `move-corner`
  - `move-start`
  - `move-end`
  - `move-riser`

# code

priorities
- [x] fix games don't end on time expiry
- [ ] optimize so it's less laggy
- [x] cache-busting starter script
- [x] fix multitasking systems
- [x] new inspector
- [x] menu with ability to surrender
- [ ] undo one action
- [x] endgame state
  - game should be frozen, no further turns
  - lift the fog-of-war, revealing the whole board state to both teams
  - display a game over sign
  - add a ui button to leave the match
- [ ] deploy
- [ ] attack arcs
- [x] 10 second pregame
- [ ] obstacle vision

wontfix
- multi-selection and multi-commands
- control groups

done
- [x] queen healing ability
- [x] spawn-ghosts

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

