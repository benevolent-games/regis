
import {css} from "@benev/slate"

export default css`

:host {
	display: block;
}

[view="intro-page"] {
	.buttonbox {
		display: flex;
		width: 32em;
		margin: 0 auto;
		justify-content: center;

		> button {
			color: white;
			font-family: inherit;
			font-size: 1.5em;
			padding: 0.8em 2em;

			background: #88afbb63;
			box-shadow: .1em .2em .5em #0002;
			border: none;
			border-radius: 0.2em;
			cursor: pointer;

			text-transform: uppercase;
			xxx-font-family: Spectral, serif;
			font-weight: bold;

			&:hover { filter: brightness(110%); }
			&:active { filter: brightness(80%); }
		}
	}
}

`

