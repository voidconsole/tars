import * as handler from "./handler.js";

function dispatch(buffer, meta, line) {
    const len = buffer.length;
    const c0 = buffer.charCodeAt(0);
    // TODO: Perform simple regex and manual checks to verify syntax structure
    // TODO: Later, allow optional parentheses

    if (buffer.charCodeAt(0) === 62 && buffer.charCodeAt(1) === 62 && buffer.charCodeAt(2) === 62) {
        console.log("STDOUT detected");
        return handler.stdout(buffer.slice(3).trim());
    }

    else if (buffer.charCodeAt(0) === 60 && buffer.charCodeAt(1) === 60 && buffer.charCodeAt(2) === 60) { // '<<<'
        console.log("STDIN detected");
        return handler.stdin(buffer.slice(3).trim());

    }
    if (meta.pivot) {
        switch (c0) {
            case 105: // 'i'
                if (buffer.charCodeAt(1) === 102 && (buffer.charCodeAt(2) === 32 || buffer.charCodeAt(2) === 40)) { // 'if'
                    console.log("If statement detected");
                    // Here you would call your extraction function (pivot & slice)
                    return;
                }
                break;

            case 102: // 'f'
                if (buffer.charCodeAt(1) === 111 && buffer.charCodeAt(2) === 114) { // 'for'
                    console.log("For loop detected");
                    return;
                }
                break;

            case 119: // 'w'
                if (buffer.charCodeAt(1) === 104) { // 'wh'ile
                    console.log("While loop detected");
                    return;
                }
                break;

            case 101: // 'e'
                if (buffer.charCodeAt(1) === 108 && buffer.charCodeAt(2) === 115) { // 'els'e
                    if (buffer.startsWith("else if", 0)) {
                        console.log("Else if statement detected");
                    } else {
                        console.log("Else statement detected");
                    }
                    return;
                }
                break;
        }

        if (meta.pureEquals) {
            // function declaration

        }
    } else if (meta.pureEquals) {
        // simple assignment

        if (meta.lattice) {
            console.log("Lattice assignment detected");
            // Check for Matrix (| [), Sheet (: before ,), or CSV
        }
        else if (meta.square) {
            console.log("Array assignment detected");
            handler.assignment(buffer.split("=")[0].trim(), buffer.split("=")[1].trim(), "array");

            return;
        }
        else if (meta.curly) {
            console.log("Object assignment detected");
            handler.assignment(buffer.split("=")[0].trim(), buffer.split("=")[1].trim(), "object");

            return;

        } else if (!buffer.includes("\n")) {
            // TODO: The split does not consider the equals in strings. Hence split at only the FIRST appearance of =.
            // let equalCount = buffer.count('=')
            let values = buffer.split("=").map(v => v.trim());
            if (values.length === 2) {
                if (values[1].charCodeAt(0) === 60 && values[1].charCodeAt(1) === 60 && values[1].charCodeAt(2) === 60) {
                    handler.assignment(values[0], values[1], 'stdin')
                }
                else{
                    return handler.assignment(buffer.split("=")[0].trim(), buffer.split("=")[1].trim(), "simple");
                }
            }
        } else if (buffer.charCodeAt(0) === 64) {
            console.log("SEED creation detected");
            return handler.seedCreator(buffer.slice(1).trim());
        }

    } else if (meta.paren && !meta.pureEquals) {
        console.log("Function call detected");
        return;
    }
    // TODO: check for things like hello++ or --hello or hello += 1 etc.  
    else if (meta.curly) {
        switch (c0) {
            case 105: // 'i'
                if (buffer.charCodeAt(1) === 102 && (buffer.charCodeAt(2) === 32 || buffer.charCodeAt(2) === 40)) { // 'if'
                    console.log("If statement detected");
                    // Here you would call your extraction function (pivot & slice)
                    return;
                }
                break;
            case 102: // 'f'
                if (buffer.charCodeAt(1) === 111 && buffer.charCodeAt(2) === 114) { // 'for'
                    console.log("For loop detected");
                    return;
                }
                break;
            case 119: // 'w'
                if (buffer.charCodeAt(1) === 104) { // 'wh'ile
                    console.log("While loop detected");
                    return;
                }
                break;
            case 101: // 'e'
                if (buffer.charCodeAt(1) === 108 && buffer.charCodeAt(2) === 115) { // 'els'e
                    if (buffer.startsWith("else if", 0)) {
                        console.log("Else if statement detected");
                    } else {
                        console.log("Else statement detected");
                    }
                    return;
                }
                break;
        }
    }
    else {
        const reset = '\x1b[0m';
        const boldRed = '\x1b[1m\x1b[31m';
        const italicBlue = '\x1b[3m\x1b[34m';
        //TODO: Check for prebuild functions, pipelines, increments, return statments, and other such non trivial exceptions. 
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