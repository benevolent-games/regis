
import "@benev/slate/x/node.js"
import markdownIt from "markdown-it"
import articleMd from "./article.md.js"
import {template, html, easypage, startup_scripts_with_dev_mode, git_commit_hash, unsanitized} from "@benev/turtle"

const md = markdownIt()

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
			<game-app>
				<header slot=lead>
					<h1>regis</h1>
					<p>a new game like chess, but reworked to play like a modern rts.</p>
				</header>
				<article>
					${unsanitized(md.render(articleMd))}
				</article>
			</game-app>
		`,
	})
})

