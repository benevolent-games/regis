
import {glyphs} from "./glyphs.js"
import {Bishop, Grid, King, Knight, Pawn, Place, Placements, Queen, Rook} from "../concepts.js"

type Options = {
	ascii: string
	grid: Grid
	placements: Placements
}

export function parseAsciiMap(options: Options) {
	const {ascii, grid, placements} = options

	const lines = ascii
		.split("\n")
		.map(s => s.trim())
		.filter(s => s.length > 0)
		.reverse()

	lines.forEach((line, rank) => {
		const parts = line.split(/\s+/).reverse()

		parts.forEach((part, file) => {
			const place = new Place([file, rank])
			const tile = grid.at(place)

			function zoop(glyph: string, fn: () => void) {
				if (part.includes(glyph))
					fn()
			}

			zoop(glyphs.resource, () => tile.resource = true)
			zoop(glyphs.obstacle, () => tile.obstacle = true)
			zoop(glyphs.tower, () => tile.obstacle = true)

			zoop(glyphs.elevation.one, () => tile.elevation = 1)
			zoop(glyphs.elevation.two, () => tile.elevation = 2)
			zoop(glyphs.elevation.three, () => tile.elevation = 3)

			zoop(glyphs.ramps.north, () => tile.ramp = "north")
			zoop(glyphs.ramps.east, () => tile.ramp = "east")
			zoop(glyphs.ramps.south, () => tile.ramp = "south")
			zoop(glyphs.ramps.west, () => tile.ramp = "west")

			zoop(glyphs.whites.king, () => placements.put(new King(1), place))
			zoop(glyphs.whites.queen, () => placements.put(new Queen(1), place))
			zoop(glyphs.whites.bishop, () => placements.put(new Bishop(1), place))
			zoop(glyphs.whites.knight, () => placements.put(new Knight(1), place))
			zoop(glyphs.whites.rook, () => placements.put(new Rook(1), place))
			zoop(glyphs.whites.pawn, () => placements.put(new Pawn(1), place))

			zoop(glyphs.blacks.king, () => placements.put(new King(2), place))
			zoop(glyphs.blacks.queen, () => placements.put(new Queen(2), place))
			zoop(glyphs.blacks.bishop, () => placements.put(new Bishop(2), place))
			zoop(glyphs.blacks.knight, () => placements.put(new Knight(2), place))
			zoop(glyphs.blacks.rook, () => placements.put(new Rook(2), place))
			zoop(glyphs.blacks.pawn, () => placements.put(new Pawn(2), place))
		})
	})
}

