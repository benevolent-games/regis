
import "@benev/slate/x/node.js"
// import markdownIt from "markdown-it"
import {template, html, easypage, startup_scripts_with_dev_mode, git_commit_hash, unsanitized} from "@benev/turtle"

// const md = markdownIt()
//
// async function getArticle() {
// 	const {default: articleMd} = await import(`./article.md.js?nocache=${Date.now()}`)
// 	return md.render(articleMd)
// }

export default template(async basic => {
	const path = basic.path(import.meta.url)

	return easypage({
		path,
		dark: true,
		css: "index.css",
		title: "regis.gg",
		head: html`
			<link rel="icon" href="/assets/graphics/knight-icon.webp"/>

			<link rel="preconnect" href="https://fonts.googleapis.com">
			<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
			<link href="https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">

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
				<header class=logo>
					<h1><span>Regis</span><span>.gg</span></h1>
					<h2>“The Final Argument of Kings”</h2>
					<small class="glow-blue">Alpha</small>
				</header>
			</game-app>
		`,
	})
})

