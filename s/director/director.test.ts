
import {Suite, expect} from "cynic"
import {Director} from "./director.js"
import {makeClientside} from "./apis/clientside.js"

export function testSituation() {
	const director = new Director()
	return {
		newClient() {
			const clientside = makeClientside(() => serverside, {})
			const {serverside} = director.acceptClient(clientside, () => {})
			return {clientside, serverside}
		},
	}
}

export default <Suite>{
	async "two players can start a match together"() {
		const situation = testSituation()
		const client1 = situation.newClient()
		const client2 = situation.newClient()

		let started = false

		client1.clientside.matchStart = (() => {
			const {matchStart} = client1.clientside
			return async id  => {
				started = true
				return await matchStart(id)
			}
		})()

		client1.serverside.joinQueue()
		client2.serverside.joinQueue()

		expect(started).ok()
	},
}

