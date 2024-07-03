
import {css} from "@benev/slate"

export const styles = css`

:host {
	position: relative;
	display: block;
	width: 100%;
	height: 100%;
}

.loading, .exhibit {
	display: block;
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
}

.loading {
	z-index: 1;
}

`

