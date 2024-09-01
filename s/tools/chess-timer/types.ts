
export type TimeRules = {
	limit: number
	delay: number
	charity: number
}

export type TimeReport = {
	gameTime: number
	teamwise: TeamTimeReport[]
}

export type TeamTimeReport = {

	/** how long before expiration */
	remaining: number | null

	/** true if the player should lose on time */
	expired: boolean

} & TimeRecord

export type TimeRecord = {

	/** actual elapsed amount of time */
	elapsed: number

	/** accumulation of delay and charity benefits */
	benefits: number
}

