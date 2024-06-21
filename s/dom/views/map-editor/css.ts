
import {css} from "@benev/slate"

export default css`

.easel {
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	width: 100%;
	height: 100%;

	> * {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}
}

canvas {
	background: #222;
	outline: none;
}

`

