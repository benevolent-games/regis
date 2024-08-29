
import {proposerFn} from "../types.js"
import {Choice} from "../../../state.js"
import {InvestmentDenial} from "../../aspects/denials.js"

export const proposeInvestment = proposerFn(
	({agent, freedom, turnTracker}) =>
	(choice: Choice.Investment) => {

	return new InvestmentDenial(`todo investment not yet implemented`)
})

