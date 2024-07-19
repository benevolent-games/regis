
export type Getter<S> = () => S
export type Setter<S> = (s: S) => void

export type StateReader<S> = {
	get: () => S
}

export type StateWriter<S> = {
	get: () => S
	set: (s: S) => void
}

export class StateMap<K, V> {
	#state: StateWriter<[K, V][]>

	constructor(state: StateWriter<[K, V][]>) {
		this.#state = state
	}

	#makeMap() {
		return new Map<K, V>(this.#state.get())
	}

	get(key: K) {
		return this.#makeMap().get(key)
	}

	has(key: K) {
		return this.#makeMap().has(key)
	}

	set(key: K, value: V) {
		const map = this.#makeMap()
		map.set(key, value)
		this.#state.set([...map.entries()])
		return this
	}
}

