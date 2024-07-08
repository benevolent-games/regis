
import {RenderResult, html} from "@benev/slate"

import styles from "./css.js"
import {nexus} from "../../nexus.js"
import boxSvg from "../../icons/tabler/box.svg.js"
import {EditorCore} from "../../../game/editor/core.js"

export const UiView = nexus.shadowView(use => (editorCore: EditorCore) => {
	use.name("ui")
	use.styles(styles)

	const {inputMethod} = use.context

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

	function actionbutton(key: string, code: string) {
		const action = editorCore.inputs.find(code)
		return html`
			<button class=actionbutton>
				<span class=key>${key}</span>
				<span class=icon>${boxSvg}</span>
				<span class=label>${editorCore.inputs}</span>
			</button>
		`
	}

	switch (inputMethod.value) {
		case "none": return plate(html`
			<p>click or tap anywhere to begin!</p>
		`)

		case "touch": return plate(html`
			<div class="sidebar alpha">
				<button data-button="1">1</button>
				<button data-button="2">2</button>
				<button data-button="3">3</button>
				<button data-button="4">4</button>
				<button data-button="5">5</button>
				<button data-button="6">6</button>
			</div>
			<div class=midzone>
				${groupsbar()}
				${statusbar()}
			</div>
			<div class="sidebar bravo">
				<button data-button="7">7</button>
				<button data-button="8">8</button>
				<button data-button="9">9</button>
				<button data-button="10">10</button>
				<button data-button="11">11</button>
				<button data-button="12">12</button>
			</div>
		`)

		case "keys": return plate(html`
			${groupsbar()}
			<div class=gridspace>
				<div class=gridboard>
					<div class=upper>
						<button>Tab</button>
					</div>
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
					<div class=lower>
						<button>Space</button>
					</div>
				</div>
			</div>
			${statusbar()}
		`)
	}
})

