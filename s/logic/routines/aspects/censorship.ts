
import {Vec2} from "@benev/toolbox"
import {FullTeamInfo, LimitedTeamInfo, Unit} from "../../state"

//
// functions relating to fog-of-war
//

export function censorUnits(units: Unit[], vision: Vec2[]) {
	return units.filter(unit => vision.includes(unit.place))
}

export function censorTeam(team: FullTeamInfo): LimitedTeamInfo {
	return {
		name: team.name,
		investments: [],
	}
}

