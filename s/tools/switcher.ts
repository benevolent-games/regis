
export function switcher<K extends string, R>(key: K, cases: {[P in K]: R}) {
	return cases[key]
}

