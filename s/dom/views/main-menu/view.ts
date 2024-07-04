
import {css, html} from "@benev/slate"
import {nexus} from "../../nexus.js"

type Options = {
	goIntro: () => void
	goEditor: () => void
}

const styles = css``

export const MainMenuView = nexus.shadowView(use => (o: Options) => {
	use.name("main-menu")
	use.styles(styles)

	return html`
		<h1>main menu</h1>
		<button @click=${o.goIntro}>exit</button>
		<button @click=${o.goEditor}>map editor</button>
	`
})

