
import {AssetContainer} from "@babylonjs/core"

import {BoardGlb} from "./board.js"
import {Map2} from "../../../tools/map2.js"
import {Glb, Instancer} from "../utils/glb.js"
import {getTopMeshes} from "../../parts/babylon-helpers.js"
import {UnitKind, unitsConfig} from "../../../config/units.js"
import {HealthReport} from "../../../logic/utils/health-report.js"

const teamIds = [0, 1]
const fadedOpacity = 0.6
const obstacleHealthVariations = 12

export class UnitsGlb extends Glb {
	constructor(container: AssetContainer, private boardGlb: BoardGlb) {
		super(container)
	}

	units = (() => {
		const nameify = (kind: string, teamId: number) => {
			return `unit-team${teamId + 1}-${kind}`
		}

		const fadedMap = new Map2<string, Instancer>()
		const normalMap = new Map2<string, Instancer>()

		for (const [kind, {rendering}] of Object.entries(unitsConfig)) {
			if (rendering.algo === "obstacle")
				continue

			for (const teamId of teamIds) {

				// instancers for 'normal' prop variants
				const name = nameify(kind, teamId)
				normalMap.set(name, this.instancer(name))

				// instancers for 'faded' prop variants
				{
					const normalProp = this.props.require(name)
					const fadedProp = normalProp.clone(normalProp.name, null)!
					getTopMeshes(fadedProp).forEach(mesh => {
						mesh.visibility = fadedOpacity
						this.container.scene.removeMesh(mesh, true)
					})
					fadedMap.set(name, () => Glb.instantiate(fadedProp))
				}
			}
		}

		const prep = (map: Map2<string, Instancer>) =>
			(kind: UnitKind, teamId: number | null, health: HealthReport | null) => {

			const {rendering} = unitsConfig[kind]

			if (rendering.algo === "normal") {
				if (teamId === null)
					throw new Error(`glb unit kind "${kind}" requires non-null teamId (got null)`)
				const instancer = map.require(nameify(kind, teamId))
				return instancer()
			}

			else if (rendering.algo === "obstacle") {
				return this.boardGlb.obstacle(
					health
						? Math.ceil(health.fraction * obstacleHealthVariations)
						: obstacleHealthVariations
				)
			}

			else throw new Error("unknown rendering algo")
		}

		return {
			normal: prep(normalMap),
			faded: prep(fadedMap),
		}
	})()
}

