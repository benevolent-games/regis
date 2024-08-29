
export class Denial {
	constructor(public reason: string) {}
}

export class SpawnDenial extends Denial {
	constructor(public reason: string) {
		super(`spawn denied: ${reason}`)
	}
}

export class MovementDenial extends Denial {
	constructor(public reason: string) {
		super(`movement denied: ${reason}`)
	}
}

export class AttackDenial extends Denial {
	constructor(public reason: string) {
		super(`attack denied: ${reason}`)
	}
}

export class InvestmentDenial extends Denial {
	constructor(public reason: string) {
		super(`investment denied: ${reason}`)
	}
}

export class WrongTeamDenial extends Denial {
	constructor(public teamIndex: number) {
		super(`wrong team: this user cannot control team ${teamIndex}`)
	}
}

