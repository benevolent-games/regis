
import {Vec2} from "@benev/toolbox"

import {glyphs} from "./glyphs.js"
import {MapSpec} from "./types.js"
import {defaultGameConfig} from "../data.js"
import {TilesHelper} from "../helpers/tiles.js"
import {UnitsHelper} from "../helpers/units.js"
import {defaultClaims} from "./default-claims.js"
import {GameInitial, makePlainBoardState, UnitKind} from "../state.js"

export function asciiMap(map: MapSpec): GameInitial {
	let id = 0
	const board = new TilesHelper(makePlainBoardState())
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

			zoop(glyphs.claims.resource, () => defaultClaims.resource(tile, 1))
			zoop(glyphs.claims.resource2, () => defaultClaims.resource(tile, 2))
			zoop(glyphs.claims.resource3, () => defaultClaims.resource(tile, 3))
			zoop(glyphs.claims.watchtower, () => defaultClaims.watchtower(tile))
			zoop(glyphs.claims.techKnight, () => defaultClaims.techKnight(tile))
			zoop(glyphs.claims.techRook, () => defaultClaims.techRook(tile))
			zoop(glyphs.claims.techBishop, () => defaultClaims.techBishop(tile))
			zoop(glyphs.claims.techQueen, () => defaultClaims.techQueen(tile))
			zoop(glyphs.claims.techBasic, () => defaultClaims.techBasic(tile))
			zoop(glyphs.claims.techAdvanced, () => defaultClaims.techAdvanced(tile))

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

			zoop(glyphs.units.blacks.king, makeUnit("king", 1, place))
			zoop(glyphs.units.blacks.queen, makeUnit("queen", 1, place))
			zoop(glyphs.units.blacks.bishop, makeUnit("bishop", 1, place))
			zoop(glyphs.units.blacks.knight, makeUnit("knight", 1, place))
			zoop(glyphs.units.blacks.rook, makeUnit("rook", 1, place))
			zoop(glyphs.units.blacks.pawn, makeUnit("pawn", 1, place))
		})
	})

	return {
		id,
		board: board.state,
		units: units.state,
		config: defaultGameConfig(),
		mapMeta: {
			name: map.name,
			author: map.author,
		},
	}
}

