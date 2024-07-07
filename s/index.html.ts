
import {template, html, easypage, startup_scripts_with_dev_mode, git_commit_hash} from "@benev/turtle"

export default template(async basic => {
	const path = basic.path(import.meta.url)

	return easypage({
		path,
		dark: true,
		css: "index.css",
		title: "tinyforge.benev.gg",
		head: html`
			<link rel="icon" href="/assets/benevolent.svg"/>
			<link rel="stylesheet" href="${path.version.root("index.css")}"/>
			<meta data-commit-hash="${await git_commit_hash()}"/>
			${startup_scripts_with_dev_mode({
				path,
				scripts: [{
					module: "index.bundle.js",
					bundle: "index.bundle.min.js",
					hash: false,
				}],
			})}
		`,
		body: html`
			<game-app></game-app>
		`,
	})
})

