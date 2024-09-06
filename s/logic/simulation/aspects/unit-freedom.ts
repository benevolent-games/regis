
import {mapGuarantee} from "@benev/slate"
import {Map2} from "../../../tools/map2.js"
import {Archetype} from "../../../config/units/archetype.js"
import {Repeatability} from "../../../config/units/traits.js"

export namespace Task {
	export type Move = {
		kind: "move"
	}
	export type Attack = {
		kind: "attack"
		target: number
	}
	export type Heal = {
		kind: "heal"
		target: number
	}
	export type Summon = {
		kind: "summon"
	}
	export type Any = Move | Attack | Heal | Summon
}

export class UnitFreedom {
	#memory = new Map2<number, Task.Any[]>()

	#obtain(id: number) {
		return mapGuarantee(this.#memory, id, () => [])
	}

	recordTask(id: number, task: Task.Any) {
		this.#obtain(id).push(task)
	}

	clear() {
		this.#memory.clear()
	}

	report(id: number, archetype: Archetype) {
		const {multitasker} = archetype

		const kinds = new Set<Task.Any["kind"]>()
		const tasks = this.#obtain(id)

		for (const task of tasks)
			kinds.add(task.kind)

		function getKind<T extends Task.Any>(kind: Task.Any["kind"]) {
			return tasks.filter(t => t.kind === kind) as T[]
		}

		const canAct = kinds.size < (multitasker?.count ?? 1)
		if (!canAct)
			return null

		function checkRepeatability<T extends {target: any}>(
				repeatable: Repeatability | undefined,
				tasks: T[],
			) {
			const targets = new Set<any>(tasks.map(t => t.target))
			const available = (repeatable?.count ?? 1) - tasks.length
			return {
				available,
				checkFocusFire: (target: any) => !targets.has(target)
			}
		}

		const heal = checkRepeatability(archetype?.healer?.repeatable, getKind<Task.Heal>("heal"))
		const attack = checkRepeatability(archetype?.armed?.repeatable, getKind<Task.Attack>("attack"))

		return {
			canHeal: (patientId: number) => (heal.available > 0) && heal.checkFocusFire(patientId),
			canAttack: (victimId: number) => (attack.available > 0) && attack.checkFocusFire(victimId),
			available: {
				heals: heal.available,
				attacks: attack.available,
				moves: (() => {
					const tasks = getKind("move")
					return 1 - tasks.length
				})(),
				summons: (() => {
					const {summoner} = archetype
					const tasks = getKind<Task.Summon>("summon")
					return (summoner?.limit ?? 1) - tasks.length
				})(),
			},
		}
	}
}

// export class UnitFreedom {
// 	#map = new Map<number, ActionRecord>()
//
// 	constructor() {}
//
// 	#obtain(id: number) {
// 		return mapGuarantee(this.#map, id, () => ({
// 			moves: 0,
// 			attacks: 0,
// 			heals: 0,
// 			spawning: false,
// 		}))
// 	}
//
// 	report(id: number, archetype: Archetype): FreedomReport {
// 		const {moves, attacks, heals, spawning} = this.#obtain(id)
// 		const sum = moves + attacks
// 		const canAct = !spawning && sum < archetype.actionCap
// 		return {
// 			canAct,
// 			canMove: canAct && moves < (archetype.move?.cap ?? 0),
// 			canAttack: canAct && attacks < (archetype.attack?.cap ?? 0),
// 			canHeal: canAct && heals < (archetype.heal?.cap ?? 0),
// 		}
// 	}
//
// 	countMove(id: number) {
// 		const record = this.#obtain(id)
// 		record.moves += 1
// 	}
//
// 	countAttack(id: number) {
// 		const record = this.#obtain(id)
// 		record.attacks += 1
// 	}
//
// 	countSpawning(id: number) {
// 		const record = this.#obtain(id)
// 		record.spawning = true
// 	}
//
// 	countHeal(id: number) {
// 		const record = this.#obtain(id)
// 		record.heals += 1
// 	}
//
// 	clear() {
// 		this.#map.clear()
// 	}
// }
//
