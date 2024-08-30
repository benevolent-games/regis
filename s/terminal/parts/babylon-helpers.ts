
import {babyloid, Prop} from "@benev/toolbox"
import {TransformNode} from "@babylonjs/core"

export function getChildProps(transform: TransformNode) {
	const props = new Map<string, Prop>()
	for (const prop of transform.getChildren(babyloid.is.prop, false)) {
		props.set(prop.name, prop)
	}
	return props
}

