
import {vec2, Vec3} from "@benev/toolbox"
import {Constructor} from "@benev/slate"
import {TransformNode} from "@babylonjs/core"
import {Grid, Place, Placements, Selectacon, Tile, Unit} from "../concepts.js"

type Options = {
	grid: Grid
	selectacon: Selectacon
	placements: Placements
	unitInstancers: Map<Constructor<Unit>, () => TransformNode>
	blocks: {
		size: number
		height: number
		instancers: (() => TransformNode)[]
	}
}

export class Board {
	#instances: TransformNode[] = []
	constructor(private options: Options) {}

	/** convert a grid place to a 3d world position */
	localize(place: Place) {
		const {grid, blocks} = this.options
		const tile = grid.at(place)
		const [offsetX, offsetZ] = vec2.divideBy(grid.extent, 2)
		const worldX = (place.file - offsetX + 0.5) * blocks.size
		const worldY = (tile.elevation * blocks.height) + 1
		const worldZ = (place.rank - offsetZ + 0.5) * blocks.size
		return [worldX, worldY, worldZ] as Vec3
	}

	#spawnTile(tile: Tile, place: Place) {
		const {blocks} = this.options
		const spawnBlock = (level: number) => {
			const instance = blocks.instancers[level]()
			const [worldX,,worldZ] = this.localize(place)
			const worldY = level * blocks.height
			instance.position.set(worldX, worldY, worldZ)
			this.#instances.push(instance)
		}

		if (tile.elevation >= 0)
			spawnBlock(0)

		if (tile.elevation >= 1)
			spawnBlock(1)

		if (tile.elevation >= 2)
			spawnBlock(2)
	}

	#spawnUnit(unit: Unit, place: Place) {
		const {unitInstancers} = this.options
		const instancer = unitInstancers.get(unit.constructor as any)
		if (!instancer) throw new Error(`instancer not found for unit ${unit.constructor.name}`)
		const instance = instancer()
		instance.position.set(...this.localize(place))
		this.#instances.push(instance)
	}

	dispose() {
		for (const instance of this.#instances)
			instance.dispose()
		this.#instances = []
	}

	render() {
		const {grid, placements} = this.options
		this.dispose()

		for (const {tile, place} of grid.loop())
			this.#spawnTile(tile, place)

		for (const {unit, place} of placements.loop())
			this.#spawnUnit(unit, place)
	}
}

