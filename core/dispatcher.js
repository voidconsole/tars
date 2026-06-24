import * as handler from "./handler.js";

function dispatch(buffer, meta, line) {
	// Conditions are checked in order of probability of occurances. 

	const c0 = buffer.charCodeAt(0); // TODO: when added new keywords, have c1,c2,c3 to maximize coverage
	// const len = buffer.length;
	// TODO: Perform simple regex and manual checks to verify syntax structure
	// TODO: Later, allow optional parentheses
	if (meta.pivot) {
		if (meta.pureColon) {
			// function declaration
		} else {
			switch (c0) {
				case 105: // 'i'
					if (
						buffer.charCodeAt(1) === 102 &&
						(buffer.charCodeAt(2) === 32 ||
							buffer.charCodeAt(2) === 40)
					) { // 'if'
						console.log("If statement detected");
						// Here you would call your extraction function (pivot & slice)
						return;
					}
					break;

				case 102: // 'f'
					if (
						buffer.charCodeAt(1) === 111 &&
						buffer.charCodeAt(2) === 114 && (buffer.charCodeAt(3) === 32 || buffer.charCodeAt(3) === 40)
					) { // 'for'
						console.log("For loop detected");
						return;
					}
					break;

				case 119: // 'w'
					if (buffer.charCodeAt(1) === 104 && (buffer.charCodeAt(5) === 32 || buffer.charCodeAt(5) === 40)) { // 'wh'ile
						if (buffer.startsWith("while", 0)) {
							console.log("While loop detected");
						}
						return;
					}
					break;

				case 101: // 'e'
					if (
						buffer.charCodeAt(1) === 108 &&
						buffer.charCodeAt(2) === 115 &&
						(buffer.charCodeAt(4) === 32 || buffer.charCodeAt(4) === 40)) { // 'els'e
						if (buffer.startsWith("else if", 0)) {
							console.log(
								"Else if statement detected",
							);
						} else if (buffer.charCodeAt(3) === 32) { // 'else'
							console.log(
								"Else statement detected",
							);
						}

					}
					break;
			}
			return;
		}
	}
	else if (meta.pureColon) {
		let idx = buffer.indexOf(":"); // cannot be -1 because meta.pureColon is true, so no need to check
		let left = buffer.slice(0, idx).trim();
		let right = buffer.slice(idx + 1).trim();
		if (left.length === 0 || right.length === 0) {
			// TODO: replace error with punisher's engine 
			throw new Error("Invalid syntax: Left or right side of colon is empty");
		}
		let cb0 = right.charCodeAt(0);
		let cbn = right.charCodeAt(right.length - 1);
		// simple assignment
		if (meta.lattice) {
			if (cb0 === 124 && cbn === 124) { // '|' // lattice checks

				// This ASSUMES starts with | and ends with |. TODO: make sure there are no edge cases
				console.log("Lattice assignment detected");
			} // dw about unmatched brackets as its handled in the parser
			else {
				// it does not start with |, but contains |. TODO: 
			}

		}
		else if (meta.square) {
			if (cb0 === 91 && cbn === 93) { // '[' and ']'
				// This ASSUMES starts with [ and ends with ]. TODO: make sure there are no edge cases
				console.log("Array assignment detected");
				handler.assignment(
					left,
					right,
					"array",
				);
				return;
			} else {
				// does not start or end with [] but contains it. TODO: 
			}
		} else if (meta.curly) {
			if (cb0 === 123 && cbn === 125) { // '{' and '}'
				// assumes starts with { and ends with }. TODO: make sure there are no edge cases
				console.log("Object assignment detected");
				handler.assignment(
					left,
					right,
					"object",
				);
				return;
			}
			else {
				// does not start and end with {} but contains it. TODO:
			}
		} else if (!buffer.includes("\n")) {
			if (right.length > 3 &&
				cb0 === 60 &&
				right.charCodeAt(1) === 60 &&
				right.charCodeAt(2) === 60
			) {
				handler.assignment(
					left,
					right,
					"stdin",
				);
			} else {
				return handler.assignment(
					left,
					right,
					"simple",
				);
			}
		}
	}
	else if ( // Do not put after pure parent or curly, for they may be inside a STD in or out.
		c0 === 62 && buffer.charCodeAt(1) === 62 &&
		buffer.charCodeAt(2) === 62
	) {
		console.log("STDOUT detected");
		return handler.stdout(buffer.slice(3).trim());
	} else if (
		c0 === 60 && buffer.charCodeAt(1) === 60 &&
		buffer.charCodeAt(2) === 60
	) { // '<<<'
		console.log("STDIN detected");
		return handler.stdin(buffer.slice(3).trim());
	}
	else if (meta.paren) {
		console.log("Function call detected");
		return;
	}
	else if (c0 === 64) {
		console.log("SEED creation detected");
		return handler.seedCreator(buffer.slice(1).trim());
	}
	// TODO: check for things like hello++ or --hello or hello += 1 etc.
	else if (meta.curly && c0 === 123 && buffer.charCodeAt(1) === 32) { // a better check would be if c0 = {. is that too strict? 
		// Simply blocks of code
	} else {

		//TODO: Check for prebuild functions, pipelines, increments, return statments, and other such non trivial exceptions.


		// If none of the above conditions are met, throw an error
		// TODO: replace error with punisher's engine
		throw (`\x1b[1m\x1b[34m
===========================================\x1b[0m
    ${line} | ${buffer}
\x1b[1m\x1b[34m===========================================\x1b[0m
\x1b[1m\x1b[31mReference error\x1b[0m at line ${line} :(
\x1b[3m\x1b[34m${buffer}\x1b[0m is not defined.

`);

		// throw new Error("Unrecognized syntax structure:", buffer);
	}
}
export default dispatch;
