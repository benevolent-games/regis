
import {Vec2} from "@benev/toolbox"

import {glyphs} from "./glyphs.js"
import {unitry} from "../helpers/unitry.js"
import {makeBoard} from "../state/board.js"
import {boardery} from "../helpers/boardery.js"
import {claimery} from "../helpers/claimery.js"
import {UnitKind, Units} from "../state/units.js"
import {Claims, defaultClaims} from "../state/claims.js"

export function asciiMap(ascii: string) {
	const board = makeBoard()
	const units: Units = []
	const claims: Claims = []

	const lines = ascii
		.split("\n")
		.map(s => s.trim())
		.filter(s => s.length > 0)
		.reverse()

	lines.forEach((line, rank) => {
		const parts = line.split(/\s+/)

		parts.forEach((part, file) => {
			const place = [file, rank] as Vec2
			const tile = boardery(board).at(place)

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

			zoop(glyphs.claims.resource, () => claimery(claims).create(
				defaultClaims.resource(place))
			)

			zoop(glyphs.claims.watchtower, () => claimery(claims).create(
				defaultClaims.watchtower(place)
			))

			zoop(glyphs.claims.techKnight, () => claimery(claims).create(
				defaultClaims.techKnight(place)
			))

			zoop(glyphs.claims.techRook, () => claimery(claims).create(
				defaultClaims.techRook(place)
			))

			zoop(glyphs.claims.techAdvanced, () => claimery(claims).create(
				defaultClaims.techAdvanced(place)
			))

			//
			// units
			//

			function makeUnit(kind: UnitKind, team: null | number, place: Vec2) {
				return () => unitry(units).add({
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

	return {board, units, claims}
}

