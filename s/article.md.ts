
import {string} from "@benev/turtle"
import {standardGameConfig} from "./config/game.js"

const config = standardGameConfig()

export default string`

## the five pillars of strategy

1. **maneuvers** — the tactics of conducting battles
2. **composition** — choosing which kinds army units to deploy
3. **investment** — ability to sacrifice the short-term for the long-term
4. **defender's advantage** — a buffer for hedging your bets
5. **fog-of-war** — hidden information provides opportunity for deception

chess doesn't have all of these.  
regis does, and it's playable with a standard chess set.  


## regis quick rundown

- **you start with your king**
	- and no other units
	- you lose when your king dies
- **8x8 chess board, but with added terrain**
	- three levels of elevation
	- half-steps that work like ramps, creating choke-points
- **resources**
	- you start with some resource points
	- you gain resource points as income each turn
	- you can spend resources to spawn units or stake claims
- **one action per unit per turn**
	- ie, you can move like five pawns during one of your turns
	- ie, you can tell your knight to attack, or move, but not both simultaneously
	- you click around to issue orders for your turn
	- you can press \`ctrl+z\` to cancel your orders and try again
	- you press \`spacebar\` to execute your turn
- **units**
	- units appear as standard chess pieces (kings, queens, bishops, knights, rooks, and pawns)
	- but they operate more like rts units than chess pieces
	- they have health points, some have ranged attacks, etc
- **spawning units**
	- you can spawn units near your king
	- each unit costs a different amount to spawn
- **fog-of-war**
	- this works like in rts games
	- units have different vision ranges that will reveal enemy units
	- most units cannot see up cliffs (thus providing an advantage for ranged units on high ground)
	- this is the only game mechanic that you cannot replicate on a real physical chess board in person
- ~~**staking claims**~~ *\`coming soon\`*
	- some tiles are marked with one or more claims
	- resource claims offer more income each turn
	- tech claims offer to unlock unit types
	- you can stake a claim by moving a pawn on top of it
	- you pay a staking cost when you move a pawn onto a claim
	- different claim types have different staking costs
	- if you move your pawn off the claim, you lose it; re-staking will cost you again
- ~~**upgrading resource claims**~~ *\`coming soon\`*
	- resource claims come in three levels:
		- level 1: you gain +1 resource per turn
		- level 2: you gain +2 resource per turn
		- level 3: you gain +3 resource per turn
	- you can *upgrade* a resource tile by clicking on it and pressing the upgrade button
		- each upgrade has a different cost
		- upgrading costs more than staking a different resource claim, making it cheaper to spread your investments over a larger area (which is harder to defend)


## current game configuration

\`\`\`json
${JSON.stringify(config, null, "\t")}
\`\`\`

`

