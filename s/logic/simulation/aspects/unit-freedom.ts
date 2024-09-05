
import {mapGuarantee} from "@benev/slate"
import {Archetype} from "../../../config/units/archetype.js"

export type ActionRecord = {
	moves: number
	attacks: number
	heals: number
	spawning: boolean
}

export type FreedomReport = {
	canAct: boolean
	canMove: boolean
	canAttack: boolean
	canHeal: boolean
}

export class UnitFreedom {
	#map = new Map<number, ActionRecord>()

	constructor() {}

	#obtain(id: number) {
		return mapGuarantee(this.#map, id, () => ({
			moves: 0,
			attacks: 0,
			heals: 0,
			spawning: false,
		}))
	}

	report(id: number, archetype: Archetype): FreedomReport {
		const {moves, attacks, heals, spawning} = this.#obtain(id)
		const sum = moves + attacks
		const canAct = !spawning && sum < archetype.actionCap
		return {
			canAct,
			canMove: canAct && moves < (archetype.move?.cap ?? 0),
			canAttack: canAct && attacks < (archetype.attack?.cap ?? 0),
			canHeal: canAct && heals < (archetype.heal?.cap ?? 0),
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

	countHeal(id: number) {
		const record = this.#obtain(id)
		record.heals += 1
	}

	clear() {
		this.#map.clear()
	}
}

