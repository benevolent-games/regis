
import {expose, webSocketRemote} from "renraku"

import {Serverside} from "../apis/serverside.js"
import {makeClientside} from "../apis/clientside.js"

export async function makeDirectorClient(url: string) {
	const machinery = {}

	const {socket, remote: serverside} = await webSocketRemote<Serverside>({
		url,
		getLocalEndpoint: remote => expose(
			() => makeClientside(remote, machinery)
		),
	})

	return {socket, serverside}
}

