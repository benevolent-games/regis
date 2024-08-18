
import {fns} from "renraku"
import {Serverside} from "./serverside.js"

export type Clientside = {
	matchStart(id: number): Promise<void>
	matchFinish(): Promise<void>
	matchUpdate(): Promise<void>
}

export function makeClientside(
		serverside: Serverside,
		machinery: any,
	): Clientside {

	return fns({
		async matchStart(id: number) {},

		async matchUpdate() {},

		async matchFinish() {},
	})
}

