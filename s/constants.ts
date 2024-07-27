
import {AssetUrls} from "./terminal/parts/assets.js"

export const constants = {
	urls: {
		envmap: "/assets/studiolights.env",
		assets: {
			board: "/assets/glbs/board-dark.glb",
			units: "/assets/glbs/units-dark.glb",
			indicators: "/assets/glbs/indicators-standard.glb",
		} satisfies AssetUrls,
	},
	block: {
		size: 2,
		height: 1,
		verticalOffset: -1,
	},
}

