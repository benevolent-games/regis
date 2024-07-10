
import {Stuff} from "../../tools/stuff"
import {loop2d, vec2, Vec2, Vec3} from "@benev/toolbox"

export class Tile {
	elevation = 0
}

export class Gameboard {
	readonly extent: Vec2 = [8, 8]
	tiles = [...loop2d(this.extent)].map(() => new Tile())

	at([x, y]: Vec2) {
		const index = (y * this.extent[0]) + x
		const tile = this.tiles[index]
		if (!tile) throw new Error(`tile not found at [${x}, ${y}]`)
		return tile
	}

	;*loop() {
		for (const location of loop2d(this.extent))
			yield {location, tile: this.at(location)}
	}
}

type RenderOptions = {
	stuff: Stuff
	gameboard: Gameboard
	blockSize: number
	blockHeight: number
	blockNames: string[]
}

export class BoardRenderer {
	#disposers: (() => void)[] = []

	constructor(private options: RenderOptions) {}

	dispose() {
		this.#disposers.forEach(d => d())
		this.#disposers = []
	}

	location([x, y]: Vec2) {
		const {gameboard, blockSize, blockHeight} = this.options
		const tile = gameboard.at([x, y])
		const [offsetX, offsetY] = vec2.divideBy(gameboard.extent, 2)
		const worldX = (x - offsetX + 0.5) * blockSize
		const worldY = (tile.elevation * blockHeight) + 1
		const worldZ = (y - offsetY + 0.5) * blockSize
		return [worldX, worldY, worldZ] as Vec3
	}

	#spawnBlock(location: Vec2, elevation: number) {
		const {stuff, blockNames, blockHeight} = this.options
		const instance = stuff.instanceProp(blockNames[elevation])
		const [worldX,, worldZ] = this.location(location)
		const height = elevation * blockHeight
		instance.position.set(worldX, height, worldZ)
		this.#disposers.push(() => instance.dispose())
	}

	render() {
		this.dispose()
		const {gameboard} = this.options

		for (const {location, tile} of gameboard.loop()) {
			if (tile.elevation >= 0)
				this.#spawnBlock(location, 0)

			if (tile.elevation >= 1)
				this.#spawnBlock(location, 1)

			if (tile.elevation >= 2)
				this.#spawnBlock(location, 2)
		}
	}
}

