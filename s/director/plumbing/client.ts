
import {endpoint, Remote, webSocketRemote} from "renraku"

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
		getLocalEndpoint: remote => endpoint(makeClientside(machinery, () => remote)),
		onClose: () => {},
	})

	return {
		socket: r.socket,
		serverside: r.remote as Remote<Serverside>,
	}
}

