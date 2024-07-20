
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
		stakeCost: 6,
		stockpile: 100,
		upgradeCosts: {
			level2: 12,
			level3: 18,
		},
	}),

	watchtower: (place: Vec2): Claim.Watchtower => ({
		kind: "watchtower",
		place,
		stakeCost: 6,
	}),

	tech: (place: Vec2): Claim.Tech => ({
		kind: "tech",
		place,
		stakeCost: 6,
		unlocks: {
			rook: true,
			queen: true,
			bishop: true,
		},
	}),
}

