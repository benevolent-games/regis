
import {css, html} from "@benev/slate"
import {nexus} from "../../nexus.js"

type Options = {
	gotoMainMenu: () => void
}

const styles = css``

export const IntroPageView = nexus.shadowView(use => (o: Options) => {
	use.name("intro-page")
	use.styles(styles)

	return html`
		<h1>intro page</h1>
		<button @click=${o.gotoMainMenu}>play</button>
	`
})

