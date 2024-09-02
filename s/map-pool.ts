
import {MapSpec} from "./logic/ascii/types.js"

export const mapPool = {

	sven: {
		author: "chase",
		ascii: `
			=$$% =$   =    =    =    =^   #    #$
			=    =    =    =    =    =^   #♚   #k
			=    #    .^   .^   =    =    #q   #b
			.^   .    .    .    .    .    #$   #r
			#r   #$   .    .    .    .    .    .^
			#b   #q   =    =    .^   .^   #    =
			#k   #♔   =^   =    =    =    =    =
			#$   #    =^   =    =    =    =$   =$$%
		`,
	},

	basic: {
		author: "chase",
		ascii: `
			=$$% =$   =    =    =^   #    #k   #$$
			=$   =    =    =    =^   #    #b   #r
			.    .^   .^   .^   .    #♚   #q   #$
			.    .    .    .    .    .    .    .
			.    .    .    .    .    .    .    .
			#$   #q   #♔   .    .^   .^   .^   .
			#r   #b   #    =^   =    =    =    =$
			#$$  #k   #    =^   =    =    =$   =$$%
		`,
	},

	jman: {
		author: "chase",
		ascii: `
			=$   =q   =^   #    #    =^   =q   =$
			=    =    =^   #    #    =^   =    =
			=    #$   #    #    #    #    #$   =
			=    #b   #    #    #    #    #b   =
			=    =    =^   #    #    =^   =    =
			=♔   =    =    #    #    =    =    =♚
			=k   =r   =    #    #    =    =r   =k
			=$   =$   =    #$   #$   =    =$   =$
		`,
	},

	competitor: {
		author: "chase",
		ascii: `
			#$$  #k   #    =^   =    =$   #$   #$$%
			#r   #b   #    =^   =    =    =^   #
			#$   #q   #♚   .^   .^   .^   .^   =^
			=^   .    .    .    .    .    .    =
			=    .    .    .    .    .    .    =^
			=^   .^   .^   .^   .^   #♔   #q   #$
			#    =^   =    =    =^   #    #b   #r
			#$$% #$   =    =    =^   #    #k   #$$
		`,
	},

	// rift: {
	// 	author: "chase",
	// 	ascii: `
	// 		#$♚  #B   #A   .$$  .    .^   =    =$
	// 		#    #    #$   .    .    .^   =    =
	// 		#    #    #    .    #    .^   =    =
	// 		=^   =^   .^$$ .    .    .^   =    =
	// 		=    =    .^   .    .    .^$$ =^   =^
	// 		=    =    .^   #    .    #    #    #
	// 		=    =    .^   .    .    #$   #    #
	// 		=$   =    .^   .    .    #A   #B   #$♔
	// 	`,
	// },

	// ridgeline: {
	// 	author: "chase",
	// 	ascii: `
	// 		#$♚  =^   =    .^   .    .    .    .$
	// 		#k   =^   =    .^   .    #    .    .
	// 		#r   =^   .$   #    .    .    .    .
	// 		#b   =^   .    .    .*   .    =^   #q
	// 		#q   =^   .    .*   .    .    =^   #b
	// 		.    .    .    .    #    .$   =^   #r
	// 		.    .    #    .    .^   =    =^   #k
	// 		.$   .    .    .    .^   =    =^   #$♔
	// 	`,
	// },

	bingus: {
		author: "supreme being",
		ascii: `
			#$♚  r#    #    =^   =    =    #*    #$$
			#$     #    #    =^   =    =    =^   #A
			#     #    k#    .    .^   .^   .^  =^%
			=^%    .    .    .    .    .    .    =
			=     .    .    .    .    .    .    =^%
			=^%     .^   .^   .^   .    #k    #   #
			#A     =^   =    =    =^   #    #    #$
			#$$   #*    =    =    =^   #    #r   #$♔
		`,
	},

	chestersField: {
		author: "chase",
		ascii: `
			=$   =^   #    #    #b   #r   #k   #$
			=    =^   #    #    #    #    #♚   #$
			=    =    =$   .$$  .    .    .    .$
			.^   .^   .*   .    .    .    .    .
			.    .    .    .    .    .*   .^   .^
			.$   .    .    .    .$$  =$   =    =
			#$   #♔   #    #    #    #    =^   =
			#$   #k   #r   #b   #    #    =^   =$
		`,
	},

	// midpit: {
	// 	author: "chase",
	// 	ascii: `
	// 		=$   =    .^   #$   #♚   =^   =    =b
	// 		=    =    .^   #r^  #k^  .    =    =
	// 		=^   =^   .^   .    .    .    =^*  =^
	// 		#    #    .^   .    .    .^   #$   #
	// 		#    #$   .^   .    .    .^   #    #
	// 		=^   =^*  .    .    .    .^   =^   =^
	// 		=    =    .    #k^  #r^  .^   =    =
	// 		=b   =    =^   #♔   #$   .^   =    =$
	// 	`,
	// },

	noMansLand: {
		author: "chase",
		ascii: `
			=$   =    =^   #    #    =^   =    =$
			=    =    =^   #♚   #r   =    =    =
			.^   .^   #$   #$   #b   #k   .^   .^
			.*   .    .    .    .    .    .    .
			.    .    .    .    .    .    .    .*
			.^   .^   #k   #b   #$   #$   .^   .^
			=    =    =    #r   #♔   =^   =    =
			=$   =    =^   #    #    =^   =    =$
		`,
	},

	breakdown: {
		author: "chase",
		ascii: `
			#$$  #♚   =^   =    =    =    =    =$
			#b   #k   =    =    =    .    .    =
			#r   .    .    =    =    =    =    =
			.    .    =$^  =    .    =    =    =^
			.    .    =$^  =    .    =    =    =^
			#r   .    .    =    =    =    =    =
			#b   #k   =    =    =    .    .    =
			#$$  #♔   =^   =    =    =    =    =$
		`,
	},

	divided: {
		author: "chase",
		ascii: `
			#q   #b   #r   #k   #$   .    .    .$
			#    #    #    #♚   #$   .    .    .
			=^$  =^   .^   .    .    .    .    .^
			=    =    .^   .    .    .^   =    =
			=    =    .^   .    .    .^   =    =
			.^   .    .    .    .    .^   =^   =^$
			.    .    .    #$   #♔   #    #    #
			.$   .    .    #$   #k   #r   #b   #q
		`,
	},

	superlative: {
		author: "chase",
		ascii: `
			#    =^   =    #q   #b   #r   #k   #$
			#$   =^   =    =^   =^   =^   =^♚  =$^
			#$   =    =    x    x    x    x    x
			=    =    .^   .    .    .^   .^   .^
			.^   .^   .^   .    .    .^   =    =
			x    x    x    x    x    =    =    #$
			=$^  =^♔  =^   =^   =^   =    =^   #$
			#$   #k   #r   #b   #q   =    =^   #
		`,
	},

	// knifefight: {
	// 	author: "chase",
	// 	ascii: `
	// 		#    #    #    #    #    #    #    #
	// 		=    .^   .$$  .k   .r   .b   #    .q
	// 		=$$$ .    .    .    .    .    .    .$$
	// 		.    .    .    .♚   .$$$ .    .    .
	// 		.    .    #    #    #    #    .    .
	// 		.    .    .    .$$$ .♔   .    .    .
	// 		.    .    .    .    .    .    .    =$$$
	// 		.q   #    .b   .r   .k   .$$  .^   =
	// 	`,
	// },
	//
	// cornered: {
	// 	author: "chase",
	// 	ascii: `
	// 		.^$$ .^   .^   .    .    .    .    .
	// 		.^   =    =q   .    .    .^   =r   .
	// 		.^   =b   .$$  .    .    .    .^   .
	// 		.    .    .    .♚   #    .    .    .
	// 		.    .    .    #    .♔   .    .    .
	// 		.    .^   .    .    .    .$$  =q   .
	// 		.    =k   .^   .    .    =b   =    .^
	// 		.    .    .    .    .    .    .^   .^$$
	// 	`,
	// },

	pullapart: {
		author: "chase",
		ascii: `
			#$$  =^   =    =    =♚   =    =^   #r
			#$   #q   =    =    =    =    #b   #k
			.    .    .^   =    =    .^   .    .
			.    .*   #    =    =    .^   .    .$
			.$   .    .^   =    =    #    .*   .
			.    .    .^   =    =    .^   .    .
			#k   #b   =    =    =    =    #q   #$
			#r   =^   =    =♔   =    =    =^   #$$
		`,
	},

// 	blank: {
// 		author: "chase",
// 		ascii: `
// 			.    .    .    .    .    .    .    .
// 			.    .    .    .    .    .    .    .
// 			.    .    .    .    .    .    .    .
// 			.    .    .    .    .    .    .    .
// 			.    .    .    .    .    .    .    .
// 			.    .    .    .    .    .    .    .
// 			.    .    .    .    .    .    .    .
// 			.    .    .    .    .    .    .    .
// 		`,
// 	},

	//
	// bridge: {
	// 	author: "chase",
	// 	ascii: `
	// 		#b   #$   #    =^   =^%  =^   #    #$
	// 		#    #♚   #A   .    .    .    #    #
	// 		=^   =    .^   .^   .^   .^   =$   =^
	// 		=    =    =    =    =    =    =    =
	// 		=    =    =    =    =    =    =    =
	// 		=^   =$   .^   .^   .^   .^   =    =^
	// 		#    #    .    .    .    #A   #♔   #
	// 		#$   #    =^   =^%  =^   #    #$   #b
	// 	`,
	// },
	//
	// overpass: {
	// 	author: "chase",
	// 	ascii: `
	// 		=    =    .    .    .    .    =    =
	// 		=    =    =^   #    #    =^   =    =
	// 		=    =    =^   #    #    =^   =    =
	// 		=$   =    .    .    .    .    =    =$
	// 		#    =    .    .    .    .    =    #
	// 		=    =    =    .    .    =    =    =
	// 		=k   =♔   =A   .    .    =A   =♚   =k
	// 		.^   =$   =r   .    .    =r   =$   .^
	// 	`,
	// },
	//
	// basin: {
	// 	author: "chase",
	// 	ascii: `
	// 		#^A  #^$  #    =^%  =^%  #    #^$  #^A
	// 		#^k  #♔   #    =%   =%   #    #♚   #^k
	// 		#^r  #    #    .^   .^   #    #    #^r
	// 		#    #    #    .    .    #    #    #
	// 		=^   =    .^   .    .    .^   =    =^
	// 		=    =    #    .    .    #    =    =
	// 		=    =    .^   .    .    .^   =    =
	// 		=$   =    .^   .    .    .^   =    =$
	// 	`,
	// },
	//
	// basin2: {
	// 	author: "chase",
	// 	ascii: `
	// 		#^A  #^$  #    x    x    #    #^$  #^A
	// 		#^k  #♔   #    x    x    #    #♚   #^k
	// 		#^r  #    #    .    .    #    #    #^r
	// 		#    #    #    .    .    #    #    #
	// 		=^   =    .^   .    .    .^   =    =^
	// 		=    =    #    .    .    #    =    =
	// 		=    =    .^   .    .    .^   =    =
	// 		=$   =    .^   .    .    .^   =    =$
	// 	`,
	// },
	//
	// crossover: {
	// 	author: "chase",
	// 	ascii: `
	// 		=$   =♚   =    .^   .^   =    =    =$
	// 		=k   =r   =    .    .    =    =    =A
	// 		=^%  =^%  =^%  .    .    #    =    #
	// 		=    =    =    =    =    =    =    =
	// 		=    =    =    =    =    =    =    =
	// 		#    =    #    .    .    =^%  =^%  =^%
	// 		=A   =    =    .    .    =    =r   =k
	// 		=$   =    =    .^   .^   =    =♔   =$
	// 	`,
	// },
	//
	// monument: {
	// 	author: "chase",
	// 	ascii: `
	// 		.^$  .    .%   .    .    .^A  .^$  =
	// 		.    .    #    .    .    .    .♚   .^k
	// 		.    .^   =    =^   .    .    .    .^r
	// 		.    .^   =    #    #    .    .    .
	// 		.    .    .    #    #    =    .^   .
	// 		.^r  .    .    .    =^   =    .^   .
	// 		.^k  .♔   .    .    .    #    .    .
	// 		.    .^$  .^A  .    .    .%   .    .^$
	// 	`,
	// },
	//
	// catwalk: {
	// 	author: "chase",
	// 	ascii: `
	// 		x    x    x    x    x    x    x    x
	// 		=    =    =^   #    =^   =    .^   x
	// 		.^   .^   .    #    .    .    .    x
	// 		.A   .    .    #    .    .    .♔   x
	// 		.B   .    .    #    .    .    .B   x
	// 		.♚   .    .    #    .    .    .A   x
	// 		.    .    .    #    .    .^   .^   x
	// 		.^   =    =^   #    =^   =    =    x
	// 	`,
	// },
	//
	// canal: {
	// 	author: "chase",
	// 	ascii: `
	// 		=    =    .^   .    .    #^   =    =♚
	// 		=    =    .^   .    .    #    =    =$
	// 		=    =    #    .    .    #^   =    =r
	// 		=A   =    #^   .    .    #    =    =k
	// 		=k   =    #    .    .    #^   =    =A
	// 		=r   =    #^   .    .    #    =    =
	// 		=$   =    #    .    .    .^   =    =
	// 		=♔   =    #^   .    .    .^   =    =
	// 	`,
	// },
	//
	// slanted: {
	// 	author: "chase",
	// 	ascii: `
	// 		=$   =r   .^   =A   =$   .    .    .♚
	// 		=k   =    .^   =    =    .    .    .$
	// 		.    .    .    .    .    .    .    .
	// 		.    =    =    .    .    =    =    .
	// 		.    =    =    .    .    =    =    .
	// 		.    .    .    .    .    .    .    .
	// 		.$   .    .    =    =    .^   =    =k
	// 		.♔   .    .    =$   =A   .^   =r   =$
	// 	`,
	// },
	//
	// finlayson: {
	// 	author: "chase",
	// 	ascii: `
	// 		.    .    .    .    .    .k   .r   .$
	// 		.    .^   .^   .^   .^   .^   .    .♚
	// 		.    .^   =    =^   =    =    .^   .A
	// 		.    .^   =^   #    #$   =    .^   .
	// 		.    .^   =    #$   #    =^   .^   .
	// 		.A   .^   =    =    =^   =    .^   .
	// 		.♔   .    .^   .^   .^   .^   .^   .
	// 		.$   .r   .k   .    .    .    .    .
	// 	`,
	// },
	//
	// battlements: {
	// 	author: "chase",
	// 	ascii: `
	// 		.$   .B   .A   .♚   .    .    .    .$
	// 		.^   .    .    .^   .    .^   .    .^
	// 		=    .    .    =    .    =    .    =
	// 		=    .    .    .    .    .    .    .
	// 		.    .    .    .    .    .    .    =
	// 		=    .    =    .    =    .    .    =
	// 		.^   .    .^   .    .^   .    .    .^
	// 		.$   .    .    .    .♔   .A   .B   .$
	// 	`,
	// },
	//
	// opposition: {
	// 	author: "chase",
	// 	ascii: `
	// 		=$   =♚   .    .    .    .    .    .$
	// 		=B   =    .    .    .$   =    .    .
	// 		=A   =    .    .    .    .    .    .
	// 		=    =    .    .    .    .    .^   .^
	// 		.^   .^   .    .    .    .    =    =
	// 		.    .    .    .    .    .    =    =A
	// 		.    .    =    .$   .    .    =    =B
	// 		.$   .    .    .    .    .    =♔   =$
	// 	`,
	// },
	//
	// simplex: {
	// 	author: "chase",
	// 	ascii: `
	// 		.$   .♚   =    .    .    .    .    .$
	// 		.B   .    .    .    =    .    .    .
	// 		.A   .    =    .    .    .    .    .
	// 		.    .    =    .    .    =    =    .
	// 		.    =    =    .    .    =    .    .
	// 		.    .    .    .    .    =    .    .A
	// 		.    .    .    =    .    .    .    .B
	// 		.$   .    .    .    .    =    .♔   .$
	// 	`,
	// },
	//
	// skywalker: {
	// 	author: "chase",
	// 	ascii: `
	// 		#$   #    #    #    #    .    #    #$
	// 		#B   #♚   .    .    #    .    #    #
	// 		#A   #    .    .    #    #    #    #
	// 		#    #    #    #    #    .    .    #
	// 		#    .    .    #    #    #    #    #
	// 		#    #    #    #    .    .    #    #A
	// 		#    #    .    #    .    .    #♔   #B
	// 		#$   #    .    #    #    #    #    #$
	// 	`,
	// },
	//
	// cubicles: {
	// 	author: "chase",
	// 	ascii: `
	// 		=    =    =    =    =    =    =    =
	// 		.$   .k   .r   .    .    .    .    =
	// 		.A   .♚   .    .    =    .    .    =
	// 		.    .    .    .    =    .    .    =
	// 		.    =    =    =    =    =    .    =
	// 		.    .    =    .    .    .    .    =
	// 		.    .    =    .    .    .♔   .A   =
	// 		.    .    .    .    .r   .k   .$   =
	// 	`,
	// },
	//
	// dashes: {
	// 	author: "chase",
	// 	ascii: `
	// 		=    =    =    =    =    =    =    =
	// 		.$   .k   .r   .    .    .    .    =
	// 		.A   .♚   .    .    .    .    .    =
	// 		.    .    .    .    .    .    .    =
	// 		=    .%   =    .    =    .%   =    =
	// 		.    .    .    .    .    .    .    =
	// 		.    .    .    .    .    .♔   .A   =
	// 		.    .    .    .    .r   .k   .$   =
	// 	`,
	// },
	//
	// pontifex: {
	// 	author: "chase",
	// 	ascii: `
	// 		=$$  =    .^   #    =    =q   =k   =$♚^
	// 		=b   =    .^   .^   =    =    =    =r
	// 		.^   .^   .    .    #    #    =    =$
	// 		#    .^   .    .    .*   #    =    =
	// 		=    =    #    .*   .    .    .^   #
	// 		=$   =    #    #    .    .    .^   .^
	// 		=r   =    =    =    .^   .^   =    =b
	// 		=$♔^ =k   =q   =    #    .^   =    =$$
	// 	`,
	// },

} satisfies Record<string, Omit<MapSpec, "name">>

// const bingus = {
// 	blank: {
// 		author: "chase",
// 		ascii: `
// 			.    .    .    .    .    .    .    .
// 			.    .    .    .    .    .    .    .
// 			.    .    .    .    .    .    .    .
// 			.    .    .    .    .    .    .    .
// 			.    .    .    .    .    .    .    .
// 			.    .    .    .    .    .    .    .
// 			.    .    .    .    .    .    .    .
// 			.    .    .    .    .    .    .    .
// 		`,
// 	},
//
// 	bridgePreset: {
// 		author: "chase",
// 		ascii: `
// 			#b   #$♟  #    =^   =^%  =^   #    #$♕
// 			#    #♚   #A   .    .    .    #♖   #
// 			=^♝  =    .^   .^   .^   .^   =$   =^
// 			=    =♞   =    =    =    =    =    =
// 			=    =    =    =    =    =    =♘   =
// 			=^   =$   .^   .^   .^   .^   =♗   =^
// 			#    #♜   .    .    .    #A   #♔   #
// 			#$♛  #    =^   =^%  =^   #    #$♙  #b
// 		`,
// 	},
// }

