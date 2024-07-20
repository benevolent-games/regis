
export function wherefor<X, R>(x: X | undefined, fn: (x: X) => R) {
	return x === undefined
		? undefined
		: fn(x)
}

