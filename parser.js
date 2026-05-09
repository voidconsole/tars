import dispatch from "./dispatcher.js";
import punish from "./punisher.js";
function parse(input) {
	// Standardize newlines and add a terminal newline for final flush
	input = input.replace(/\r\n/g, "\n").replace(/\r/g, "\n") + "\n";
	let inputLength = input.length;
	let buffer = [];
	let commandNum = 0;
	let inLattice = false;
	let depthCurly = 0;
	let depthSquare = 0;
	let depthParen = 0;
	let bracketStack = [];
	let inString = false;
	let stringChar = null;
	let inSingleComment = false;
	let inMultiComment = false;
	let skipFlush = false;
	let lineCount = 0;
	let lastFlushedLine = 0;
	let meta = {
		curly: false,
		square: false,
		paren: false,
		lattice: false,
		pureColon: false,
		pivot: null,
	};

	for (let i = 0; i < inputLength; i++) {
		const charCode = input.charCodeAt(i);
		const char = input[i];
		switch (charCode) {
			case 10: // '\n'
				lineCount++;
				//---------------------------------------------------------------------------------
				if (inSingleComment) { // \n Newline ends single-line comment
					inSingleComment = false;
				}
				//----------------------------------------------------------------------------------
				
				if ( // Flush if end of input and buffer has content
					i === inputLength - 1 &&
					buffer.length > 0
				) {
					buffer.pop(); // remove trailing newline
					const bufferStr = buffer.join("")
						.trim();
					punish(
						`Unmatched brackets detected`,
						"Syntax",
						lastFlushedLine + 1,
						bufferStr.slice(
							0,
							bufferStr.indexOf("\n"),
						),
					);
				} break;
			case 9: // '\t'
				// if wish to, then also push for comments.
				if (inString) buffer.push(char);
				continue; break;
			// Detect Comment Starts: "=" followed by "]" or "|"
			case 61:  // =
				if (!inString && !inSingleComment && !inMultiComment) {
					const nextCode = input.charCodeAt(i + 1);
					if (nextCode === 93 || nextCode === 124) { // ] or |
						inSingleComment = nextCode === 93; // "=]"
						inMultiComment = nextCode === 124; // "=|"
						continue;
					}
				}
				if (
					inMultiComment &&
					input.charCodeAt(i - 1) === 124
				) { // "|=" ends multi-line
					inMultiComment = false;
					continue;
				}
			
		}
		if (inSingleComment || inMultiComment) {continue;}
		else {
			//TODO if newline and not in string, lattice, then dont push to buffer
			buffer.push(char); // only push if not in comment
			//============================================================================================
			if (!inString) {
				// Code for characters NOT inside strings
				switch (charCode) {
					case 58: // ':'
						if (
							depthCurly === 0 &&
							depthParen === 0 &&
							depthSquare === 0 &&
							!inLattice
						) {
							meta.pureColon = true;
						}
						break;
					case 124: // '|'
						meta.lattice = true;
						if (bracketStack[bracketStack.length - 1] === 124) {
							bracketStack.pop();
							inLattice = false;
						} else {
							bracketStack.push(124);
							inLattice = true;
						}
						break;
					case 123: // '{'
						meta.curly = true;
						depthCurly++;
						bracketStack.push(123);
						break;
					case 91: // '['
						meta.square = true;
						depthSquare++;
						bracketStack.push(91);
						break;
					case 40: // '('
						bracketStack.push(40);
						meta.paren = true;
						depthParen++;
						break;
					case 125: // '}'
						if (bracketStack.length === 0 || bracketStack.pop() !== 123) {
							punish(
								`Unmatched curly brace '}' detected`,
								"Syntax",
								lineCount,
								buffer.join("").slice(0, 30),
							);
							return;
						}
						depthCurly--;
						if (depthCurly === 0) {
							const next = peek(
								input,
								i + 1,
							);
							// Robust check for 'else' chain
							skipFlush =
								next.char ===
								"e" &&
								input.startsWith(
									"else",
									next.index,
								);
						}
						break;
					case 93: // ']'
						if (bracketStack.length === 0 || bracketStack.pop() !== 91) {
							punish(
								`Unmatched square bracket ']' detected`,
								"Syntax",
								lineCount,
								buffer.join("").slice(0, 30),
							);
							return;
						}
						depthSquare--;
						break;
					case 41: // ')'
						if (bracketStack.length === 0 || bracketStack.pop() !== 40) {
							punish(
								`Unmatched parenthesis ')' detected`,
								"Syntax",
								lineCount,
								buffer.join("").slice(0, 30),
							);
							return;
						}
						depthParen--;
						if (depthParen === 0) {
							const next = peek(
								input,
								i + 1,
							);
							// Check for function body start: () { ... }
							skipFlush =
								next.char ===
								"{";
							if (skipFlush) {
								meta.pivot =
									buffer.length;
							}
						}
						break;
					case 39: // ',
					case 34: // "
					case 96: // `
						// Handle string starts/ends outside of comments
						inString = true;
						stringChar = charCode;
						break;
//=========================================================================================//
// Flushing if charcode = \n AND not in string
					case 10:
						if (
							!inLattice &&
							depthCurly === 0 && depthSquare === 0 &&
							depthParen === 0
						) {
							buffer.pop(); // remove trailing newline
							const bufferStr = buffer.join("").trim();
							if (bufferStr.length > 0 && !skipFlush) {
								commandNum++;
								console.log(
									`${commandNum} ⚜️  ${bufferStr} ⚜️   on line ${lineCount}`,
								);
								dispatch(bufferStr, meta, lineCount);
								// Reset state for next command
								buffer = [];
								meta.lattice = false;
								meta.curly = false;
								meta.square = false;
								meta.paren = false;
								meta.pureColon = false;
								meta.pivot = null;
								lastFlushedLine = lineCount;
								console.log(
									"-----------------------------------------------------\n",
								);
							} else if (!skipFlush) {
								buffer = []; // Clear whitespace-only buffers
								lastFlushedLine = lineCount;
							}
						}
						
				}
				// ===========================================================================================
				// Code for characters inside strings
			} else if (charCode === 92) { // '\'
				const next = input.charCodeAt(i + 1);
				if (
					next === 39 ||  // '
					next === 34 ||  // "
					next === 96 ||  // `
					next === 92     // \
				) {
					buffer.push(input[++i]);
					continue;
				}
			}
			// Reset string state on matching closing quote because inside strings
			else if (charCode === stringChar) {
				inString = false;
				stringChar = null;
			}
			
		}

	}
}

function peek(input, startIndex) {
	let j = startIndex;
	while (j < input.length) {
		const code = input.charCodeAt(j);

		// skip whitespace (Space, Tab, LF, CR)
		if (code === 32 || code === 9 || code === 10 || code === 13) {
			j++;
			continue;
		}

		if (code === 61) { // '='
			const nextCode = input.charCodeAt(j + 1);
			if (nextCode === 93) { // '=]' Single-line
				j = input.indexOf("\n", j + 2);
				if (j === -1) break;
				continue;
			}
			if (nextCode === 124) { // '=|' Multi-line
				const end = input.indexOf("|=", j + 2);
				if (end === -1) break;
				j = end + 2;
				continue;
			}
		}

		return { char: input[j], index: j };
	}
	return { char: null, index: -1 };
}

export default parse;