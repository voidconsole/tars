// A little faster but need to handle inline comments

import dispatch from "./dispatcher.js";
import punish from "./punisher.js";
import isWellBracketed from "./bracketSolver.js";
function parse(input) {
	// Standardize newlines and add a terminal newline for final flush
	input = input.replace(/\r\n/g, "\n").replace(/\r/g, "\n") + "\n";
	// let buffer = [];
	let start = 0; //inclusive
	let end = 0; //inclusive
	let commentSegment = [];
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

	for (let i = 0; i < input.length; i++) {
		const charCode = input.charCodeAt(i);
		const char = input[i];
		// console.log(start, end, input.slice(start, end + 1), char);
		if (charCode === 10) {
			lineCount++;
			// console.log(`\n--- Line ${lineCount} ---`);
		} else if (charCode === 9) { // '\t'
			// if wish to, then also push for comments.
			if (inString) end += 1;
			continue;
		}

		// Detect Comment Starts: "=" followed by "]" or "|"
		if (charCode === 61 && !inString) { // =
			const nextCode = input.charCodeAt(i + 1);
			if (nextCode === 93 || nextCode === 124) { // ) or |
				inSingleComment = nextCode === 93; // "=]"
				inMultiComment = nextCode === 124; // "=|"
				end -= 1; // Remove the "=" from the command buffer
				continue;
			}
		}

		if (inSingleComment && charCode === 10) { // \n Newline ends single-line comment
			start = i + 1;
			end = i + 1;
			inSingleComment = false;
		}
		if (
			inMultiComment && charCode === 61 &&
			input.charCodeAt(i - 1) === 124
		) { // "|=" ends multi-line
			inMultiComment = false;
			start = i + 1;
			end = i + 1;
			continue;
		}

		if (!inSingleComment && !inMultiComment) {
			//TODO if newline and not in string, lattice, then dont push to buffer
			end += 1; // only increment end if not in comment
			if (!inString) {
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
						inLattice = !inLattice;
						break;
					case 123: // '{'
						meta.curly = true;
						depthCurly++;
						break;
					case 125: // '}'
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
					case 91: // '['
						meta.square = true;
						depthSquare++;
						break;
					case 93: // ']'
						depthSquare--;
						break;
					case 40: // '('
						meta.paren = true;
						depthParen++;
						break;
					case 41: // ')'
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
									end - start + 1;
							}
						}
						break;
				}
			}
			// 39 = ', 34 = ", 96 = `
			if (
				(charCode === 39 || charCode === 34 ||
					charCode === 96) && !inString
			) {
				inString = true;
				stringChar = char;
			} else if (char === stringChar) {
				inString = false;
				stringChar = null;
			}
			// Flushing if charcode = \n
			if (
				charCode === 10 && !inString && !inLattice &&
				depthCurly === 0 && depthSquare === 0 &&
				depthParen === 0
			) {
				end -= 1; // remove trailing newline
				const bufferStr = input.slice(start, end + 1).trim();

				if (end - start > 0 && !skipFlush) {
					commandNum++;
					console.log(
						`${commandNum} ⚜️  ${bufferStr} ⚜️  on line ${lineCount}`,
					);
					dispatch(bufferStr, meta, lineCount);

					// Reset state for next command
					start = end + 1;
					meta = {
						lattice: false,
						curly: false,
						square: false,
						paren: false,
						pureEquals: false,
						pivot: null,
					};
					lastFlushedLine = lineCount;
					console.log(
						"-------------------------------------------------------------------------------\n",
					);
				} else if (!skipFlush) {
					end = start; // Clear whitespace-only buffers
					lastFlushedLine = lineCount;
				}
			}
			// Flush if end of input and buffer has content
			if (
				charCode === 10 && i === input.length - 1 &&
				end - start + 1 > 0
			) {
				end -= 1; // remove trailing newline
				// if (isWellBracketed(buffer)) {
				// 	console.error("WARNING: THE HOLY GRAIL THIS SHOULD HAVE NEVER RUN. FIX BUG!!!")
				//         const bufferStr = input.slice(start, end + 1).trim();
				//         if (bufferStr.length > 0) {
				//                 commandNum++;
				//                 console.log(
				//                         `${commandNum} ⚜️  ${bufferStr} ⚜️ on line ${lineCount}`,
				//                 );
				//                 dispatch(
				//                         bufferStr,
				//                         meta,
				//                         lineCount,
				//                 );
				//         }
				// } else {
				const bufferStr = input.slice(start, end + 1).trim();
				punish(
					`Unmatched brackets detected`,
					"Syntax",
					lastFlushedLine + 1,
					bufferStr.slice(
						0,
						bufferStr.indexOf("\n"),
					),
				);
				// }
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
