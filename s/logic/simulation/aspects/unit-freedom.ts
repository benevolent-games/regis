
import {mapGuarantee} from "@benev/slate"
import {Map2} from "../../../tools/map2.js"
import {Archetype} from "../../../config/units/archetype.js"
import {Repeatability} from "../../../config/units/traits.js"

export namespace Task {

	// this unit has just been spawned this turn
	export type Spawned = {
		kind: "spawned"
	}

	export type Move = {
		kind: "move"
	}

	export type Attack = {
		kind: "attack"
		targetId: number
	}

	export type Heal = {
		kind: "heal"
		targetId: number
	}

	export type Any = Spawned | Move | Attack | Heal
}

export class UnitFreedom {
	#memory = new Map2<number, Task.Any[]>()

	#obtain(id: number) {
		return mapGuarantee(this.#memory, id, () => [])
	}

	recordTask(id: number, task: Task.Any) {
		this.#obtain(id).push(task)
	}

	/** the memory of unit freedom should be cleared every turn */
	clear() {
		this.#memory.clear()
	}

	query(id: number, archetype: Archetype) {
		const {multitasker} = archetype

		const kinds = new Set<Task.Any["kind"]>()
		const tasks = this.#obtain(id)

		for (const task of tasks)
			kinds.add(task.kind)

		function getKind<T extends Task.Any>(kind: Task.Any["kind"]) {
			return tasks.filter(t => t.kind === kind) as T[]
		}

		const justSpawnedIn = tasks.some(t => t.kind === "spawned")
		const happyMultitasking = kinds.size <= (multitasker?.count ?? 1)
		if (justSpawnedIn || !happyMultitasking)
			return null

		function checkRepeatability<T extends {targetId: any}>(
				repeatable: Repeatability | undefined,
				tasks: T[],
			) {
			const targets = new Set<any>(tasks.map(t => t.targetId))
			const available = (repeatable?.count ?? 1) - tasks.length
			return {
				available,
				checkFocusFire: (target: any) => {
					return repeatable?.focusFire
						? true
						: !targets.has(target)
				}
			}
		}

		const heal = checkRepeatability(
			archetype?.healer?.repeatable, getKind<Task.Heal>("heal")
		)

		const attack = checkRepeatability(
			archetype?.armed?.repeatable, getKind<Task.Attack>("attack")
		)

		return {
			canHeal: (patientId: number) => {
				return (heal.available > 0) && heal.checkFocusFire(patientId)
			},
			canAttack: (victimId: number) => {
				return (attack.available > 0) && attack.checkFocusFire(victimId)
			},
			available: {
				heals: heal.available,
				attacks: attack.available,
				moves: (() => {
					const tasks = getKind("move")
					return 1 - tasks.length
				})(),
			},
		}
	}
}

