
import {Suite, expect} from "cynic"
import {expose, remote} from "renraku"

import {Director} from "./director.js"
import {makeClientside} from "./apis/clientside.js"
import {ClientMachinery} from "./plumbing/machinery.js"

export function testSituation() {
	const director = new Director()
	return {
		newClient() {
			const clientside = makeClientside(new ClientMachinery(), () => serverside)
			const remoteClientside = remote<typeof clientside>(expose(() => clientside))
			const {serverside} = director.newPerson(remoteClientside, () => {})
			return {clientside, serverside}
		},
	}
}

export default <Suite>{
	async "two players can start a match together"() {
		const situation = testSituation()
		const client1 = situation.newClient()
		const client2 = situation.newClient()

		let initialized = false

		client1.clientside.game.initialize = (() => {
			const {initialize} = client1.clientside.game
			return async memo => {
				initialized = true
				return await initialize(memo)
			}
		})()

		await client1.serverside.matchmaking.joinQueue(),
		expect((await client1.serverside.report()).personStatus).equals("queued")

		await client2.serverside.matchmaking.joinQueue(),
		expect(initialized).ok()

		const {worldStats, personStatus} = await client1.serverside.report()
		expect(worldStats.games).equals(1)
		expect(worldStats.players).equals(2)
		expect(worldStats.gamesInLastHour).equals(1)
		expect(personStatus).equals("gaming")
	},
}

