
import {UnitKind} from "./state.js"

export const unitEssays = {
	obstacle: "Destructible thing that blocks a tile.",
	king: "Game ends when he dies, can see up cliffs, is a spawnpoint.",
	pawn: "Peasant warrior, can stake claims, formidible in numbers.",
	knight: "Aggressive cavalry, strong against pawns and bishops.",
	rook: "Stalwart defender, strong but slow, can shoot over cliffs.",
	bishop: "Archer, deals damage at a distance, but vulnerable if unprotected.",
	queen: "Specialty unit, scout, medic, spawnpoint",
	elephant: "Rampaging beast, no chains can bind him...",
} satisfies Record<UnitKind, string>

