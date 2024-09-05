
import {Map2} from "../../../tools/map2.js"
import {Glb, Instancer} from "../utils/glb.js"
import {TeamId} from "../../../logic/state.js"
import {ResourceLevel} from "../../../config/game/types.js"
import {UnitKind, unitsConfig} from "../../../config/units.js"

const teamIds = [0, 1, null]

function teamName(team: TeamId) {
	return team === null
		? "neutral"
		: `team${team + 1}`
}

export class IndicatorsGlb extends Glb {
	aura = this.instancer("aura")
	selection = this.instancer(`selected`)

	#teamInstancers(namer: (teamId: TeamId) => string) {
		const instancers = new Map2<TeamId, Instancer>()
		for (const teamId of teamIds)
			instancers.set(teamId, this.instancer(namer(teamId)))
		return (teamId: TeamId) => instancers.require(teamId)()
	}

	// TODO remove this and settle on new indicators scheme
	#tempHack(entries: [TeamId, Instancer][]) {
		const instancers = new Map2<TeamId, Instancer>(entries)
		return (teamId: TeamId) => instancers.require(teamId)()
	}

	hover = this.#teamInstancers(teamId => `hover-${teamName(teamId)}`)

	liberty = {
		// // TODO converge on this new indicators scheme
		// move: this.#teamInstancers(teamId => `liberty-move-${teamName(teamId)}`),
		// attack: this.#teamInstancers(teamId => `liberty-attack-${teamName(teamId)}`),
		// spawn: this.#teamInstancers(teamId => `liberty-spawn-${teamName(teamId)}`),
		// heal: this.#teamInstancers(teamId => `liberty-heal-${teamName(teamId)}`),

		move: this.#teamInstancers(teamId => `liberty-action-${teamName(teamId)}`),

		attack: this.#tempHack([
			[null, this.instancer(`attack`)],
			[0, this.instancer(`attack`)],
			[1, this.instancer(`attack`)],
		]),

		spawn: this.#tempHack([
			[null, this.instancer(`liberty-action-neutral`)],
			[0, this.instancer(`liberty-action-team1`)],
			[1, this.instancer(`liberty-action-team2`)],
		]),

		heal: this.#tempHack([
			[null, this.instancer(`liberty-action-neutral`)],
			[0, this.instancer(`liberty-action-team1`)],
			[1, this.instancer(`liberty-action-team2`)],
		]),
	}

	claims = {
		corners: (() => {
			const onInstancer = this.instancer(`claim-on`)
			const offInstancer = this.instancer(`claim-off`)
			return (on: boolean) => {
				return on
					? onInstancer()
					: offInstancer()
			}
		})(),

		resource: (() => {
			const level1 = this.instancer(`claim-resource1`)
			const level2 = this.instancer(`claim-resource2`)
			const level3 = this.instancer(`claim-resource3`)
			return (level: ResourceLevel) => {
				switch (level) {
					case 1: return level1()
					case 2: return level2()
					case 3: return level3()
					default: throw new Error(`glb unknown resource level ${level}`)
				}
			}
		})(),

		specialResource: this.instancer(`claim-special-resource`),

		tech: (() => {
			const instancers = new Map2<string, Instancer>()
			for (const kind of Object.keys(unitsConfig))
				instancers.set(kind, this.instancer(`claim-${kind}`))
			return (kind: UnitKind) => instancers.require(kind)()
		})(),
	}
}

