
import {css} from "@benev/slate"

export default css`

[data-plate] {
	pointer-events: none;
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;

	&[data-plate="none"] {
		pointer-events: none;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	&[data-plate="touch"] {
		.sidebar {
			pointer-events: all;
			position: absolute;
			width: 10%;
			height: 100%;

			background: #333a;
			top: 0;

			&.alpha { left: 0; }
			&.bravo { right: 0; }
		}
	}

	&[data-plate="keyboard"] {
		pointer-events: all;
		display: flex;
		align-items: center;
		justify-content: center;
	}
}

`

