
import {World} from "../parts/world.js"
import {BoardGlb} from "./glbs/board.js"
import {UnitsGlb} from "./glbs/units.js"
import {IndicatorsGlb} from "./glbs/indicators.js"

export type AssetUrls = {
	board: string
	units: string
	indicators: string
}

export class Assets {
	static async load(world: World, urls: AssetUrls) {
		const [boardContainer, unitsContainer, indicatorsContainer] = await Promise.all([
			world.loadContainer(urls.board),
			world.loadContainer(urls.units),
			world.loadContainer(urls.indicators),
		])
		const indicatorsGlb = new IndicatorsGlb(indicatorsContainer)
		const boardGlb = new BoardGlb(boardContainer)
		const unitsGlb = new UnitsGlb(unitsContainer, boardGlb)

		// console.log("indicators", [...indicatorsGlb.props.keys()])

		return new this(boardGlb, unitsGlb, indicatorsGlb)
	}

	constructor(
		public board: BoardGlb,
		public units: UnitsGlb,
		public indicators: IndicatorsGlb,
	) {}

	dispose() {
		this.board.container.dispose()
		this.units.container.dispose()
		this.indicators.container.dispose()
	}
}

