
import {Vec2} from "@benev/toolbox"

import {glyphs} from "./glyphs.js"
import {UnitKind} from "../units/data.js"
import {BoardAuthor} from "../board/author.js"
import {UnitsAuthor} from "../units/author.js"

export function asciiMap(ascii: string) {
	const board = new BoardAuthor()
	const units = new UnitsAuthor()

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

			zoop(glyphs.resource, () => tile.resource = true)
			zoop(glyphs.watchTower, () => tile.watchTower = true)

			zoop(glyphs.elevation.one, () => tile.elevation = 1)
			zoop(glyphs.elevation.two, () => tile.elevation = 2)
			zoop(glyphs.elevation.three, () => tile.elevation = 3)

			zoop(glyphs.ramps.north, () => tile.ramp = "north")
			zoop(glyphs.ramps.east, () => tile.ramp = "east")
			zoop(glyphs.ramps.south, () => tile.ramp = "south")
			zoop(glyphs.ramps.west, () => tile.ramp = "west")

			function makeUnit(kind: UnitKind, team: null | number, place: Vec2) {
				return () => units.add({
					kind,
					team,
					place,
					damage: 0,
				})
			}

			zoop(glyphs.obstacle, makeUnit("obstacle", null, place))

			zoop(glyphs.whites.king, makeUnit("king", 0, place))
			zoop(glyphs.whites.queen, makeUnit("queen", 0, place))
			zoop(glyphs.whites.bishop, makeUnit("bishop", 0, place))
			zoop(glyphs.whites.knight, makeUnit("knight", 0, place))
			zoop(glyphs.whites.rook, makeUnit("rook", 0, place))
			zoop(glyphs.whites.pawn, makeUnit("pawn", 0, place))

			zoop(glyphs.blacks.king, makeUnit("king", 1, place))
			zoop(glyphs.blacks.queen, makeUnit("queen", 1, place))
			zoop(glyphs.blacks.bishop, makeUnit("bishop", 1, place))
			zoop(glyphs.blacks.knight, makeUnit("knight", 1, place))
			zoop(glyphs.blacks.rook, makeUnit("rook", 1, place))
			zoop(glyphs.blacks.pawn, makeUnit("pawn", 1, place))
		})
	})

	return {board, units}
}

