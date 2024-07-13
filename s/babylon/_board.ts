//
// import {Constructor, Pipe} from "@benev/slate"
// import {scalar, Vec2, vec2, Vec3} from "@benev/toolbox"
// import {AbstractMesh, Quaternion, TransformNode, Vector3} from "@babylonjs/core"
//
// import {World} from "../world/world.js"
// import {Grid, Place, Placements, Selectacon, Tile, Unit} from "../concepts.js"
//
// export type BlockInstancers = {
// 	normal: () => TransformNode
// 	vision: () => TransformNode
// 	hover: () => TransformNode
// 	selected: () => TransformNode
// }
//
// type Options = {
// 	world: World
// 	grid: Grid
// 	properSelectacon: Selectacon
// 	placements: Placements
// 	unitInstancers: Map<Constructor<Unit>, () => TransformNode>
// 	blocks: {
// 		size: number
// 		height: number
// 		instancers: {
// 			box: {
// 				levelOne: BlockInstancers
// 				levelTwo: BlockInstancers
// 				levelThree: BlockInstancers
// 			}
// 			ramp: {
// 				levelTwo: BlockInstancers
// 				levelThree: BlockInstancers
// 			}
// 		}
// 	}
// }
//
// export class Board {
// 	#instances: TransformNode[] = []
// 	#blocks = new Map<AbstractMesh, Place>()
//
// 	constructor(private options: Options) {}
//
// 	/** convert a grid place to a 3d world position */
// 	localize(place: Place) {
// 		const {grid, blocks} = this.options
// 		const tile = grid.at(place)
// 		const [offsetX, offsetZ] = vec2.divideBy(grid.extent, 2)
// 		const worldX = (place.file - offsetX + 0.5) * blocks.size
// 		const worldY = tile.elevation * blocks.height
// 		const worldZ = (place.rank - offsetZ + 0.5) * blocks.size
// 		return [worldX, worldY, worldZ] as Vec3
// 	}
//
// 	delocalize(vec: Vec2) {
// 		const {grid, blocks} = this.options
// 		const offset = vec2.divideBy(grid.extent, 2)
//
// 		return Pipe.with(vec)
// 			.to(([x, z]) => this.clampPosition([x, 0, z]))
// 			.to(([x,,z]) => [x, z] as Vec2)
// 			.to(v => vec2.divideBy(v, blocks.size))
// 			.to(v => vec2.add(v, offset))
// 			.to(v => vec2.subtract(v, offset))
// 			.to(v => vec2.applyBy(v, x => Math.floor(x)))
// 			.to(v => new Place(v))
// 			.done()
// 	}
//
// 	#boundaryReport() {
// 		const [cornerFile, cornerRank] = this.options.grid.extent
// 		const corners = [
// 			this.localize(new Place([0, 0])),
// 			this.localize(new Place([0, cornerRank - 1])),
// 			this.localize(new Place([cornerFile - 1, 0])),
// 			this.localize(new Place([cornerFile - 1, cornerRank - 1])),
// 		]
// 		return {
// 			min: {
// 				x: Math.min(...corners.map(c => c[0])),
// 				y: 0,
// 				z: Math.min(...corners.map(c => c[2])),
// 			},
// 			max: {
// 				x: Math.max(...corners.map(c => c[0])),
// 				y: 2,
// 				z: Math.max(...corners.map(c => c[2])),
// 			},
// 		}
// 	}
//
// 	clampPosition([x, y, z]: Vec3) {
// 		const {min, max} = this.#boundaryReport()
// 		return [
// 			scalar.clamp(x, min.x, max.x),
// 			scalar.clamp(y, min.y, max.y),
// 			scalar.clamp(z, min.z, max.z),
// 		] as Vec3
// 	}
//
// 	#spawnTile(tile: Tile, place: Place) {
// 		const {blocks} = this.options
//
// 		const ingestInstance = (level: number, instance: TransformNode) => {
// 			const [worldX,,worldZ] = this.localize(place)
// 			const worldY = (level - 1) * blocks.height
// 			instance.position.set(worldX, worldY, worldZ)
// 			this.#instances.push(instance)
// 			for (const mesh of instance.getChildMeshes())
// 				this.#blocks.set(mesh, place)
// 		}
//
// 		const spawnBlock = (level: number) => {
// 			const instance = (
// 				level === 1 ? blocks.instancers.box.levelOne.normal() :
// 				level === 2 ? blocks.instancers.box.levelTwo.normal() :
// 				blocks.instancers.box.levelThree.normal()
// 			)
// 			ingestInstance(level, instance)
// 		}
//
// 		const spawnRamp = (level: number) => {
// 			const instance = level === 2
// 				? blocks.instancers.ramp.levelTwo.normal()
// 				: blocks.instancers.ramp.levelThree.normal()
// 			const rotation = (
// 				tile.ramp === "north" ? -90 :
// 				tile.ramp === "east" ? -180 :
// 				tile.ramp === "south" ? 90 :
// 				0
// 			)
// 			instance.rotationQuaternion = Quaternion.RotationYawPitchRoll(
// 				scalar.radians.from.degrees(rotation),
// 				0,
// 				0,
// 			)
// 			ingestInstance(level, instance)
// 		}
//
// 		// spawn blocks underneath
// 		if (tile.elevation > 1)
// 			spawnBlock(1)
// 		if (tile.elevation > 2)
// 			spawnBlock(2)
// 		if (tile.elevation > 3)
// 			spawnBlock(3)
//
// 		// spawn block on top
// 		if (tile.ramp)
// 			spawnRamp(tile.elevation)
// 		else
// 			spawnBlock(tile.elevation)
// 	}
//
// 	#spawnUnit(unit: Unit, place: Place) {
// 		const {unitInstancers} = this.options
// 		const instancer = unitInstancers.get(unit.constructor as any)
// 		if (!instancer) throw new Error(`instancer not found for unit ${unit.constructor.name}`)
// 		const instance = instancer()
// 		instance.scaling = new Vector3().setAll(1.5)
// 		if (unit.team === 1)
// 			instance.rotationQuaternion = Quaternion.RotationYawPitchRoll(
// 				scalar.radians.from.degrees(180),
// 				0,
// 				0,
// 			)
// 		instance.position.set(...this.localize(place))
// 		this.#instances.push(instance)
// 	}
//
// 	render() {
// 		const {grid, placements} = this.options
// 		this.dispose()
//
// 		for (const {tile, place} of grid.loop())
// 			this.#spawnTile(tile, place)
//
// 		for (const {unit, place} of placements.loop())
// 			this.#spawnUnit(unit, place)
// 	}
//
// 	grab(event: PointerEvent) {
// 		const {pickedMesh} = this.options.world.scene.pick(
// 			event.clientX,
// 			event.clientY,
// 			mesh => this.#blocks.has(mesh),
// 		)
// 		if (pickedMesh)
// 			return this.#blocks.get(pickedMesh)!
// 	}
//
// 	dispose() {
// 		for (const instance of this.#instances)
// 			instance.dispose()
// 		this.#instances = []
// 		this.#blocks.clear()
// 	}
// }
//
