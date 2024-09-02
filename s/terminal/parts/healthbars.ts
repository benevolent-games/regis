import { loop } from "@benev/toolbox"

export type Healthbar = {
	fraction: number
	segments: boolean[]
}

const bars = {
	dotted: `
	------------------------
	#-----------------------
	#-----------#-----------
	#-------#-------#-------
	#-----#-----#-----#-----
	#---#---#---#---#---#---
	#--#--#--#--#--#--#--#--
	#-#-#-#-#-#-#-#-#-#-#-#-
	##-##-##-##-##-##-##-##-
	###-###-###-###-###-###-
	#####-#####-#####-#####-
	#######-#######-#######-
	###########-###########-
	########################
	`,
	linear: `
	------------------------
	#-----------------------
	##----------------------
	###---------------------
	####--------------------
	#####-------------------
	######------------------
	#######-----------------
	########----------------
	#########---------------
	##########--------------
	###########-------------
	############------------
	#############-----------
	##############----------
	###############---------
	################--------
	#################-------
	##################------
	###################-----
	####################----
	#####################---
	######################--
	#######################-
	########################
	`,
}

const bar = bars.linear

const healthbars = bar
	.split("\n")
	.map(t => t.trim())
	.filter(t => !!t)
	.map(line => {

	let health = 0

	const segments = [...line].map(character => {
		const healthy = (character === "-")
		if (healthy)
			health += 1
		return healthy
	})

	const fraction = health / 24
	return {fraction, segments}
})

export function getBestHealthbar(fraction: number) {
	let best: {healthbar: Healthbar, difference: number} | undefined

	for (const healthbar of healthbars) {
		const difference = Math.abs(healthbar.fraction - fraction)
		if (!best || difference < best.difference)
			best = {healthbar, difference}
	}

	if (!best)
		throw new Error("no best healthbar found")

	return best.healthbar
}

