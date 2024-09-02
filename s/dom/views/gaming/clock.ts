
import {css, html} from "@benev/slate"

import {nexus} from "../../nexus.js"
import {UiData} from "../../utils/ui-data.js"
import {TeamTimeReport} from "../../../tools/chess-timer/types.js"

export const ClockView = nexus.shadowView(use => (
		uiData: UiData,
	) => {

	use.name("clock")
	use.styles(styles)

	const ourTeamId = uiData.ourTeamId.value
	const timeReport = uiData.timeReport.value
	const activeTeamId = uiData.activeTeamId.value

	if (!timeReport)
		return null

	const ourTimeReport = timeReport.teamwise.at(ourTeamId)!
	const opponentTimeReports = [...timeReport.teamwise.entries()]
		.filter(([id]) => id !== ourTeamId)

	function formatTime(ms: number) {
		const [big, small] = (ms / 1000).toFixed(2).split(".")
		return html`
			<span class=big>${big}</span><span class=small>.${small}</span>
		`
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
				?data-is-danger="${expired || ((remaining !== null) && remaining < 10_000)}"
				>
				<span>
					${expired ? html`EXPIRED` : (
						remaining === null
							? formatTime(elapsed)
							: formatTime(remaining)
					)}
				</span>
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
			min-width: 12em;
			height: 3em;
			padding: 0.2em;

			--color: #fff;
			&[data-team-id="0"] { --color: #0ff; }
			&[data-team-id="1"] { --color: #fd0; }
			&[data-is-danger] { --color: #f00; }

			transition: all 150ms linear;

			background: #4448;
			backdrop-filter: blur(10px);
			border-radius: 0.3rem;
			border: .2em solid transparent;

			font-family: monospace;
			color: white;
			text-shadow: .04em .08em .04em #000;

			opacity: 0.3;
			font-size: 1em;

			> span {
				font-size: 2em;
				font-weight: bold;
				> .small {
					opacity: 0.5;
					font-size: 0.6em;
				}
			}

			&:not([data-is-our-team]) {
				font-size: 0.6em;
			}

			&:is(
					[data-is-danger],
					[data-is-our-team][data-is-active],
				) {
				color: var(--color);
				border-color: var(--team-color);
			}

			&[data-is-our-team][data-is-active] {
				opacity: 1;
			}
		}
	}
`

