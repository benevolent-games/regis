
import {css, html, nap} from "@benev/slate"

import {nexus} from "../../nexus.js"
import {Bridge} from "../../utils/bridge.js"

export const GameplayMenu = nexus.shadowView(use => (o: {
		bridge: Bridge
		onResume: () => void
		onSurrender: () => void
		onQuit: () => void
	}) => {

	use.name("gameplay-menu")
	use.styles(styles)

	const agent = o.bridge.agent.value

	use.once(async() => {
		await nap()
		const dialog = use.shadow.querySelector("dialog")!
		dialog.showModal()
	})

	const dialog = use.deferOnce(() => {
		const dialog = use.shadow.querySelector("dialog")!
		nap().then(() => dialog.showModal())
		return dialog
	})

	const closer = (fn: () => void) => {
		return () => {
			if (dialog.value) {
				dialog.value.close()
			}
			fn()
		}
	}

	const backdropClickClose = (event: PointerEvent) => {
		const dialog = event.currentTarget as HTMLDialogElement
		if (event.target === dialog) {
			dialog.close()
			o.onResume()
		}
	}

	return html`
		<dialog @cancel="${o.onResume}" @click="${backdropClickClose}">

			<div>
				<button
					class=happy
					@click="${closer(o.onResume)}">
						resume
				</button>
			</div>

			<div>
				${agent.conclusion ? null : html`
					<button
						class=angry
						@click="${closer(o.onSurrender)}">
							surrender
					</button>
				`}
				<button
					class=angry
					@click="${closer(o.onQuit)}">
						quit
				</button>
			</div>

		</dialog>
	`
})

const styles = css`
	dialog {
		pointer-events: all;
		position: absolute;
		inset: 0;

		overflow: auto;
		margin: auto;
		width: max(24em, max-content);
		height: max-content;
		max-width: 100%;
		max-height: 100%;

		padding: 1em;
		display: flex;
		flex-direction: column;
		gap: 0.5em;

		background: #333;
		box-shadow: .2em .5em .5em #0006;
		border-radius: 0.5em;
		border: none;
	}

	dialog::backdrop {
		background: #080808cc;
		backdrop-filter: blur(0.5rem);
	}

	dialog > div {
		display: flex;
		gap: 0.5em;
		> button {
			flex: 1 1 auto;
		}
	}

	button {
		padding: 1em;

		--bg: #ccc;
		&.happy { --bg: #6ee; }
		&.angry { --bg: #c00; }

		background: var(--bg);
		background: linear-gradient(
			to bottom,
			color-mix(in srgb, var(--bg), white 33%),
			color-mix(in srgb, var(--bg), black 33%)
		);

		border: none;
		border-top: .1em solid #fff2;
		border-bottom: .1em solid #0004;
		border-radius: 0.3em;

		color: #fff;
		font-size: 1em;
		font-family: sans-serif;
		font-weight: bold;
		text-transform: uppercase;
		text-shadow: .05em .10em .2em #0008;

		outline: 0;
		&:hover { filter: brightness(120%); }
		&:active { filter: brightness(80%); }
	}
`

