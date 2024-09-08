
import {Vec2} from "@benev/toolbox"

import {glyphs} from "./glyphs.js"
import {MapSpec} from "./types.js"
import {UnitKind} from "../../config/units.js"
import {TilesHelper} from "../helpers/tiles.js"
import {UnitsHelper} from "../helpers/units.js"
import {defaultClaims} from "./default-claims.js"
import {standardGameConfig} from "../../config/game.js"
import {GameInitial, makePlainBoardState} from "../state.js"
import {measureAsciiBoardExtent} from "./utils/measure-ascii-board-extent.js"

export function asciiMap(map: MapSpec): GameInitial {
	let id = 0

	const extent = measureAsciiBoardExtent(map.ascii)
	console.log("EXTENT", extent)

	const boardState = makePlainBoardState(extent)
	const board = new TilesHelper(boardState)
	const units = new UnitsHelper([])

	const lines = map.ascii
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

			function rezz(glyph: string, count: number, fn: () => void) {
				let counted = 0
				for (const char of part)
					if (char === glyph)
						counted += 1
				if (counted === count)
					fn()
			}

			//
			// terrain
			//

			zoop(glyphs.terrain.step, () => tile.step = true)
			zoop(glyphs.terrain.elevation.zero, () => tile.elevation = 0)
			zoop(glyphs.terrain.elevation.one, () => tile.elevation = 1)
			zoop(glyphs.terrain.elevation.two, () => tile.elevation = 2)
			zoop(glyphs.terrain.elevation.three, () => tile.elevation = 3)

			//
			// claims
			//

			const zip = defaultClaims(tile)
			rezz(glyphs.claims.resource, 1, () => zip.resource(1))
			rezz(glyphs.claims.resource, 2, () => zip.resource(2))
			rezz(glyphs.claims.resource, 3, () => zip.resource(3))
			zoop(glyphs.claims.specialResource, () => zip.specialResource())
			zoop(glyphs.claims.watchtower, () => zip.watchtower())
			zoop(glyphs.claims.techKnight, () => zip.tech("knight"))
			zoop(glyphs.claims.techRook, () => zip.tech("rook"))
			zoop(glyphs.claims.techBishop, () => zip.tech("bishop"))
			zoop(glyphs.claims.techQueen, () => zip.tech("queen"))
			zoop(glyphs.claims.techElephant, () => zip.tech("elephant"))
			zoop(glyphs.claims.techBasic, () => zip.tech("knight", "rook"))
			zoop(glyphs.claims.techAdvanced, () => zip.tech("bishop", "queen"))

			//
			// units
			//

			function makeUnit(kind: UnitKind, team: null | number, place: Vec2) {
				return () => units.add({
					id: id++,
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
			zoop(glyphs.units.whites.elephant, makeUnit("elephant", 0, place))

			zoop(glyphs.units.blacks.king, makeUnit("king", 1, place))
			zoop(glyphs.units.blacks.queen, makeUnit("queen", 1, place))
			zoop(glyphs.units.blacks.bishop, makeUnit("bishop", 1, place))
			zoop(glyphs.units.blacks.knight, makeUnit("knight", 1, place))
			zoop(glyphs.units.blacks.rook, makeUnit("rook", 1, place))
			zoop(glyphs.units.blacks.pawn, makeUnit("pawn", 1, place))
			zoop(glyphs.units.blacks.elephant, makeUnit("elephant", 1, place))
		})
	})

	return {
		id,
		board: board.state,
		units: units.state,
		config: standardGameConfig(),
		mapMeta: {
			name: map.name,
			author: map.author,
		},
	}
}

