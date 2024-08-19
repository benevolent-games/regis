
import {expose, webSocketRemote} from "renraku"

import {Serverside} from "../apis/serverside.js"
import {makeClientside} from "../apis/clientside.js"

export type DirectorClient = Awaited<ReturnType<typeof makeDirectorClient>>

export async function makeDirectorClient(url: string) {
	const machinery = {}

	const {socket, remote: serverside} = await webSocketRemote<Serverside>({
		url,
		getLocalEndpoint: remote => expose(
			() => makeClientside(() => remote, machinery)
		),
	})

	return {socket, serverside}
}

export class DirectorConnector {
	retryDelay = 5_000

	constructor(public url: string) {}
}

