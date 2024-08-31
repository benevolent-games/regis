
export class Mappable<K, V> {
	map = new Map<K, V>()

	;[Symbol.iterator]() {
		return this.map.entries()
	}

	entries() {
		return this.map.entries()
	}

	keys() {
		return this.map.keys()
	}

	values() {
		return this.map.values()
	}
}

