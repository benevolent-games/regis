
import {css, html} from "@benev/slate"
import {nexus} from "../../nexus.js"

const styles = css`
	:host {
		display: flex;
		position: absolute;
		inset: 0;

		justify-content: center;
		align-items: center;

		width: 100%;
		height: 100%;
		background: #334;
	}
`

export const LogoSplashView = nexus.shadowView(use => () => {
	use.name("logo-splash")
	use.styles(styles)

	return html`
		<h1>...loading...</h1>
	`
})

