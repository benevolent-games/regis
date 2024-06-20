
import {css} from "@benev/slate"

export default css`

.easel {
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	width: 100%;
	height: 100%;
}

canvas {
	width: 100%;
	height: 100%;
	background: #222;
	outline: none;
}

.sidebar {
	position: absolute;
	width: 10%;
	height: 100%;

	background: #333a;
	top: 0;

	&.alpha { left: 0; }
	&.bravo { right: 0; }
}

`

