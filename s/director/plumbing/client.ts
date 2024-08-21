
import {expose, webSocketRemote} from "renraku"

import {constants} from "../../constants.js"
import {ClientMachinery} from "./machinery.js"
import {Serverside} from "../apis/serverside.js"
import {makeClientside} from "../apis/clientside.js"

export type DirectorClient = Awaited<ReturnType<typeof makeDirectorClient>>

export async function makeDirectorClient(url: string) {
	const machinery = new ClientMachinery()

	const {socket, remote: serverside} = await webSocketRemote<Serverside>({
		url,
		timeout: constants.net.timeout,
		getLocalEndpoint: remote => expose(
			() => makeClientside(() => remote, machinery)
		),
	})

	return {socket, serverside, machinery}
}

