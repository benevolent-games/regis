
import {CommitHash} from "@benev/toolbox"

export class SmartCache {
	#commitHash = CommitHash.parse_from_dom()

	url = (url: string) => {
		return this.#commitHash.augment(url)
	}
}

