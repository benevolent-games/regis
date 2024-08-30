
import {babyloid, Meshoid, Prop} from "@benev/toolbox"
import {AssetContainer, PBRMaterial, TransformNode} from "@babylonjs/core"

export class Glb {
	readonly props = new Map<string, Prop>()
	readonly meshes = new Map<string, Meshoid>()
	readonly materials = new Map<string, PBRMaterial>()

	constructor(public readonly container: AssetContainer) {
		for (const material of container.materials)
			if (material instanceof PBRMaterial)
				this.materials.set(material.name, material)

		for (const mesh of container.meshes.filter(babyloid.is.meshoid))
			this.meshes.set(mesh.name, mesh)

		for (const node of [...container.meshes, ...container.transformNodes])
			if (!node.name.includes("_primitive"))
				this.props.set(node.name, node)
	}

	instancer(name: string) {
		const prop = this.props.get(name)
		if (!prop) throw new Error(`prop "${name}" not found`)
		return () => prop.instantiateHierarchy(undefined, undefined, (source, clone) => {
			clone.name = source.name
		}) as TransformNode
	}

	instance(name: string) {
		return this.instancer(name)()
	}
}

