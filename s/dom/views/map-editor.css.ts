
import {css} from "@benev/slate"

export default css`

.easel {
	display: block;
	position: relative;
	width: 100%;
	height: 100%;
}

canvas {
	width: 100%;
	height: 100%;
	background: #222;
}

.sidebar {
	position: absolute;
	width: 3em;
	height: 100%;

	background: #333a;
	top: 0;

	&.alpha { left: 0; }
	&.bravo { right: 0; }
}

`

