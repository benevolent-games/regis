
import {html, is} from "@benev/slate"

type DataValue = string | number | boolean | null | undefined

export function renderDataList(data: Record<string, DataValue>) {
	return html`
		<ul>
			${renderDataItems(data)}
		</ul>
	`
}

export function renderDataItems(data: Record<string, DataValue>) {
	return Object.entries(data)
		.filter(([,value]) => is.available(value))
		.map(([key, value]) => html`
			<li>
				<span>${key}</span>
				<span>${renderDataValue(value)}</span>
			</li>
		`)
}

function renderDataValue(value: DataValue) {
	return (typeof value === "boolean")
		? (!value ? "yes" : "no")
		: value
}

