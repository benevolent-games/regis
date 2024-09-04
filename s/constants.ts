
import {AssetUrls} from "./terminal/parts/assets.js"

export const constants = {
	urls: {
		envmap: "/assets/studiolights.env",
		assets: {
			board: "/assets/glbs/board-dark5.glb",
			units: "/assets/glbs/units-dark3.glb",
			indicators: "/assets/glbs/indicators-standard15.glb",
		} satisfies AssetUrls,
	},
	block: {
		size: 2,
		height: 1,
		verticalOffset: 0,
	},
	indicators: {
		verticalOffsets: {
			normalIndicators: 0.03,
			claimLayering: 0.005,
		},
	},
	net: {
		timeout: 10_000,
		reconnectDelay: 10_000,
		reportingDelay: 5_000,
	},
	icons: {
		resource: "🍞",
		// resource: "💎",
	},
}

