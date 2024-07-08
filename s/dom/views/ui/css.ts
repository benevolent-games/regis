
import {css} from "@benev/slate"

export default css`

* {
	user-select: none;
	-webkit-user-drag: none;
	user-drag: none;
}

[data-plate] {
	pointer-events: none;
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
}

[data-plate="none"] {
	pointer-events: none;
	display: flex;
	align-items: center;
	justify-content: center;
}

[data-plate="touch"] {
	display: flex;

	.midzone {
		flex: 1 1 auto;

		display: flex;
		flex-direction: column;

		.statusbar {
			margin-top: auto;
		}
	}

	.sidebar {
		pointer-events: all;
		flex: 0 1 auto;
		XXX-width: 10%;
		height: 100%;
		top: 0;

		&.alpha { left: 0; }
		&.bravo { right: 0; }
	}

	.sidebar {
		display: flex;
		flex-direction: column;
		gap: 0.2em;

		> button {
			flex: 1 1 auto;
			outline: 0;
			background: #6668;
			border: none;
			color: inherit;
			font: inherit;
			font-size: 1.5em;
			width: min(20vh, 20vw);
		}
	}
}

[data-plate="keys"] {
	aspect-ratio: 16 / 9;
	height: 100%;
	width: auto;
	max-width: 100%;
	margin: auto;

	display: flex;
	flex-direction: column;

	> * {
		flex: 0 0 auto;
	}

	.groupsbar {}

	.gridspace {
		margin-top: auto;
		.gridboard {
			pointer-events: all;
			width: max-content;
		}
	}

	.statusbar {}
}

.groupsbar {
	display: flex;
	background: #0004;
	color: #fff5;
	padding: 0.5em;
}

.statusbar {
	display: flex;
	background: #0002;
	color: #fff5;
	padding: 0.5em;

	.resources {
		margin-left: auto;
	}
}

.gridboard {
	display: flex;
	flex-direction: column;
	gap: 0.2em;

	> div {
		display: flex;
		gap: 0.2em;

		&:nth-child(2) { padding-left: 6em; }
		&:nth-child(3) { padding-left: 7em; }
		&:nth-child(4) { padding-left: 10em; }
	}

	& .spacer {
		display: flex;
		> div { width: 1em; }
	}

	& button {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;

		background: #6668;
		border: none;
		color: inherit;
		font: inherit;
		font-size: 1em;
		padding: .5em;
		width: 4em;
		height: 3em;

		opacity: 0.8;

		&[data-down] {
			opacity: 1;
		}

		&[data-code="Tab"] { width: 5em; }
		&[data-code="Space"] { width: 10em; }

		.name {
			position: absolute;
			top: .2em;
			left: .2em;
			font-size: 1em;
		}

		.icon {
			position: absolute;
			inset: 0;
			width: 1.5em;
			height: 1.5em;
			margin: auto;
		}

		.label {
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;

			font-size: 0.6em;
			text-align: center;
			overflow: hidden;
		}
	}

	:is(.lower, .upper) {
		display: flex;
		gap: 0.2em;
	}

	.letterbox {
		display: flex;
		flex-direction: column;
		gap: 0.2em;

		> div {
			display: flex;
			gap: 0.2em;
		}
	}
}

`

