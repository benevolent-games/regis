
import {Vec2} from "@benev/toolbox"

import {glyphs} from "./glyphs.js"
import {UnitKind} from "../state/units.js"
import {BoardHelper} from "../helpers/board.js"
import {UnitsHelper} from "../helpers/units.js"
import {defaultClaims} from "../state/claims.js"
import {ClaimsHelper} from "../helpers/claims.js"
import {makePlainBoardState} from "../state/board.js"

export function asciiMap(ascii: string) {
	const board = new BoardHelper(makePlainBoardState())
	const units = new UnitsHelper([])
	const claims = new ClaimsHelper([])

	const lines = ascii
		.split("\n")
		.map(s => s.trim())
		.filter(s => s.length > 0)
		.reverse()

	lines.forEach((line, rank) => {
		const parts = line.split(/\s+/)

		parts.forEach((part, file) => {
			const place = [file, rank] as Vec2
			const tile = board.at(place)

			function zoop(glyph: string, fn: () => void) {
				if (part.includes(glyph))
					fn()
			}

			//
			// terrain
			//

			zoop(glyphs.terrain.step, () => tile.step = true)
			zoop(glyphs.terrain.elevation.one, () => tile.elevation = 1)
			zoop(glyphs.terrain.elevation.two, () => tile.elevation = 2)
			zoop(glyphs.terrain.elevation.three, () => tile.elevation = 3)

			//
			// claims
			//

			zoop(glyphs.claims.resource, () => claims.create(
				defaultClaims.resource(place))
			)

			zoop(glyphs.claims.watchtower, () => claims.create(
				defaultClaims.watchtower(place)
			))

			zoop(glyphs.claims.techKnight, () => claims.create(
				defaultClaims.techKnight(place)
			))

			zoop(glyphs.claims.techRook, () => claims.create(
				defaultClaims.techRook(place)
			))

			zoop(glyphs.claims.techAdvanced, () => claims.create(
				defaultClaims.techAdvanced(place)
			))

			//
			// units
			//

			function makeUnit(kind: UnitKind, team: null | number, place: Vec2) {
				return () => units.add({
					kind,
					team,
					place,
					damage: 0,
				})
			}

			zoop(glyphs.units.neutral.obstacle, makeUnit("obstacle", null, place))

			zoop(glyphs.units.whites.king, makeUnit("king", 0, place))
			zoop(glyphs.units.whites.queen, makeUnit("queen", 0, place))
			zoop(glyphs.units.whites.bishop, makeUnit("bishop", 0, place))
			zoop(glyphs.units.whites.knight, makeUnit("knight", 0, place))
			zoop(glyphs.units.whites.rook, makeUnit("rook", 0, place))
			zoop(glyphs.units.whites.pawn, makeUnit("pawn", 0, place))

			zoop(glyphs.units.blacks.king, makeUnit("king", 1, place))
			zoop(glyphs.units.blacks.queen, makeUnit("queen", 1, place))
			zoop(glyphs.units.blacks.bishop, makeUnit("bishop", 1, place))
			zoop(glyphs.units.blacks.knight, makeUnit("knight", 1, place))
			zoop(glyphs.units.blacks.rook, makeUnit("rook", 1, place))
			zoop(glyphs.units.blacks.pawn, makeUnit("pawn", 1, place))
		})
	})

	return {
		board: board.state,
		units: units.state,
		claims: claims.state,
	}
}

