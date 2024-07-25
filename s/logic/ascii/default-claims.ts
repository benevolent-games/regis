
import {Claim, Tile} from "../state.js"

const basetech: Claim.Tech = {
	knight: false,
	rook: false,
	bishop: false,
	queen: false,
}

export const defaultClaims = {
	resource: (tile: Tile) => {
		tile.claim.resource = {
			stockpile: 100,
			startsWithInvestments: 0,
		}
	},

	goldResource: (tile: Tile) => {
		tile.claim.resource = {
			stockpile: 100,
			startsWithInvestments: 2,
		}
	},

	watchtower: (tile: Tile) => {
		tile.claim.watchtower = {}
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

