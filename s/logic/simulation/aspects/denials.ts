
/** a denial represents a rejected turn choice */
export class Denial {
	constructor(public reason: string) {}
}

/**
 * a soft denial means the choice is invalid, but would be valid under other circumstances.
 * eg, this movement is possible, but you're on the wrong team.
 * this is used to determine whether we can display pattern-indicators,
 * for when the user is exploring the movement possibilities of an opponent's units.
 */
export class SoftDenial extends Denial {}

/**
 * a hard denial means the choice would never be valid under any circumstance.
 * eg, this movement is not possible, an obstacle blocks the path.
 */
export class HardDenial extends Denial {}

//
// soft denials
//

export class WrongTeamDenial extends SoftDenial {
	constructor() {
		super(`wrong team`)
	}
}

export class GameOverDenial extends SoftDenial {
	constructor() {
		super(`game over`)
	}
}

//
// hard denials
//

export class SpawnDenial extends HardDenial {
	constructor(reason: string) {
		super(`spawn denied: ${reason}`)
	}
}

export class MovementDenial extends HardDenial {
	constructor(reason: string) {
		super(`movement denied: ${reason}`)
	}
}

export class AttackDenial extends HardDenial {
	constructor(reason: string) {
		super(`attack denied: ${reason}`)
	}
}

export class InvestmentDenial extends HardDenial {
	constructor(reason: string) {
		super(`investment denied: ${reason}`)
	}
}

