import dispatch from "./dispatcher.js"

function parse(input) {
    
    // Standardize newlines and add a terminal newline for final flush
    input = input.replace(/\r\n/g, "\n").replace(/\r/g, "\n") + "\n";

    var buffer = [];
    var commandNum = 0;
    var inLattice = false;
    var depthCurly = 0;
    var depthSquare = 0;
    var depthParen = 0;
    var inString = false;
    var stringChar = null;
    var inSingleComment = false;
    var inMultiComment = false;
    var skipFlush = false;
    var lineCount = 1;

    var meta = {
        curly: false,
        square: false,
        paren: false,
        lattice: false,
        pureColon: false,
        pivot: null
    };

    for (let i = 0; i < input.length; i++) {
        const charCode = input.charCodeAt(i);
        const char = input[i];
        if(charCode === 10){
            lineCount++
        
        }
        else if (charCode === 9) { // '\t'
            if (inSingleComment || inMultiComment || inString) buffer.push(char);
            continue;
        }

        
        // Detect Comment Starts: "=" followed by "]" or "|"
        if (charCode === 61 && !inString) { // =
            const nextCode = input.charCodeAt(i + 1);
            if (nextCode === 93 || nextCode === 124) { // ) or |
                inSingleComment = nextCode === 93; // "=]"
                inMultiComment = nextCode === 124; // "=|" 
                buffer.pop(); // Remove the "=" from the command buffer
                continue;
            }
        }

        if (inSingleComment && charCode === 10) { // \n Newline ends single-line comment
            inSingleComment = false;
            
        }
        if (inMultiComment && charCode === 61 && input.charCodeAt(i - 1) === 124) { // "|:" ends multi-line
            console.log("found end signal")
            inMultiComment = false;
            continue;
        }
        
        if (!inSingleComment && !inMultiComment) {
            //TODO if newline and not in string, lattice, then dont push to buffer
            buffer.push(char); // only push if not in comment



            if (!inString) {
                switch (charCode) {
                    case 58: // ':'
                        if (depthCurly === 0 && depthParen === 0 && depthSquare === 0 && !inLattice) {
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
                            const next = peek(input, i + 1);
                            // Robust check for 'else' chain
                            skipFlush = (next.char === 'e' && input.startsWith("else", next.index));
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
                            const next = peek(input, i + 1);
                            // Check for function body start: () { ... }
                            skipFlush = (next.char === '{');
                            if (skipFlush) meta.pivot = buffer.length
                        }
                        break;
                    case 63: // '?'
                    break;
                    case 232313212: //   i have 
                }
            }
            // 39 = ', 34 = ", 96 = `
            if ((charCode === 39 || charCode === 34 || charCode === 96) && !inString) {
                inString = true;
                stringChar = char;
            } else if (char === stringChar) {
                inString = false;
                stringChar = null;
            }
            // Flushing if charcode = \n
            if (charCode === 10 && !inString && !inLattice &&
                depthCurly === 0 && depthSquare === 0 && depthParen === 0) {

                buffer.pop(); // remove trailing newline
                let bufferStr = buffer.join("").trim();

                if (bufferStr.length > 0 && !skipFlush) {
                    commandNum++;
                    console.log(`${commandNum} ⚜️  ${bufferStr} ⚜️`);
                    dispatch(bufferStr, meta, lineCount);

                    // Reset state for next command
                    buffer = [];
                    meta = { lattice: false, curly: false, square: false, paren: false, pureEquals: false, pivot: null };
                    console.log("-------------------------------------------------------------------------------\n");
                } else if (!skipFlush) {
                    buffer = []; // Clear whitespace-only buffers
                }
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