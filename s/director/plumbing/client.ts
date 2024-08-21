
import {expose, Remote, webSocketRemote} from "renraku"

import {constants} from "../../constants.js"
import {ClientMachinery} from "./machinery.js"
import {Serverside} from "../apis/serverside.js"
import {makeClientside} from "../apis/clientside.js"

export type DirectorClient = Awaited<ReturnType<typeof makeDirectorClient>>

export async function makeDirectorClient(
		url: string,
		machinery: ClientMachinery,
	){

	const r = await webSocketRemote<Serverside>({
		url,
		timeout: constants.net.timeout,
		getLocalEndpoint: remote => expose(
			() => makeClientside(machinery, () => remote)
		),
	})

	return {
		socket: r.socket,
		serverside: r.fns as Remote<Serverside>,
	}
}

