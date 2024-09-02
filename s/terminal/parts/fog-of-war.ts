
import {Agent} from "../../logic/agent.js"
import { Assets } from "./assets.js"

export class FogOFWar {
	constructor(private options: {
		agent: Agent
		assets: Assets
	}) {}
}

