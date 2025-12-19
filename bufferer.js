// match the input buffer from parser against patterns from hyposyn
import { syntax } from "./detector.js"

function bufferer(buffer, meta) {
	// TODO: rerewrite the hierarchy completely cause rn doesn't make sense and does not handle single line objs etc. 
	// Make flow chart first. Figjam.

	if (buffer.startsWith("for")) {
		// for loop
		console.log("For loop detected")
	} else if (buffer.startsWith("if")) {
		// if statement
		console.log("If statement detected")
	} else if (buffer.startsWith("while")) {
		// while loop
		console.log("While loop detected")
	} else if (buffer.startsWith("else")) {
		// else statement

		if (buffer.startsWith("else if")) {
			// else if statement
		}
	} else if (meta.paren) {
		// function call or declaration
		if (meta.curly) {
			// function declaration
			console.log("Function declaration detected")
		} else if (buffer.includes("=")) {
			// arrow function
		}
	}
	else if (meta.curly) {
		// object or block
		if (buffer.includes("=")) {
			// object
			console.log("Object detected")
		} else {
			// block
			console.log("Block detected")
		}
	}
	else if (meta.lattice) {
		// JSX/TSX
		console.log("Lattice detected")
	}
	else if (meta.square) {
		// array
		console.log("Array detected")
	} else {
		//strin int
		console.log("String/int Assignment detected")
	}

}
export default bufferer
