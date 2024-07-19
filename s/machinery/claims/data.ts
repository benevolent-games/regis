
import {Vec2} from "@benev/toolbox"

export type ClaimKind = Claim.Any["kind"]

export namespace Claim {
	export type Resource = {
		kind: "resource"
		place: Vec2
		level: number
		stockpile: number
	}

	export type Watchtower = {
		kind: "watchtower"
		place: Vec2
		cost: number
	}

	export type Tech = {
		kind: "tech"
		place: Vec2
		unlocks: {
			rook: boolean
			bishop: boolean
			queen: boolean
		}
	}

	export type Any = Resource | Watchtower | Tech
}

export type ClaimsState = [number, Claim.Any][]

