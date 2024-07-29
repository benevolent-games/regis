
export function need<X>(x: X | null | undefined, message = "unmet requirement"): X {
	if (x === undefined || x === null)
		throw new Error(message)
	return x
}

