
# feedbacks

- units should change color when they're exhausted
- would be nice if you could step on claims without staking
- remove heal from tasking from units that cannot heal
- obstacles should not have tasking
- getting multiple tech claims provide discount on recruiting

## geoff notes

Try scaling grace with units you control, or resource generation rate
Claims that give you power ups and deplete over time. (Each time you use ability deplete the claim)
Extra claims for the same unit reduce recruitment cost by X (probably 1)

UX
Visual treatment for units that can no longer move/attack/heal/do any actions (Probably one for heal, and one for
Visual treatment for units currently holding a claim. Icon above their head representing the claim (and its depletion)
Ghost of some sort displaying your hovered action (Move, attack, claim) and the cost (for claims at least).
Visualization of units attack pattern as red boarders from current position. Goes grey when attack action not available.
Movement dots grey when movement actions are exhausted
Unit goes grey when all actions are exhausted
Hotkeys visualized beside each unit


Going to need to sort of play out opponents turn as like animations... Too hard to track what they did without it. Just do tweens if you have to. 


Going to need to sort of play out opponents turn as like animations... Too hard to track what they did without it. Just do tweens if you have to.

## duck notes

grace down to 2 seconds or keep it at 5 but make it so you are not able to select units until your turn

Classic Que = 8x8 maps only

Blitz que 0 second grace

Ranked using the Chess elo system not sure if that's possible

ghost "new" units
 
if seen by a unit "rock obstacles" will be seen for the rest of the game at hp they were last seen

Simplify the info on tiles also put said info in a pop-up bubble. in said info bubble you should only need (Cost, income, stock) info IMO you can get do away with "Claims", "Stakeholder", "Terrain", Elevation". Elevation can be gone for everything  imo that already has a visual 

Show attack range around units when selected maybe a Red wall like the White vision one

Pop-up for claiming / just move without claiming to a Claims Tile

CTRL - Z needs to only reset one move/ one set of moves say up to 5 within your turn


Pop-up bubble for unit selected with picture info once on the field
• Pawn have a money symbol = stake claims
• Rook have a lob attack symbol as it can shoot above/below
• Knight (NEW ABILITY RUSH) has a rush symbol with a half damage attack
•  2x (bow) = ranged attack symbol for bishop
• Queen an eyeball / medic symbols1 heal on a unit per turn, said unit gets an anti heal symbol after heal has been applied*
• King should have a group symbol = spawn point

Claim tiles bubble info
• Knight: Claim cost, Unlock
• Rook: Claim cost, Unlock
• Bishop: Claim cost, Unlock
• Queen: Claim cost, Unlock
• Wheat: Clain cost, income, stock

make it so the side of tiles can't be selected

<br/>

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
- [ ] optimize so it's less laggy
- [ ] undo one action
- [ ] all new indicators and attack arcs
- [ ] obstacle vision
- [x] fix games don't end on time expiry
- [x] cache-busting starter script
- [x] fix multitasking systems
- [x] new inspector
- [x] menu with ability to surrender
- [x] endgame state
  - game should be frozen, no further turns
  - lift the fog-of-war, revealing the whole board state to both teams
  - display a game over sign
  - add a ui button to leave the match
- [x] 10 second pregame
- [x] deploy

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

