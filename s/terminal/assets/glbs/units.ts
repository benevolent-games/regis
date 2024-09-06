
import {AssetContainer} from "@babylonjs/core"

import {BoardGlb} from "./board.js"
import {Map2} from "../../../tools/map2.js"
import {TeamId} from "../../../logic/state.js"
import {Glb, Instancer} from "../utils/glb.js"
import {UnitKind, unitsConfig} from "../../../config/units.js"
import {HealthReport} from "../../../logic/utils/health-report.js"

const teamIds = [0, 1]
const fadedOpacity = 0.6
const obstacleHealthVariations = 12

export class UnitsGlb extends Glb {
	constructor(container: AssetContainer, private boardGlb: BoardGlb) {
		super(container)
	}

	ring = this.instancer("ring")

	#unitSpawners = (() => {
		const nameify = (kind: string, teamId: number) => {
			return `unit-team${teamId + 1}-${kind}`
		}

		const fadedMap = new Map2<string, Instancer>()
		const normalMap = new Map2<string, Instancer>()

		for (const [kind, {rendering}] of Object.entries(unitsConfig)) {
			if (rendering.algo === "obstacle")
				continue

			for (const teamId of teamIds) {

				// instancer for 'normal' prop variants
				const name = nameify(kind, teamId)
				const normalProp = this.props.require(name)
				normalMap.set(name, this.instancer(name))

				// instancer for 'faded' prop variants
				const fadedProp = Glb.cloneProp(normalProp)
				Glb.changeOpacity(fadedProp, fadedOpacity)
				fadedMap.set(name, () => Glb.instantiate(fadedProp))
			}
		}

		const prep = (map: Map2<string, Instancer>) =>
			(kind: UnitKind, teamId: TeamId, health: HealthReport | null) => {

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

	unit = (kind: UnitKind, teamId: TeamId, health: HealthReport | null) => {
		return this.#unitSpawners.normal(kind, teamId, health)
	}

	faded = (kind: UnitKind, teamId: TeamId, health: HealthReport | null) => {
		return this.#unitSpawners.faded(kind, teamId, health)
	}
}

