import * as handler from "./handler.js";

function dispatch(buffer, meta) {
    const len = buffer.length;
    const c0 = buffer.charCodeAt(0);


    if (buffer.charCodeAt(0) === 62 && buffer.charCodeAt(1) === 62 && buffer.charCodeAt(2) === 62) {
        console.log("STDOUT detected");
        return handler.stdout(buffer.slice(3).trim());
    }

    // case 63: // '?'
    //     if (buffer.charCodeAt(1) === 63 && buffer.charCodeAt(2) === 63) {
    //         console.log("STDIN detected");
    //         return handler.stdin(buffer.slice(3).trim());
    //     }
    //     break;
    // }

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
        }
        else if (meta.curly) {
            console.log("Object assignment detected");

        } else if (!buffer.includes("\n")) {
            console.log("String/Number/(maybe) ARRAY assignment detected");

	} else if (buffer.charCodeAt(0) === 64) {
	    console.log("SEED creation detected");
	    return handler.seedCreator(buffer.slice(1).trim());
	}

    } else if (meta.paren && !meta.pureEquals) {
        console.log("Function call detected");
        return;
    } 
    // TODO: check for things like hello++ or --hello or hello+=1 etc.  
    else {
	
             throw new SyntaxError("This command is not a valid syntax: " + buffer);
            
        // throw new Error("Unrecognized syntax structure:", buffer);
    }
}

export default dispatch;