
import {html} from "@benev/slate"
import {Agent} from "../../../../../logic/agent.js"
import {TeamId} from "../../../../../logic/state.js"
import {constants} from "../../../../../constants.js"
import {canAfford} from "../../../../../logic/simulation/aspects/money.js"

export function renderPricetag(agent: Agent, teamId: TeamId, cost: number) {
	const afford = (() => {
		if (teamId === null)
			return null
		const team = agent.state.teams.at(teamId)!
		return canAfford(team, cost)
			? "yes"
			: "no"
	})()

	return html`
		<span class=pricetag data-afford="${afford}">
			${constants.icons.resource}${cost}
		</span>
	`
}

