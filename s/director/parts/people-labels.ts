
import {HatPuller} from "../../tools/hat-puller.js"

const emojiFaces = [
	"🧔", "🧙", "🐰", "🐶", "🐻", "🌞", "🐱", "🐷", "🐭", "🐼", "🐸", "🐮", "🐴", "🐹", "🌝", "🌜", "🐯", "🐵", "🐺", "🤖", "😈",
]

export class PeopleLabels {
	count = 1
	emojis = new HatPuller<string>(emojiFaces)

	next() {
		const count = this.count++
		const emoji = this.emojis.pull()
		return emoji + count
	}
}

