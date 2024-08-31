
export class Map2<K, V> extends Map<K, V> {
	static require<K, V>(map: Map<K, V>, key: K) {
		const value = map.get(key)
		if (value === undefined)
			throw new Error(`required key not found: "${key}"`)
		return value
	}

	static guarantee<K, V>(map: Map<K, V>, key: K, make: () => V) {
		let value = map.get(key)

		if (value === undefined) {
			value = make()
			map.set(key, value)
		}

		return value
	}

	require(key: K) {
		return Map2.require(this, key)
	}

	guarantee(key: K, make: () => V) {
		Map2.guarantee(this, key, make)
	}
}

export type Identifiable = {id: any}

export class IdMap2<K, V extends Identifiable> extends Map2<K, V> {
	got(value: V) {
		return this.has(value.id)
	}

	add(value: V) {
		this.set(value.id, value)
		return value
	}

	remove(value: V) {
		return this.delete(value.id)
	}
}

export class Mappable2<K, V> {
	map = new Map2<K, V>()

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

	get size() {
		return this.map.size
	}

	get = this.map.get.bind(this.map)
	require = this.map.require.bind(this.map)
}

export class IdMappable2<K, V extends Identifiable> extends Mappable2<K, V> {
	map = new IdMap2<K, V>()
	got = this.map.got.bind(this.map)
}

