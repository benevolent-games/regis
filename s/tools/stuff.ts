
import {babyloid, Meshoid, Prop} from "@benev/toolbox"
import {AssetContainer, PBRMaterial, TransformNode} from "@babylonjs/core"

export class Stuff {
	readonly props = new Map<string, Prop>()
	readonly meshes = new Map<string, Meshoid>()
	readonly materials = new Map<string, PBRMaterial>()

	constructor(public readonly glb: AssetContainer) {

		for (const material of glb.materials)
			if (material instanceof PBRMaterial)
				this.materials.set(material.name, material)

		for (const mesh of glb.meshes.filter(babyloid.is.meshoid))
			this.meshes.set(mesh.name, mesh)

		for (const node of [...glb.meshes, ...glb.transformNodes])
			if (!node.name.includes("_primitive"))
				this.props.set(node.name, node)
	}

	instanceProp(name: string) {
		const prop = this.props.get(name)
		if (!prop) throw new Error(`prop "${name}" not found`)
		return prop.instantiateHierarchy() as TransformNode
	}
}

