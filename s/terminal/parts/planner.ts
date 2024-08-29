//
// import {Vec2} from "@benev/toolbox"
// import {Trashbin} from "@benev/slate"
// import {TransformNode} from "@babylonjs/core"
//
// import {Assets} from "./assets.js"
// import {Selectacon} from "./selectacon.js"
// import {Agent} from "../../logic/agent.js"
// import {SubmitTurnFn} from "../../logic/arbiter.js"
// import {Choice, UnitKind} from "../../logic/state.js"
// import {TurnTracker} from "../../logic/simulation/aspects/turn-tracker.js"
// import {calculateMovement} from "../../logic/simulation/aspects/moving.js"
// import {Denial, WrongTeamDenial} from "../../logic/simulation/aspects/denials.js"
// import { makeProposers, Proposers } from "../../logic/simulation/proposer/make-proposers.js"
// import { UnitFreedom2 } from "../../logic/simulation/aspects/unit-freedom.js"
//
// /** interface for the user to sketch a plan for their turn */
// export class Planner {
// 	#planbin = new Trashbin()
// 	#renderbin = new Trashbin()
//
// 	proposers: Proposers
// 	choices: Choice.Any[] = []
//
// 	constructor(private options: {
// 			agent: Agent
// 			assets: Assets
// 			selectacon: Selectacon
// 			turnTracker: TurnTracker
// 			submitTurn: SubmitTurnFn
// 		}) {
//
// 		const {agent, turnTracker} = this.options
// 		this.proposers = makeProposers({
// 			agent,
// 			turnTracker,
// 			freedom: new UnitFreedom2(),
// 		})
//
// 		this.#planbin.disposer(
// 			options.selectacon.selection.on(() => this.render())
// 		)
// 	}
//
// 	reset() {
// 		const {agent, turnTracker} = this.options
// 		this.proposers = makeProposers({
// 			agent,
// 			turnTracker,
// 			freedom: new UnitFreedom2(),
// 		})
// 		this.choices = []
// 	}
//
// 	#instantiate(fn: () => TransformNode, place: Vec2) {
// 		const {agent} = this.options
// 		const instance = fn()
// 		const position = agent.coordinator.toPosition(place)
// 		instance.position.set(...position)
// 		this.#renderbin.disposable(instance)
// 		return instance
// 	}
//
// 	#splitty({}: {}) {}
//
// 	consider = (() => {
// 		const {proposer, options: {assets}} = this
//
// 		const splitty = <P extends Proposal, R>(proposal: P, fns: {
// 				isDenied: () => R
// 				isWrongTeam: () => R
// 				isValid: () => R
// 			}) => {
// 			if (proposal instanceof WrongTeamDenial)
// 				return fns.isWrongTeam()
// 			else if (proposal instanceof Denial)
// 				return fns.isDenied()
// 			else
// 				return fns.isValid()
// 		}
//
// 		return {
//
// 			spawn: (place: Vec2, unitKind: UnitKind) => {
// 				const choice: Choice.Spawn = {
// 					kind: "spawn",
// 					place,
// 					unitKind,
// 				}
//
// 				const proposal = proposer.propose.spawn(choice)
//
// 				if (proposal instanceof WrongTeamDenial)
// 					return {
// 						instantiateIndicator: () => this.#instantiate(assets.indicators.libertyPattern, place),
// 						attempt: () => false,
// 					}
// 				else if (proposal instanceof Denial)
// 					return {
// 						instantiateIndicator: () => this.#instantiate(assets.indicators.libertyAction, place),
// 						attempt: () => this.attempt(choice),
// 					}
//
// 				const lol = splitty(report, {
// 					isDenied: () => null,
// 					isWrongTeam: () => ({
// 						instantiateIndicator: () => this.#instantiate(assets.indicators.libertyPattern, place),
// 					}),
// 					isValid: () => ({
// 						instantiateIndicator: () => this.#instantiate(assets.indicators.libertyAction, place),
// 						attempt: () => this.attempt({kind: "spawn", unitKind, place}),
// 					}),
// 				})
//
// 				if ((report instanceof Denial) && !(report instanceof WrongTeamDenial))
// 					return null
//
// 				const asset = (report instanceof WrongTeamDenial)
// 					? assets.indicators.libertyPattern
// 					: assets.indicators.libertyAction
//
// 				return {
// 					instantiateIndicator: () => this.#instantiate(asset, place),
// 					attempt: () => this.attempt({kind: "spawn", unitKind, place}),
// 				}
// 			},
//
// 			movement: () => {},
// 		}
// 	})()
//
// 	render() {
// 		this.#renderbin.dispose()
// 		const {proposer} = this
// 		const {agent, selectacon, assets} = this.options
// 		const selection = selectacon.selection.value
//
// 		if (selection) {
//
// 			// render spawning liberties
// 			if (selection.kind === "roster") {
// 				for (const {place} of agent.tiles.list()) {
// 				}
// 			}
//
// 			// render movement liberties
// 			if (selection.kind === "tile") {
// 				const unit = agent.units.at(selection.place)
// 				if (unit) {
// 					const archetype = agent.archetype(unit.kind)
// 					const {canMove} = proposer.unitFreedom.report(unit.id, archetype)
// 					if (canMove) {
// 						for (const {place} of agent.tiles.list()) {
// 							const movement = calculateMovement({
// 								agent,
// 								source: selection.place,
// 								target: place,
// 							})
// 							if (movement) {
// 								const report = proposer.propose.movement({
// 									kind: "movement",
// 									source: movement.source,
// 									path: movement.path,
// 								})
// 								if (report instanceof WrongTeamDenial)
// 									this.#instantiate(assets.indicators.libertyPattern, place)
// 								else if (!(report instanceof Denial))
// 									this.#instantiate(assets.indicators.libertyAction, place)
// 							}
// 						}
// 					}
// 				}
// 			}
// 		}
// 	}
//
// 	attempt(choice: Choice.Any) {
// 		const {agent} = this.options
// 		if (agent.conclusion)
// 			return false
//
// 		const proposer = this.proposers[choice.kind]
// 		const proposal = proposer(choice as any)
// 		if (proposal instanceof Denial)
// 			return false
//
// 		this.choices.push(choice)
// 		proposal()
// 		agent.stateRef.publish()
// 		return true
// 	}
//
// 	executePlan() {
// 		this.options.submitTurn({choices: this.choices})
// 		this.reset()
// 	}
//
// 	dispose() {
// 		this.#renderbin.dispose()
// 		this.#planbin.dispose()
// 	}
// }
//
