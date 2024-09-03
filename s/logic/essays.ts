
import {UnitKind} from "./state.js"

export const unitEssays = {
	obstacle: "Destructible thing that blocks a tile.",
	king: "Game ends when he dies, can serve as a spawnpoint for new units.",
	pawn: "Peasant warrior, can stake claims, formidible in numbers.",
	knight: "Aggressive cavalry, strong against pawns and bishops.",
	rook: "Stalwart defender, strong but slow, can shoot over cliffs.",
	bishop: "Archer, deals damage at a distance, but vulnerable if unprotected.",
	queen: "Specialty unit, can see up cliffs for bishops.",
} satisfies Record<UnitKind, string>

