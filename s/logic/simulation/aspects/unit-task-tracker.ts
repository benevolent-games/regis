
import {mapGuarantee} from "@benev/slate"
import {Map2} from "../../../tools/map2.js"
import {Repeatability} from "../../../config/units/traits.js"
import {Archetype, Aspects} from "../../../config/units/archetype.js"

export type TaskKind = Task.Any["kind"]

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

export class UnitTaskTracker {
	#memory = new Map2<number, Task.Any[]>()

	#obtain(id: number) {
		return mapGuarantee(this.#memory, id, () => [])
	}

	recordTask(id: number, task: Task.Any) {
		this.#obtain(id).push(task)
	}

	possibilities(
			id: number,
			archetype: Archetype,
			targetId: number | undefined,
		) {

		const {multitasker, armed, healer} = archetype
		const tasks = this.#obtain(id)

		const spawning = tasks.some(t => t.kind === "spawned")

		if (spawning)
			return {
				spawning: true,
				exhausted: true,
				available: {attack: 0, heal: 0, move: 0},
			}

		const available = {
			attack: countAvailability(
				"attack", tasks, multitasker, armed?.repeatable, targetId,
			),
			heal: countAvailability(
				"heal", tasks, multitasker, healer?.repeatable, targetId,
			),
			move: countAvailability(
				"move", tasks, multitasker, undefined, targetId,
			),
		}

		const exhausted = 0 === (
			available.attack +
			available.heal +
			available.move
		)

		return {spawning, exhausted, available}
	}
}

//////////////////////////////
//////////////////////////////

function getUniqueKinds(tasks: Task.Any[]) {
	const kinds = new Set<TaskKind>()
	for (const task of tasks)
		kinds.add(task.kind)
	return kinds
}

function getUniqueTargetIds(tasks: Task.Any[]) {
	const targetIds = new Set<number>()
	for (const task of tasks)
		if ("targetId" in task)
			targetIds.add(task.targetId)
	return targetIds
}

function filterKind<T extends Task.Any>(
		tasks: Task.Any[],
		kind: TaskKind,
	) {
	return tasks.filter(t => t.kind === kind) as T[]
}

function countAvailability(
		kind: TaskKind,
		tasks: Task.Any[],
		multitasker: Aspects["multitasker"] | undefined,
		repeatable: Repeatability | undefined,
		targetId: number | undefined,
	) {

	// check if multitasking is exceeded for this task kind
	const multiLimit = multitasker?.count ?? 1
	const kinds = getUniqueKinds(tasks)
	kinds.add(kind)
	const multiExhausted = kinds.size > multiLimit
	if (multiExhausted)
		return 0

	// check if repeatability is exhausted
	const repeatLimit = repeatable?.count ?? 1
	const occurances = filterKind(tasks, kind).length
	if (!repeatable?.focusFire && targetId !== undefined) {
		const targetIds = getUniqueTargetIds(tasks)
		const alreadyTargeted = targetIds.has(targetId)
		return alreadyTargeted
			? 0
			: 1
	}
	else {
		return Math.max(0, repeatLimit - occurances)
	}
}

