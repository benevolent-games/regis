
import {deep} from "@benev/slate"

export type CapsuleListenerFn<X> = (x: X) => void

export class Capsule<X> {
	#value: X
	#listeners = new Set<CapsuleListenerFn<X>>()

	constructor(x: X) {
		this.#value = x
	}

	on(fn: CapsuleListenerFn<X>, initiate = false) {
		this.#listeners.add(fn)
		if (initiate)
			fn(this.#value)
		return () => this.#listeners.delete(fn)
	}

	publish() {
		const x = this.#value
		for (const fn of this.#listeners)
			fn(x)
	}

	get value() {
		return this.#value
	}

	set value(x: X) {
		this.set(x)
	}

	set(x: X, forcePublish = false) {
		if (forcePublish) {
			this.#value = x
			this.publish()
		}
		else {
			const changed = !deep.equal(this.#value, x)
			if (changed) {
				this.#value = x
				this.publish()
			}
		}
	}

	dispose() {
		this.#listeners.clear()
	}
}

