
import {vec2, Vec2} from "@benev/toolbox"

import {Agent} from "../../agent.js"
import {VerticalCapability} from "../../state.js"
import {getCardinalNeighbors, isValidStep} from "./navigation.js"
import {isVerticallyCompatible} from "./verticality.js"

export type PathfindOptions = {
	agent: Agent
	source: Vec2
	target: Vec2
	verticality: VerticalCapability
}

type Pathnode = {
	place: Vec2
	cost: number
	heuristic: number
	parent: Pathnode | null
}

/** a nice a-star pathfinder */
export function pathfind({
		agent,
		source,
		target,
		verticality,
	}: PathfindOptions): Vec2[] | null {

	const closedNodes: Pathnode[] = []
	const openNodes: Pathnode[] = [{
		place: source,
		heuristic: 0,
		cost: 0,
		parent: null,
	}]

	while (openNodes.length > 0) {
		openNodes.sort((a, b) => (a.cost + a.heuristic) - (b.cost + b.heuristic))

		const current = openNodes.shift()!
		closedNodes.push(current)

		// done
		if (vec2.equal(current.place, target))
			return consolidatePath(current)

		for (const nextPlace of getNextValidSteps(agent, verticality, current.place)) {
			if (closedNodes.some(node => vec2.equal(node.place, nextPlace)))
				continue
			const cost = current.cost + 1
			const existingNode = openNodes.find(node => vec2.equal(node.place, nextPlace))
			if (existingNode) {
				if (cost < existingNode.cost) {
					existingNode.cost = cost
					existingNode.parent = current
				}
			}
			else {
				openNodes.push({
					parent: current,
					place: nextPlace,
					cost: cost,
					heuristic: manhattanDistance(nextPlace, target),
				})
			}
		}
	}

	return null
}

function manhattanDistance([aX, aY]: Vec2, [bX, bY]: Vec2) {
	return Math.abs(aX - bX) + Math.abs(aY - bY)
}

function consolidatePath(node: Pathnode) {
	const path: Pathnode[] = [node]
	while (node.parent) {
		path.push(node.parent)
		node = node.parent
	}
	return path
		.toReversed()
		.map(n => n.place)
		.slice(1)
}

function getNextValidSteps(
		agent: Agent,
		verticality: VerticalCapability,
		placeA: Vec2,
	) {

	return getCardinalNeighbors(agent, placeA)
		.filter(placeB => isValidStep(agent, verticality, placeA, placeB))
}

