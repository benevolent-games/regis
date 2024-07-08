
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

	function actionbutton(name: string, code: string) {
		const [action] = editorCore.inputs.find(code)
		const isDown = editorCore.inputs.getCodeSignal(code).value.down

		return html`
			<button
				data-name="${name}"
				data-code="${code}"
				?data-bound="${!!action}"
				?data-down="${isDown}">

				<span class=name>${name}</span>
				${!!action ? html`
					<span class=icon>${boxSvg}</span>
					<span class=label>${action.label}</span>
				` : null}
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
					<div>
						${actionbutton("Tab", "Tab")}
						${actionbutton("Q", "KeyQ")}
						${actionbutton("W", "KeyW")}
						${actionbutton("E", "KeyE")}
						${actionbutton("R", "KeyR")}
						${actionbutton("T", "KeyT")}
					</div>
					<div>
						${actionbutton("A", "KeyA")}
						${actionbutton("S", "KeyS")}
						${actionbutton("D", "KeyD")}
						${actionbutton("F", "KeyF")}
						${actionbutton("G", "KeyG")}
					</div>
					<div>
						${actionbutton("Z", "KeyZ")}
						${actionbutton("X", "KeyX")}
						${actionbutton("C", "KeyC")}
						${actionbutton("V", "KeyV")}
						${actionbutton("B", "KeyB")}
					</div>
					<div>
						${actionbutton("Space", "Space")}
					</div>
				</div>
			</div>
			${statusbar()}
		`)
	}
})

