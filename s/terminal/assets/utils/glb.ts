
import {Map2} from "../../../tools/map2.js"
import {babyloid, Meshoid, Prop} from "@benev/toolbox"
import {AssetContainer, InstancedMesh, PBRMaterial, TransformNode} from "@babylonjs/core"

export type Instancer = () => TransformNode

export class Glb {
	readonly props = new Map2<string, Prop>()
	readonly meshoids = new Map2<string, Meshoid>()
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
			this.meshoids.set(mesh.name, mesh)

		for (const node of [...container.meshes, ...container.transformNodes])
			if (!node.name.includes("_primitive"))
				this.props.set(node.name, node)
	}

	getSourceMesh(name: string) {
		const meshoid = this.meshoids.get(name)
		if (meshoid) {
			return meshoid instanceof InstancedMesh
				? meshoid.sourceMesh
				: meshoid
		}
	}

	instancer(name: string): Instancer {
		const prop = this.props.require(name)
		return () => Glb.instantiate(prop)
	}
}

