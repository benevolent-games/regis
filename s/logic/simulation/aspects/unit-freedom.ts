
import {mapGuarantee} from "@benev/slate"
import {UnitArchetype} from "../../state.js"

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

export class UnitFreedom {
	#map = new Map<number, ActionRecord>()

	constructor() {}

	#obtain(id: number) {
		return mapGuarantee(this.#map, id, () => ({
			moves: 0,
			attacks: 0,
			spawning: false,
		}))
	}

	report(id: number, archetype: UnitArchetype): FreedomReport {
		const {moves, attacks, spawning} = this.#obtain(id)
		const sum = moves + attacks
		const action = !spawning && sum < archetype.actionCap
		return {
			canAct: action,
			canMove: action && moves < (archetype.move?.cap ?? 0),
			canAttack: action && attacks < (archetype.attack?.cap ?? 0),
		}
	}

	countMove(id: number) {
		const record = this.#obtain(id)
		record.moves += 1
	}

	countAttack(id: number) {
		const record = this.#obtain(id)
		record.attacks += 1
	}

	countSpawning(id: number) {
		const record = this.#obtain(id)
		record.spawning = true
	}

	clear() {
		this.#map.clear()
	}
}

