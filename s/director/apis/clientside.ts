
import {api} from "renraku"
import {Serverside} from "./serverside.js"

export type Clientside = {
	matchStart(id: number): Promise<void>
	matchFinish(): Promise<void>
	matchUpdate(): Promise<void>
}

export function makeClientsideApi(
		machinery: any,
		serverside: Serverside,
	) {
	return api((): Clientside => ({
		async matchStart(id: number) {},
		async matchUpdate() {},
		async matchFinish() {},
	}))
}

