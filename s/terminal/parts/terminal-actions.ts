
import {UnitKind} from "../../config/units.js"

export type TerminalActions = {
	commitTurn: () => void
	resetPreview: () => void
	selectRosterUnit: (teamId: number, unitKind: UnitKind) => void
}

