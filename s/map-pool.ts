
export function randomMap() {
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


	bridge: `
		#b   #$♟  #    =^   =^%  =^   #    #$♕
		#    #♚   #a   .    .    .    #♖   #
		=^♝  =    .^   .^   .^   .^   =$   =^
		=    =♞   =    =    =    =    =    =
		=    =    =    =    =    =    =♘   =
		=^   =$   .^   .^   .^   .^   =♗   =^
		#    #♜   .    .    .    #a   #♔   #
		#$♛  #    =^   =^%  =^   #    #$♙  #b
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

} satisfies Record<string, string>

