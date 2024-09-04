
import {Map2} from "../../../tools/map2.js"
import {babyloid, Meshoid, Prop} from "@benev/toolbox"
import {AssetContainer, InstancedMesh, PBRMaterial, TransformNode} from "@babylonjs/core"

export class Glb {
	readonly props = new Map2<string, Prop>()
	readonly meshes = new Map2<string, Meshoid>()
	readonly materials = new Map2<string, PBRMaterial>()

	static instantiate(prop: Prop) {
		return prop.instantiateHierarchy(
			undefined,
			undefined,
			(source, clone) => {
				clone.name = source.name
			},
		) as TransformNode
	}

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

	getSourceMesh(name: string) {
		const meshoid = this.meshes.get(name)
		if (meshoid) {
			return meshoid instanceof InstancedMesh
				? meshoid.sourceMesh
				: meshoid
		}
	}

	instancer(name: string) {
		const prop = this.props.require(name)
		return () => Glb.instantiate(prop)
	}

	instance(name: string) {
		return Glb.instantiate(this.props.require(name))
	}
}

