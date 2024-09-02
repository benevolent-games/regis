
import {UnitKind} from "../../logic/state.js"

export type TerminalActions = {
	commitTurn: () => void
	resetPreview: () => void
	selectRosterUnit: (teamId: number, unitKind: UnitKind) => void
}

