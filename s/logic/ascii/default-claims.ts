
import { verticality } from "../data.js"
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
			startingLevel: level,
			stockpile: 60,
		}
	},

	watchtower: (tile: Tile) => {
		tile.claim.watchtower = {
			range: 2,
			verticality: verticality.everywhere,
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

