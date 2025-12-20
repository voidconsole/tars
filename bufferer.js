// match the input buffer from parser against patterns from hyposyn
import { syntax } from "./detector.js"
import * as handler from "./handler.js"
function bufferer(buffer, meta) {
	// TODO: reduce load later cause buffer is already scanned for if while for etc.
	if (buffer.startsWith(">>>")) {
		// stdout
		console.log("STDOUT detected")
		handler.stdout(buffer.slice(3).trim())
	} else if (buffer.startsWith("???")) {
		// stdin
		console.log("STDIN detected")
		handler.stdin(buffer.slice(3).trim())
	}
	else if (buffer.startsWith("for")) {
		// for loop
		console.log("For loop detected")
	}
	else if (buffer.startsWith("if")) {
		// if statement
		console.log("If statement detected")
	}
	else if (buffer.startsWith("while")) {
		// while loop
		console.log("While loop detected")
	}
	else if (buffer.startsWith("else")) {
		// else or else if statement

		if (buffer.startsWith("else if")) {
			// else if statement
			console.log("Else if statement detected")
		}else {
			// else statement
			console.log("Else statement detected")}
	}
	else if (meta.paren) {
		// function call or declaration
		if (meta.curly) {
			// function declaration
			console.log("Function declaration detected")
		} else if (!meta.pureEquals) {
			// function call
			console.log("Function call detected")
		}
	}
	else if (meta.curly) {
		// object or block
		if (meta.pureEquals) {
			// object
			console.log("Object detected")
		} else {
			// block
			console.log("Block detected")
		}
	}
	else if (meta.pureEquals) {
		if (meta.lattice) {
			// Lattice 
			console.log("Lattice detected")
		}
		else if (meta.square) {
			// array
			console.log("Array detected")
		} else {
			//strin int
			console.log("String/int Assignment detected")
		}
	} else {
		console.log("Urecognized command")
	}
}

export default bufferer
