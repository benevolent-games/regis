
import {mapPool} from "../../map-pool.js"

export function randomMap() {
	const maplist = Object.entries(mapPool)
	const index = Math.floor(Math.random() * maplist.length)
	const [name, ascii] = maplist[index]
	return {name, ascii}
}

