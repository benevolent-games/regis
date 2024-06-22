

import {RenderResult, html} from "@benev/slate"

import styles from "./css.js"
import {nexus} from "../../nexus.js"
import {InputMethod, detectInputMethod} from "./utils/input-method.js"
import boxSvg from "../../icons/tabler/box.svg.js"

export const UiView = nexus.shadow_view(use => () => {
	use.name("ui")
	use.styles(styles)

	const inputMethod = use.signal<InputMethod>("none")

	use.mount(detectInputMethod(inputMethod))

	function plate(content: RenderResult) {
		return html`<div data-plate="${inputMethod}">${content}</div>`
	}

	function groupsbar() {
		return html`
			<div class=groupsbar>
				hotkey groups
			</div>
		`
	}

	function statusbar() {
		return html`
			<div class=statusbar>
				<div class=selection>selection</div>
				<div class=resources>resources</div>
			</div>
		`
	}

	function actionbutton({label, key}: {
			key?: string
			label: string
		}) {
		return html`
			<button class=actionbutton>
				<span class=key>${key}</span>
				<span class=icon>${boxSvg}</span>
				<span class=label>${label}</span>
			</button>
		`
	}

	switch (inputMethod.value) {
		case "none": return plate(html`
			<p>click or tap anywhere to begin</p>
		`)

		case "touch": return plate(html`
			<div class="sidebar alpha">
				<button data-button="1">Q</button>
				<button data-button="2">E</button>
				<button data-button="3">Z</button>
				<button data-button="4">X</button>
				<button data-button="5">C</button>
			</div>
			<div class=midzone>
				${groupsbar()}
				${statusbar()}
			</div>
			<div class="sidebar bravo">
				<button data-button="6">R</button>
				<button data-button="7">F</button>
				<button data-button="8">V</button>
				<button data-button="9">T</button>
				<button data-button="10">G</button>
				<button data-button="11">B</button>
			</div>
		`)

		case "keys": return plate(html`
			${groupsbar()}
			<div class=gridspace>
				<div class=gridboard>
					<div class=letterbox>
						<div>
							<button>Q</button>
							<button>W</button>
							<button>E</button>
							<button>R</button>
							<button>T</button>
						</div>
						<div>
							<button>A</button>
							<button>S</button>
							<button>D</button>
							<button>F</button>
							<button>G</button>
						</div>
						<div>
							<button>Z</button>
							<button>X</button>
							<button>C</button>
							<button>V</button>
							<button>B</button>
						</div>
					</div>
				</div>
			</div>
			${statusbar()}
		`)
	}
})

