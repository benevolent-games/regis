
export class Trashbin {
	#fns: (() => void)[] = []

	add = (fn: () => void) => {
		this.#fns.push(fn)
	}

	bag = <X>(x: X, fn: (x: X) => void) => {
		this.add(() => fn(x))
		return x
	}

	disposable = <X extends {dispose: () => void}>(x: X) => {
		return this.bag(x, () => x.dispose())
	}

	dispose = () => {
		for (const fn of this.#fns.reverse())
			fn()
		this.#fns = []
	}
}

