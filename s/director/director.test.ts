
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

		client1.clientside.game.start = (() => {
			const {start} = client1.clientside.game
			return async inputs => {
				started = true
				return await start(inputs)
			}
		})()

		await Promise.all([
			client1.serverside.matchmaking.joinQueue(),
			client2.serverside.matchmaking.joinQueue(),
		])

		expect(started).ok()

		const {worldStats, clientStatus} = await client1.serverside.report()
		expect(worldStats.games).equals(1)
		expect(worldStats.players).equals(2)
		expect(worldStats.gamesInLastHour).equals(1)
		expect(clientStatus).equals("queued")
	},
}

