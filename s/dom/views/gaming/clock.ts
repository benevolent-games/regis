
import {css, html} from "@benev/slate"

import {nexus} from "../../nexus.js"
import {UiData} from "../../utils/ui-data.js"
import { TeamTimeReport } from "../../../tools/chess-timer/types.js"

export const ClockView = nexus.shadowView(use => (
		uiData: UiData,
	) => {

	use.name("clock")
	use.styles(styles)

	const activeTeamId = uiData.activeTeamId.value
	const ourTeamId = uiData.ourTeamId.value
	const ourTurn = uiData.ourTurn.value
	const timeReport = uiData.timeReport.value

	if (!timeReport)
		return null

	const ourTimeReport = timeReport.teamwise.at(ourTeamId)!
	const opponentTimeReports = [...timeReport.teamwise.entries()]
		.filter(([id]) => id !== ourTeamId)

	function formatTime(ms: number) {
		return (ms / 1000).toFixed()
	}

	function renderTeamTime(
			teamId: number,
			{elapsed, remaining, expired}: TeamTimeReport,
		) {
		return html`
			<div class="time"
				data-team-id="${teamId}"
				?data-is-our-team="${teamId === ourTeamId}"
				?data-is-active="${teamId === activeTeamId}"
				?data-is-expired="${expired}"
				?data-is-limited="${remaining !== null}"
				?data-is-danger-low="${(remaining !== null) && remaining < 10_000}"
				>
				${expired ? html`EXPIRED` : (
					remaining === null
						? formatTime(elapsed)
						: formatTime(remaining)
				)}
			</div>
		`
	}

	return html`
		<div class="clock">
			${renderTeamTime(ourTeamId, ourTimeReport)}

			${opponentTimeReports.map(
				([teamId, report]) =>
					renderTeamTime(teamId, report)
			)}
		</div>
	`
})

export const styles = css`
	.clock {
		display: flex;
		flex-direction: column;
		justify-content: start;
		align-items: center;

		gap: 0.5em;

		.time {
			display: flex;
			justify-content: center;
			align-items: center;
			min-width: 6em;
			padding: 0.1em;

			--color: #fff;
			&[data-team-id="0"] { --color: #0ff; }
			&[data-team-id="1"] { --color: #fa0; }
			&[data-is-danger-low] { --color: #f00; }
			&[data-is-expired] { --color: #f00; }

			transition: all 150ms linear;

			background: #4448;
			border-radius: 0.3rem;
			border: .1em solid transparent;

			font-family: monospace;
			color: white;
			text-shadow: .04em .08em .04em #000;

			opacity: 0.3;
			font-size: 1em;

			&[data-is-our-team] {
				font-size: 2em;
				font-weight: bold;
			}

			&[data-is-our-team][data-is-active] {
				opacity: 1;
				color: var(--color);
				border-color: var(--color);
			}

			&:is([data-is-expired], [data-is-danger-low]) {
				color: var(--color);
				border-color: var(--team-color);
			}
		}
	}
`

