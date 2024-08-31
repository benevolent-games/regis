
import {signal} from "@benev/slate"

export class TimeDisplay {
	ourTeam = signal(true)
	remaining = signal<number | null>(null)
}

