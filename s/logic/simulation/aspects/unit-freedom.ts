
import {mapGuarantee} from "@benev/slate"
import {UnitArchetype} from "../../state.js"

// export class UnitFreedom {
// 	#map = new Map<string, {freedom: boolean}>()
//
// 	#obtain(id: string) {
// 		return mapGuarantee(this.#map, id, () => ({freedom: true}))
// 	}
//
// 	hasFreedom(id: string) {
// 		return this.#obtain(id).freedom
// 	}
//
// 	revokeFreedom(id: string) {
// 		this.#obtain(id).freedom = false
// 	}
// }

export type ActionRecord = {
	moves: number
	attacks: number
	spawning: boolean
}

export type FreedomReport = {
	canAct: boolean
	canMove: boolean
	canAttack: boolean
}

export class UnitFreedom2 {
	#map = new Map<string, ActionRecord>()

	constructor() {}

	#obtain(id: string) {
		return mapGuarantee(this.#map, id, () => ({
			moves: 0,
			attacks: 0,
			spawning: false,
		}))
	}

	report(id: string, archetype: UnitArchetype): FreedomReport {
		const {moves, attacks, spawning} = this.#obtain(id)
		const sum = moves + attacks
		const action = !spawning && sum < archetype.actionCap
		return {
			canAct: action,
			canMove: action && moves < (archetype.move?.cap ?? 0),
			canAttack: action && attacks < (archetype.attack?.cap ?? 0),
		}
	}

	countMove(id: string) {
		const record = this.#obtain(id)
		record.moves += 1
	}

	countAttack(id: string) {
		const record = this.#obtain(id)
		record.attacks += 1
	}

	countSpawning(id: string) {
		const record = this.#obtain(id)
		record.spawning = true
	}
}

