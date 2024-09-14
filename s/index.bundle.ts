
import {SmartCache} from "./tools/smart-cache.js"

void async function main() {
	const {url} = new SmartCache()
	await import(url("./starter.js"))
}()

