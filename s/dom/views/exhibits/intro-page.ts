
import {nexus} from "../../nexus.js"
import {html} from "@benev/slate"

export const IntroPageView = nexus.lightView(use => (o: Options) => {
	use.name("intro-page")

	return html`
		<slot name=lead></slot>
		<div class=buttonbox>
			<button @click=${o.goMainMenu}>play</button>
		</div>
		<slot></slot>
	`
})

type Options = {
	goMainMenu: () => void
}

