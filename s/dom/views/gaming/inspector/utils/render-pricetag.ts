
import {html} from "@benev/slate"
import {Agent} from "../../../../../logic/agent.js"
import {TeamId} from "../../../../../logic/state.js"
import {constants} from "../../../../../constants.js"
import {canAfford} from "../../../../../logic/simulation/aspects/money.js"

export function renderPricetag(agent: Agent, cost: number, teamId: TeamId) {
	const teamful = teamId !== null

	const afford = (() => {
		if (!teamful)
			return null
		const team = agent.state.teams.at(teamId)!
		return canAfford(team, cost)
			? "yes"
			: "no"
	})()

	const classnames: string[] = ["pricetag"]

	if (teamful && afford === "yes")
		classnames.push("happy")

	if (teamful && afford === "no")
		classnames.push("angry")

	return html`
		<span class="${classnames.join(" ")}" data-afford="${afford}">
			${constants.icons.resource}${cost}
		</span>
	`
}

