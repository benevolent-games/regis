
export function wherefor<X, R>(x: X | undefined | null, fn: (x: X) => R) {
	return (x === undefined || x === null)
		? undefined
		: fn(x)
}

