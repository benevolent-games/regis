
import {html} from "@benev/slate"
import {UnitKind} from "./state.js"

export const unitEssays = {

	obstacle: html`
		<p>Destructible thing that blocks a tile.</p>
	`,

	king: html`
		<p>Serves as spawn point, game ends when he dies.</p>
	`,

	pawn: html`
		<p>Can stake claims, formidible in numbers.</p>
	`,

	knight: html`
		<p>Aggressive cavalry troops, strong against pawns and bishops.</p>
	`,

	rook: html`
		<p>Stalwart defenders, slow and strong, can shoot over cliffs.</p>
	`,

	bishop: html`
		<p>Archers, tactically strong against rooks, vulnerable if unprotected.</p>
	`,

	queen: html`
		<p>Specialty unit, can see up cliffs for bishops.</p>
	`,

} satisfies Record<UnitKind, any>

