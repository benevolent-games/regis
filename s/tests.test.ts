
import {Suite, expect} from "cynic"
import {Director} from "./director/parts/director.js"
import { makeClientsideApi } from "./director/apis/clientside.js"

export default <Suite>{
	async lol() {

		const director = new Director()
		const serverside = director.acceptClient(clientside)

		const clientside = makeClientsideApi(serverside, {})
	},
}

