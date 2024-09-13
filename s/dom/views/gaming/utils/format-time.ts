
import {html} from "@benev/slate"

export function formatTime(ms: number) {
	const [big, small] = (ms / 1000).toFixed(2).split(".")
	return html`
		<span class=big>${big}</span><span class=small>.${small}</span>
	`
}

