// match the input buffer from parser against patterns from hyposyn
import { syntax } from "./detector.js"

function bufferer(buffer, meta) {
	meta.newline == buffer.includes("\n")

// TODO: rerewrite the hierrachy completely cause rn doesnt make sense and does not handle single line objs etc. 
// Make flow chart first. Figjam.
	if (meta.newline) {
		//conditionals, loops, functions defs, objects, lattices,
		console.log("Multiline buffer detected, handling each line separately.")
		if (meta.equals) {
			//objects, lattices, functions defs.
			console.log("Assignment detected in multiline buffer.")
			if (meta.curly) {
				console.log("Object/function/loop/conditional possibility.")
				if (meta.paren) {
					console.log("Function possibility.")
				}
			} else if (meta.angular) {
				console.log("Lattice possibility.")
			}
		} else {
			//conditionals, loops
		}
	} else if (meta.equals) {
		// strings, integers, null, undefined, flux, arrays, func calls
		console.log("String, integer, null or undefined possibility.")
		if (meta.square) {
			// arrays
			console.log("Array possibility.")
		}
	} else {
		//function calls
		console.log("Function call or expression possibility.")
	}
}
export default bufferer
