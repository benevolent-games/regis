
export function randomMap(): MapData {
	return {name: "pontifex", ...mapPool.pontifex}

	const maplist = Object.entries(mapPool)
	const index = Math.floor(Math.random() * maplist.length)
	const [name, spec] = maplist[index]
	return {
		name,
		ascii: spec.ascii,
		author: spec.author,
	}
}

export type MapSpec = {
	ascii: string
	author: string
}

export type MapData = {
	name: string
	author: string
	ascii: string
}

export const mapPool = {

	// blank: {
	// 	author: "chase",
	// 	ascii: `
	// 		.    .    .    .    .    .    .    .
	// 		.    .    .    .    .    .    .    .
	// 		.    .    .    .    .    .    .    .
	// 		.    .    .    .    .    .    .    .
	// 		.    .    .    .    .    .    .    .
	// 		.    .    .    .    .    .    .    .
	// 		.    .    .    .    .    .    .    .
	// 		.    .    .    .    .    .    .    .
	// 	`,
	// },

	// bridgePreset: {
	// 	author: "chase",
	// 	ascii: `
	// 		#b   #$♟  #    =^   =^%  =^   #    #$♕
	// 		#    #♚   #A   .    .    .    #♖   #
	// 		=^♝  =    .^   .^   .^   .^   =$   =^
	// 		=    =♞   =    =    =    =    =    =
	// 		=    =    =    =    =    =    =♘   =
	// 		=^   =$   .^   .^   .^   .^   =♗   =^
	// 		#    #♜   .    .    .    #A   #♔   #
	// 		#$♛  #    =^   =^%  =^   #    #$♙  #b
	// 	`,
	// },

	bridge: {
		author: "chase",
		ascii: `
			#b   #$   #    =^   =^%  =^   #    #$
			#    #♚   #A   .    .    .    #    #
			=^   =    .^   .^   .^   .^   =$   =^
			=    =    =    =    =    =    =    =
			=    =    =    =    =    =    =    =
			=^   =$   .^   .^   .^   .^   =    =^
			#    #    .    .    .    #A   #♔   #
			#$   #    =^   =^%  =^   #    #$   #b
		`,
	},

	overpass: {
		author: "chase",
		ascii: `
			=    =    .    .    .    .    =    =
			=    =    =^   #    #    =^   =    =
			=    =    =^   #    #    =^   =    =
			=$   =    .    .    .    .    =    =$
			#    =    .    .    .    .    =    #
			=    =    =    .    .    =    =    =
			=k   =♔   =A   .    .    =A   =♚   =k
			.^   =$   =r   .    .    =r   =$   .^
		`,
	},

	basin: {
		author: "chase",
		ascii: `
			#^A  #^$  #    =^%  =^%  #    #^$  #^A
			#^k  #♔   #    =%   =%   #    #♚   #^k
			#^r  #    #    .^   .^   #    #    #^r
			#    #    #    .    .    #    #    #
			=^   =    .^   .    .    .^   =    =^
			=    =    #    .    .    #    =    =
			=    =    .^   .    .    .^   =    =
			=$   =    .^   .    .    .^   =    =$
		`,
	},

	basin2: {
		author: "chase",
		ascii: `
			#^A  #^$  #    x    x    #    #^$  #^A
			#^k  #♔   #    x    x    #    #♚   #^k
			#^r  #    #    .    .    #    #    #^r
			#    #    #    .    .    #    #    #
			=^   =    .^   .    .    .^   =    =^
			=    =    #    .    .    #    =    =
			=    =    .^   .    .    .^   =    =
			=$   =    .^   .    .    .^   =    =$
		`,
	},

	crossover: {
		author: "chase",
		ascii: `
			=$   =♚   =    .^   .^   =    =    =$
			=k   =r   =    .    .    =    =    =A
			=^%  =^%  =^%  .    .    #    =    #
			=    =    =    =    =    =    =    =
			=    =    =    =    =    =    =    =
			#    =    #    .    .    =^%  =^%  =^%
			=A   =    =    .    .    =    =r   =k
			=$   =    =    .^   .^   =    =♔   =$
		`,
	},

	monument: {
		author: "chase",
		ascii: `
			.^$  .    .%   .    .    .^A  .^$  =
			.    .    #    .    .    .    .♚   .^k
			.    .^   =    =^   .    .    .    .^r
			.    .^   =    #    #    .    .    .
			.    .    .    #    #    =    .^   .
			.^r  .    .    .    =^   =    .^   .
			.^k  .♔   .    .    .    #    .    .
			.    .^$  .^A  .    .    .%   .    .^$
		`,
	},

	catwalk: {
		author: "chase",
		ascii: `
			x    x    x    x    x    x    x    x
			=    =    =^   #    =^   =    .^   x
			.^   .^   .    #    .    .    .    x
			.A   .    .    #    .    .    .♔   x
			.B   .    .    #    .    .    .B   x
			.♚   .    .    #    .    .    .A   x
			.    .    .    #    .    .^   .^   x
			.^   =    =^   #    =^   =    =    x
		`,
	},

	canal: {
		author: "chase",
		ascii: `
			=    =    .^   .    .    #^   =    =♚
			=    =    .^   .    .    #    =    =$
			=    =    #    .    .    #^   =    =r
			=A   =    #^   .    .    #    =    =k
			=k   =    #    .    .    #^   =    =A
			=r   =    #^   .    .    #    =    =
			=$   =    #    .    .    .^   =    =
			=♔   =    #^   .    .    .^   =    =
		`,
	},

	slanted: {
		author: "chase",
		ascii: `
			=$   =r   .^   =A   =$   .    .    .♚
			=k   =    .^   =    =    .    .    .$
			.    .    .    .    .    .    .    .
			.    =    =    .    .    =    =    .
			.    =    =    .    .    =    =    .
			.    .    .    .    .    .    .    .
			.$   .    .    =    =    .^   =    =k
			.♔   .    .    =$   =A   .^   =r   =$
		`,
	},

	finlayson: {
		author: "chase",
		ascii: `
			.    .    .    .    .    .k   .r   .$
			.    .^   .^   .^   .^   .^   .    .♚
			.    .^   =    =^   =    =    .^   .A
			.    .^   =^   #    #$   =    .^   .
			.    .^   =    #$   #    =^   .^   .
			.A   .^   =    =    =^   =    .^   .
			.♔   .    .^   .^   .^   .^   .^   .
			.$   .r   .k   .    .    .    .    .
		`,
	},

	battlements: {
		author: "chase",
		ascii: `
			.$   .B   .A   .♚   .    .    .    .$
			.^   .    .    .^   .    .^   .    .^
			=    .    .    =    .    =    .    =
			=    .    .    .    .    .    .    .
			.    .    .    .    .    .    .    =
			=    .    =    .    =    .    .    =
			.^   .    .^   .    .^   .    .    .^
			.$   .    .    .    .♔   .A   .B   .$
		`,
	},

	opposition: {
		author: "chase",
		ascii: `
			=$   =♚   .    .    .    .    .    .$
			=B   =    .    .    .$   =    .    .
			=A   =    .    .    .    .    .    .
			=    =    .    .    .    .    .^   .^
			.^   .^   .    .    .    .    =    =
			.    .    .    .    .    .    =    =A
			.    .    =    .$   .    .    =    =B
			.$   .    .    .    .    .    =♔   =$
		`,
	},

	simplex: {
		author: "chase",
		ascii: `
			.$   .♚   =    .    .    .    .    .$
			.B   .    .    .    =    .    .    .
			.A   .    =    .    .    .    .    .
			.    .    =    .    .    =    =    .
			.    =    =    .    .    =    .    .
			.    .    .    .    .    =    .    .A
			.    .    .    =    .    .    .    .B
			.$   .    .    .    .    =    .♔   .$
		`,
	},

	skywalker: {
		author: "chase",
		ascii: `
			#$   #    #    #    #    .    #    #$
			#B   #♚   .    .    #    .    #    #
			#A   #    .    .    #    #    #    #
			#    #    #    #    #    .    .    #
			#    .    .    #    #    #    #    #
			#    #    #    #    .    .    #    #A
			#    #    .    #    .    .    #♔   #B
			#$   #    .    #    #    #    #    #$
		`,
	},

	cubicles: {
		author: "chase",
		ascii: `
			=    =    =    =    =    =    =    =
			.$   .k   .r   .    .    .    .    =
			.A   .♚   .    .    =    .    .    =
			.    .    .    .    =    .    .    =
			.    =    =    =    =    =    .    =
			.    .    =    .    .    .    .    =
			.    .    =    .    .    .♔   .A   =
			.    .    .    .    .r   .k   .$   =
		`,
	},

	dashes: {
		author: "chase",
		ascii: `
			=    =    =    =    =    =    =    =
			.$   .k   .r   .    .    .    .    =
			.A   .♚   .    .    .    .    .    =
			.    .    .    .    .    .    .    =
			=    .%   =    .    =    .%   =    =
			.    .    .    .    .    .    .    =
			.    .    .    .    .    .♔   .A   =
			.    .    .    .    .r   .k   .$   =
		`,
	},

	pontifex: {
		author: "chase",
		ascii: `
			=$$  =    .^   #    =    =q   =k   =$♚^
			=b   =    .^   .^   =    =    =    =r
			.^   .^   .    .    #    #    =    =$
			#    .^   .    .    .*   #    =    =
			=    =    #    .*   .    .    .^   #
			=$   =    #    #    .    .    .^   .^
			=r   =    =    =    .^   .^   =    =b
			=$♔^ =k   =q   =    #    .^   =    =$$
		`,
	},

} satisfies Record<string, MapSpec>

