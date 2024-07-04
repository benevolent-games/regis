
import {css, html} from "@benev/slate"
import {nexus} from "../../nexus.js"

export const IntroPageView = nexus.shadowView(use => (o: Options) => {
	use.name("intro-page")
	use.styles(styles)

	return html`
		<h1>intro page</h1>
		<button @click=${o.goMainMenu}>play</button>
	`
})

type Options = {
	goMainMenu: () => void
}

const styles = css``

