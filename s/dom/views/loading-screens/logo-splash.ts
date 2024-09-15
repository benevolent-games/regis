
import {css, html} from "@benev/slate"
import {nexus} from "../../nexus.js"

export const LogoSplashView = nexus.shadowView(use => () => {
	use.name("logo-splash")
	use.styles(styles)

	return html`
		<h1>...loading...</h1>
	`
})

const styles = css`
	:host {
		display: flex;
		position: absolute;
		inset: 0;

		justify-content: center;
		align-items: center;

		width: 100%;
		height: 100%;

		background: #000;
		color: #333;
	}

	h1 {
		font-family: Spectral, serif;
		font-style: italic;
	}
`

