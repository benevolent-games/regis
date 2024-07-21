
import {Vec2} from "@benev/toolbox"

export type Claims = ClaimEntry[]
export type ClaimEntry = [string, Claim.Any]
export type ClaimKind = Claim.Any["kind"]

export namespace Claim {
	export type Resource = {
		kind: "resource"
		place: Vec2
		level: number
		stockpile: number
		stakeCost: number
		upgradeCosts: {
			level2: number
			level3: number
		}
	}

	export type Watchtower = {
		kind: "watchtower"
		place: Vec2
		stakeCost: number
	}

	export type Tech = {
		kind: "tech"
		place: Vec2
		stakeCost: number
		unlocks: {
			knight: boolean
			rook: boolean
			bishop: boolean
			queen: boolean
		}
	}

	export type Any = Resource | Watchtower | Tech
}

export const defaultClaims = {
	resource: (place: Vec2): Claim.Resource => ({
		kind: "resource",
		place,
		level: 1,
		stakeCost: 8,
		stockpile: 100,
		upgradeCosts: {
			level2: 12,
			level3: 16,
		},
	}),

	watchtower: (place: Vec2): Claim.Watchtower => ({
		kind: "watchtower",
		place,
		stakeCost: 0,
	}),

	techKnight: (place: Vec2): Claim.Tech => ({
		kind: "tech",
		place,
		stakeCost: 2,
		unlocks: {
			knight: true,
			rook: false,
			queen: false,
			bishop: false,
		},
	}),

	techRook: (place: Vec2): Claim.Tech => ({
		kind: "tech",
		place,
		stakeCost: 4,
		unlocks: {
			knight: false,
			rook: true,
			queen: false,
			bishop: false,
		},
	}),

	techBasic: (place: Vec2): Claim.Tech => ({
		kind: "tech",
		place,
		stakeCost: 8,
		unlocks: {
			knight: true,
			rook: true,
			queen: false,
			bishop: false,
		},
	}),

	techAdvanced: (place: Vec2): Claim.Tech => ({
		kind: "tech",
		place,
		stakeCost: 8,
		unlocks: {
			knight: false,
			rook: false,
			queen: true,
			bishop: true,
		},
	}),
}

