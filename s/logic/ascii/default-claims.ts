
import {Claim, Tile} from "../state.js"

const basetech: Claim.Tech = {
	knight: false,
	rook: false,
	bishop: false,
	queen: false,
}

export const defaultClaims = {
	resource: (tile: Tile, level: 1 | 2 | 3) => {
		tile.claim.resource = {
			level,
			stockpile: 32 * level,
		}
	},

	specialResource: (tile: Tile) => {
		tile.claim.specialResource = {
			stockpile: 32,
		}
	},

	watchtower: (tile: Tile) => {
		tile.claim.watchtower = {
			range: 2,
			verticality: "everywhere",
		}
	},

	techKnight: (tile: Tile) => {
		tile.claim.tech = {
			...basetech,
			knight: true,
		}
	},

	techRook: (tile: Tile) => {
		tile.claim.tech = {
			...basetech,
			rook: true,
		}
	},

	techBishop: (tile: Tile) => {
		tile.claim.tech = {
			...basetech,
			bishop: true,
		}
	},

	techQueen: (tile: Tile) => {
		tile.claim.tech = {
			...basetech,
			queen: true,
		}
	},

	techBasic: (tile: Tile) => {
		tile.claim.tech = {
			...basetech,
			knight: true,
			rook: true,
		}
	},

	techAdvanced: (tile: Tile) => {
		tile.claim.tech = {
			...basetech,
			bishop: true,
			queen: true,
		}
	},
}

