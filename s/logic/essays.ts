
import {html} from "@benev/slate"
import {UnitKind} from "./state.js"

export const unitEssays = {

	obstacle: html`
		<p>Destructible thing that blocks a tile.</p>
	`,

	king: html`
		<p>The King serves as a spawn-point for new units. The game ends when he dies. He has a sturdy constitution, but is otherwise unremarkable in combat.</p>
	`,

	pawn: html`
		<p>Pawns can stake resource claims to increase your income, or stake technology claims to unlock more units. They're not ideal in combat, though can be formidible in numbers.</p>
	`,

	knight: html`
		<p>Knights are aggressive cavalry troops. They move fast and deal high damage. Effective against pawns, and excellent against bishops if they can close the distance. Potent when used in aggressive plays.</p>
	`,

	rook: html`
		<p>Rooks are stalwart defenders. They move slow, hit hard, and can soak up a ton of damage. Deadly against any foe on the ground, if only they can catch them. Great for blocking narrow paths.</p>
	`,

	bishop: html`
		<p>Bishops are archers. They can shoot enemies from a distance, if only they can see them. Ideal for chipping away at rooks from a safe distance.</p>
	`,

	queen: html`
		<p>Queens are specialty units. They can see up cliffs, perfect for helping bishops spot high-ground targets. Awful in combat, but they can act as an alternative spawn-point for new reinforcements.</p>
	`,

} satisfies Record<UnitKind, any>

