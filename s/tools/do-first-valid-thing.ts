
export function doFirstValidThing(fns: (() => boolean)[]) {
	for (const fn of fns) {
		const result = fn()
		if (result)
			return result
	}
	return false
}

