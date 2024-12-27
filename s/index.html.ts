
import "@benev/slate/x/node.js"
import {template, html, easypage, git_commit_hash, headScripts, read_file} from "@benev/turtle"

export default template(async basic => {
	const path = basic.path(import.meta.url)

	return easypage({
		path,
		dark: true,
		css: "index.css",
		title: "Regis.gg",
		head: html`
			<link rel="icon" href="/assets/graphics/knight-icon.webp"/>

			<link rel="preconnect" href="https://fonts.googleapis.com">
			<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
			<link href="https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">

			<link rel="stylesheet" href="${path.version.root("index.css")}"/>
			<meta data-commit-hash="${await git_commit_hash()}"/>

			${headScripts({
				devModulePath: "index.bundle.js",
				prodModulePath: "index.bundle.min.js",
				importmapContent: await read_file("x/importmap.json"),
			})}
		`,
		body: html`
			<game-app>
				<header class=logo>
					<h1><span>Regis</span><span>.gg</span></h1>
					<h2>A New Kind of 1v1 Strategy Game</h2>
					<small class="glow-blue">Alpha</small>
				</header>
			</game-app>
		`,
	})
})

