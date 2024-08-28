
import {AssetUrls} from "./terminal/parts/assets.js"

export const constants = {
	urls: {
		envmap: "/assets/studiolights.env",
		assets: {
			board: "/assets/glbs/board-dark.glb",
			units: "/assets/glbs/units-dark1.glb",
			indicators: "/assets/glbs/indicators-standard8.glb",
		} satisfies AssetUrls,
	},
	block: {
		size: 2,
		height: 1,
		verticalOffset: -1,
	},
	net: {
		timeout: 10_000,
		reconnectDelay: 10_000,
		reportingDelay: 5_000,
	},
}

