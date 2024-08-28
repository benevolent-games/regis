
export function randomMap() {
	// return {name: "override", ascii: mapPool.bridge}

	const maplist = Object.entries(mapPool)
	const index = Math.floor(Math.random() * maplist.length)
	const [name, ascii] = maplist[index]
	return {name, ascii}
}

export const blankMap = `
	.    .    .    .    .    .    .    .
	.    .    .    .    .    .    .    .
	.    .    .    .    .    .    .    .
	.    .    .    .    .    .    .    .
	.    .    .    .    .    .    .    .
	.    .    .    .    .    .    .    .
	.    .    .    .    .    .    .    .
	.    .    .    .    .    .    .    .
`

export const mapPool = {

	// blankMap: `
	// 	.    .    .    .    .    .    .    .
	// 	.    .    .    .    .    .    .    .
	// 	.    .    .    .    .    .    .    .
	// 	.    .    .    .    .    .    .    .
	// 	.    .    .    .    .    .    .    .
	// 	.    .    .    .    .    .    .    .
	// 	.    .    .    .    .    .    .    .
	// 	.    .    .    .    .    .    .    .
	// `,

	// bridgePreset: `
	// 	#b   #$♟  #    =^   =^%  =^   #    #$♕
	// 	#    #♚   #a   .    .    .    #♖   #
	// 	=^♝  =    .^   .^   .^   .^   =$   =^
	// 	=    =♞   =    =    =    =    =    =
	// 	=    =    =    =    =    =    =♘   =
	// 	=^   =$   .^   .^   .^   .^   =♗   =^
	// 	#    #♜   .    .    .    #a   #♔   #
	// 	#$♛  #    =^   =^%  =^   #    #$♙  #b
	// `,

	bridge: `
		#b   #$   #    =^   =^%  =^   #    #$
		#    #♚   #a   .    .    .    #    #
		=^   =    .^   .^   .^   .^   =$   =^
		=    =    =    =    =    =    =    =
		=    =    =    =    =    =    =    =
		=^   =$   .^   .^   .^   .^   =    =^
		#    #    .    .    .    #a   #♔   #
		#$   #    =^   =^%  =^   #    #$   #b
	`,

	overpass: `
		=    =    .    .    .    .    =    =
		=    =    =^   #    #    =^   =    =
		=    =    =^   #    #    =^   =    =
		=$   =    .    .    .    .    =    =$
		#    =    .    .    .    .    =    #
		=    =    =    .    .    =    =    =
		=k   =♔   =a   .    .    =a   =♚   =k
		.^   =$   =r   .    .    =r   =$   .^
	`,

	basin: `
		#^a  #^$  #    =^%  =^%  #    #^$  #^a
		#^k  #♔   #    =%   =%   #    #♚   #^k
		#^r  #    #    .^   .^   #    #    #^r
		#    #    #    .    .    #    #    #
		=^   =    .^   .    .    .^   =    =^
		=    =    #    .    .    #    =    =
		=    =    .^   .    .    .^   =    =
		=$   =    .^   .    .    .^   =    =$
	`,

	basin2: `
		#^a  #^$  #    x    x    #    #^$  #^a
		#^k  #♔   #    x    x    #    #♚   #^k
		#^r  #    #    .    .    #    #    #^r
		#    #    #    .    .    #    #    #
		=^   =    .^   .    .    .^   =    =^
		=    =    #    .    .    #    =    =
		=    =    .^   .    .    .^   =    =
		=$   =    .^   .    .    .^   =    =$
	`,

	crossover: `
		=$   =♚   =    .^   .^   =    =    =$
		=k   =r   =    .    .    =    =    =a
		=^%  =^%  =^%  .    .    #    =    #
		=    =    =    =    =    =    =    =
		=    =    =    =    =    =    =    =
		#    =    #    .    .    =^%  =^%  =^%
		=a   =    =    .    .    =    =r   =k
		=$   =    =    .^   .^   =    =♔   =$
	`,

	monument: `
		.^$  .    .%   .    .    .^a  .^$  =
		.    .    #    .    .    .    .♚   .^k
		.    .^   =    =^   .    .    .    .^r
		.    .^   =    #    #    .    .    .
		.    .    .    #    #    =    .^   .
		.^r  .    .    .    =^   =    .^   .
		.^k  .♔   .    .    .    #    .    .
		=    .^$  .^a  .    .    .%   .    .^$
	`,

	catwalk: `
		x    x    x    x    x    x    x    x
		=    =    =^   #    .    .    .♔   x
		.^   .^   .    #    .    .    .    x
		.    .    .    #    .    .    .    x
		.    .    .    #    .    .    .    x
		.    .    .    #    .    .    .    x
		.    .    .    #    .    .^   .^   x
		.♚   .    .    #    =^   =    =    x
	`,

	canal: `
		=    =    .^   .    .    #^   =    =♚
		=    =    .^   .    .    #    =    =$
		=    =    #    .    .    #^   =    =
		=    #^   #^   .    .    #    =    =
		=    =    #    .    .    #^   #^   =
		=    =    #^   .    .    #    =    =
		=$   =    #    .    .    .^   =    =
		=♔   =    #^   .    .    .^   =    =
	`,

	slanted: `
		=$   =    .^   =    =$   .    .    .♚
		=    =    .^   =    =    .    .    .$
		.    .    .    .    .    .    .    .
		.    =    =    .    .    =    =    .
		.    =    =    .    .    =    =    .
		.    .    .    .    .    .    .    .
		.$   .    .    =    =    .^   =    =
		.♔   .    .    =$   =    .^   =    =$
	`,

	finlayson: `
		.    .    .    .    .    .    .    .♚
		.    .^   .^   .^   .^   .^   .    .$
		.    .^   =    =^   =    =    .^   .
		.    .^   =^   #    #$   =    .^   .
		.    .^   =    #$   #    =^   .^   .
		.    .^   =    =    =^   =    .^   .
		.$   .    .^   .^   .^   .^   .^   .
		.♔   .    .    .    .    .    .    .
	`,

	battlements: `
		.$   .    .    .♚   .    .    .    .$
		.^   .    .    .^   .    .^   .    .^
		=    .    .    =    .    =    .    =
		=    .    .    .    .    .    .    .
		.    .    .    .    .    .    .    =
		=    .    =    .    =    .    .    =
		.^   .    .^   .    .^   .    .    .^
		.$   .    .    .    .♔   .    .    .$
	`,

} satisfies Record<string, string>

