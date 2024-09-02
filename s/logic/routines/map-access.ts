
import {mapPool} from "../../map-pool.js"
import {MapSpec} from "../ascii/types.js"

export function randomMap(): MapSpec {
	// return getMap("chestersField")

	const maplist = Object.entries(mapPool)
	const index = Math.floor(Math.random() * maplist.length)
	const [name, spec] = maplist[index]
	return {
		name,
		ascii: spec.ascii,
		author: spec.author,
	}

}

export function getMap(name: keyof typeof mapPool): MapSpec {
	return {
		name,
		...mapPool[name],
	}
}

