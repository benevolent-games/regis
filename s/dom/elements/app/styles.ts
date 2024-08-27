
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
			background: green;
			border: none;
			border-radius: 0.2em;
		}
	}
}

`

