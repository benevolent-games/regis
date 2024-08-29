
import {Denial} from "./denials.js"

export type Executable = {
	commit: () => void
}

export type Proposal = {commit: () => void} | Denial

