
import {css, ev, html} from "@benev/slate"

import {nexus} from "../../nexus.js"
import {Bridge} from "../../utils/bridge.js"
import {ActionBarView} from "../gaming/action-bar.js"
import {GameplayMenu} from "../gaming/gameplay-menu.js"
import type {World} from "../../../terminal/parts/world.js"
import {InspectorView} from "../gaming/inspector/inspector.js"

export const GameplayView = nexus.shadowView(use => ({
		world,
		bridge,
		exit,
	}: {
		world: World
		bridge: Bridge
		exit: () => void,
	}) => {

	use.name("gameplay")
	use.styles(styles)

	const menu = use.signal(false)

	// tab to toggle menu
	use.mount(() => ev(document, {
		keydown: (event: KeyboardEvent) => {
			if (event.code === "Tab") {
				menu.value = !menu.value
				event.preventDefault()
			}
		},
	}))

	return html`
		${world.canvas}

		<div class="hud">
			${ActionBarView([{
				bridge,
				openMenu: () => {
					menu.value = true
				},
			}])}

			${InspectorView([bridge])}

			${menu.value ? GameplayMenu([{
				bridge,
				onQuit: () => {
					menu.value = false
					exit()
				},
				onResume: () => {
					menu.value = false
				},
				onSurrender: () => {
					menu.value = false
				},
			}]) : null}
		</div>
	`
})

export const styles = css`
	:host {
		display: block;
		position: relative;
		width: 100%;
		height: 100%;
	}

	canvas {
		position: absolute;
		display: block;
		width: 100%;
		height: 100%;

		&:focus {
			outline: 0;
		}
	}

	.hud {
		pointer-events: none;
		z-index: 1;
		position: relative;
		inset: 0;
		margin: auto;

		aspect-ratio: 16 / 9;
		width: auto;
		height: 100%;
		max-width: 100%;

		> [view="actionbar"] {
			z-index: 1;
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			margin: 0 auto;
			padding: 0.5em;
		}

		> [view="inspector"] {
			pointer-events: none;
			overflow: hidden;
			z-index: 1;
			position: absolute;
			user-select: auto;
			padding: 1em;

			font-size: 0.8em;
			width: max-content;
			max-width: 100%;
			bottom: 0;
			left: 0;
			right: 0;

			background: linear-gradient(
				to right,
				#0008,
				#0000
			);
		}
	}
`

