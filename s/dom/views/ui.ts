

import {RenderResult, ev, html} from "@benev/slate"

import {nexus} from "../nexus.js"
import styles from "./ui.css.js"

export type UiKind = "none" | "touch" | "keyboard"

export const UiView = nexus.shadow_view(use => () => {
	use.styles(styles)
	use.name("ui")

	const kind = use.signal<UiKind>("none")

	use.mount(() => {
		function setKind(k: UiKind) {
			if (kind.value !== k)
				kind.value = k
		}

		return ev(document, {
			pointerdown: (event: PointerEvent) => {
				if (event.pointerType === "touch") setKind("touch")
				else setKind("keyboard")
			},
			keydown: () => setKind("keyboard"),
		})
	})

	function plate(content: RenderResult) {
		return html`<div data-plate="${kind}">${content}</div>`
	}

	switch (kind.value) {
		case "none": return plate(html`
			<p>press any key, or tap anywhere</p>
		`)
		case "touch": return plate(html`
			<div class="sidebar alpha"></div>
			<div class="sidebar bravo"></div>
		`)
		case "keyboard": return plate(html`
			<p>keyboard</p>
		`)
	}
})

