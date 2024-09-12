
import {html, wherefor} from "@benev/slate"
import {Bridge} from "../../../../utils/bridge.js"
import {renderRange} from "../utils/render-traits.js"
import {renderPricetag} from "../utils/render-pricetag.js"
import {renderDataList} from "../utils/render-data-list.js"
import {boardCoords} from "../../../../../tools/board-coords.js"

export function tilePanel(bridge: Bridge) {
	const agent = bridge.agent.value
	const teamId = bridge.teamId.value
	const selection = bridge.selectaconSelection.value

	if (selection?.kind !== "tile")
		return null

	const tile = agent.tiles.at(selection.place)

	return html`
		<section class=panel>
			<h1>${boardCoords(selection.place)}</h1>

			<div class=group>
				<section>
					<h2>Terrain</h2>
					${renderDataList({
						elevation: agent.coordinator.elevationWithStep(tile),
						step: tile.step
							? `connects tiles above and below`
							: null,
					})}
				</section>

				${(tile.claims.length > 0) ? (() => {
					const stakingCost = agent.claims.stakingCost(tile.claims)
					const stakeholder = agent.claims.stakeholderAt(selection.place)
					return html`
						<section>
							<h2>Claims</h2>
							${renderDataList({
								stakeholder: stakeholder
									? (stakeholder.team === teamId
										? html`<span class="happy">${stakeholder.kind}</span>`
										: html`<span class="angry">enemy ${stakeholder.kind}</span>`
									)
									: "vacant",
								"staking cost": (
									stakingCost === 0
										? "free"
										: stakeholder
											? renderPricetag(agent, stakingCost, null)
											: renderPricetag(agent, stakingCost, teamId)
								),
							})}
						</section>
					`
				})() : null}

				${agent.claims.isResourceful(tile.claims) ? (() => {
					const stock = agent.claims.stock(tile.claims)
					const {income} = agent.claims.income(tile.claims)
					return html`
						<section>
							<h2>Resources</h2>
							${renderDataList({
								income,
								stock: stock === 0
									? html`<span class=angry>depleted</span>`
									: `${stock} remaining`,
							})}
						</section>
					`
				})() : null}

				${agent.claims.isTechnological(tile.claims) ? (() => {
					const tech = agent.claims.tech(tile.claims)
					return html`
						<section>
							<h2>Technology</h2>
							${renderDataList({
								unlocks: [...tech].join(", ")
							})}
						</section>
					`
				})() : null}

				${wherefor(agent.claims.watchtower(tile.claims), watchtower => html`
					<section>
						<h2>Watchtower</h2>
						${renderDataList({
							range: renderRange(watchtower.range),
						})}
					</section>
				`)}
			</div>
		</section>
	`
}

