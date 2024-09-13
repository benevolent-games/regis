
import {Trashbin} from "@benev/slate"
import {Prop, vec3} from "@benev/toolbox"

import {PlannerOptions} from "./types.js"
import {constants} from "../../constants.js"
import {Cell, TileCell} from "../parts/selectacon.js"
import {Choice, ChoiceKind} from "../../logic/state.js"
import {doFirstValidThing} from "../../tools/do-first-valid-thing.js"
import {autoAttacks} from "../../logic/simulation/aspects/auto-attacks.js"
import {Rebuke, SoftRebuke, Judgement} from "../../logic/activities/types.js"
import {Activities, ActivityGroup} from "../../logic/activities/activities.js"

/** ui for creating a tentative turn plan, which is a list of choices, which may be canceled or executed */
export class Planner {
	choices: Choice.Any[] = []
	activities: Activities

	#renderbin = new Trashbin()

	constructor(private options: PlannerOptions) {
		this.activities = new Activities(options)
	}

	reset() {
		this.choices = []
		this.activities = new Activities(this.options)
		this.options.agent.publishStateChange()
	}

	schedule = (judgement: Judgement) => {
		this.choices.push(judgement.choice)
		judgement.commit()
		this.options.agent.publishStateChange()
	}

	executePlan() {
		const {choices, activities, options} = this
		if (options.getGameStatus() === "gameplay") {
			const autoChoices = autoAttacks(options.agent, activities, {choices})
			options.submitTurn({choices: [...choices, ...autoChoices]})
			this.reset()
		}
	}

	render() {
		this.#renderbin.dispose()
		const {agent, assets, selectacon, turnTracker, spawnGhosts} = this.options

		spawnGhosts.resetPossibleGhosts()
		const {indicators} = assets
		const selected = selectacon.selection.value

		for (const {place} of agent.tiles.list()) {
			const ourTeam = turnTracker.teamId
			const target: TileCell = {
				place,
				kind: "tile",
				position: agent.coordinator.toPosition(place),
			}

			const indicate = (instance: Prop) => {
				const {agent} = this.options
				const position = vec3.add(
					agent.coordinator.toPosition(place),
					[0, constants.indicators.verticalOffsets.normalIndicators, 0],
				)
				instance.position.set(...position)
				this.#renderbin.disposable(instance)
				return instance
			}

			this.navigateActionSpace({
				target,
				selected,
				on: {
					heal: indicatorResponses({
						actionable: () => indicate(indicators.liberty.heal(ourTeam)),
						pattern: () => indicate(indicators.liberty.heal(null)),
					}),
					recruit: indicatorResponses({
						pattern: () => indicate(indicators.liberty.recruit(null)),
						actionable: () => {
							indicate(indicators.liberty.recruit(ourTeam))
							if (selected?.kind === "roster")
								spawnGhosts.setPossibleGhost({
									place,
									teamId: turnTracker.teamId,
									unitKind: selected.unitKind,
								})
						},
					}),
					attack: indicatorResponses({
						actionable: () => indicate(indicators.liberty.attack(ourTeam)),
						pattern: () => indicate(indicators.liberty.attack(null)),
					}),
					move: indicatorResponses({
						actionable: () => indicate(indicators.liberty.move(ourTeam)),
						pattern: () => indicate(indicators.liberty.move(null)),
					}),
				},
			})
		}
	}

	navigateActionSpace({target, selected, on}: {
			target: Cell | null
			selected: Cell | null
			on: {[K in ChoiceKind]: (judgement: Rebuke | Judgement) => void}
		}) {

		const {agent} = this.options
		const {activities} = this

		const consider = <K extends ChoiceKind>(
				kind: K,
				...args: Parameters<ActivityGroup[K]["propose"]>
			) => {

			const {propose, judge} = activities.get(kind)
			const proposal = propose(...args)

			if (proposal instanceof Rebuke) {
				on[kind](proposal)
				return false
			}

			const judgement = judge(proposal.choice)
			on[kind](judgement)

			return !(judgement instanceof Rebuke)
		}

		// focusing on a tile cell
		if (target?.kind === "tile") {

			// roster unit is already selected
			if (
				selected &&
				selected.kind === "roster" &&
				selected.teamId === agent.activeTeamId) {
					consider("recruit", target.place, selected.unitKind)
			}

			// a tile is already selected
			else if (selected && selected.kind === "tile") {
				const a = selected.place
				const b = target.place
				doFirstValidThing([
					() => consider("heal", a, b),
					() => consider("attack", a, b),
					() => consider("move", a, b)
				])
			}
		}
	}

	dispose() {
		this.#renderbin.dispose()
	}
}

function indicatorResponses({pattern, actionable}: {
		pattern: () => void
		actionable: () => void
	}) {

	return (judgement: Rebuke | Judgement) => {
		if (judgement instanceof SoftRebuke)
			return pattern()

		if (judgement instanceof Rebuke)
			return undefined

		return actionable()
	}
}

