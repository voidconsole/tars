let location = []
// Sepereate raw datat on blobkcs of data and blocks of data based on lines.
function lex(input) {
    const tokens = []
    const lines = input.split("\n")
    lines.forEach((line, index) => {
        console.log(`Line ${index + 1}: ${line}`)
        // Tokenization logic would go here
    })
    return tokens
}
export default lex


// types?: string, number (float, int complex), array, object, function, null, undefined, flux, sheet, expression
// commands {
// 	assignment { syntax:== $identifier = $value
// 		String,
// 		Number {Int, Float, Complex},
// 		Array,
// 		Object,
// 		Function, ?? questionable if defined seperately or as this.syntax
// 		Null,
// 		Undefined,
// 		Flux,
// 		Sheet,
// 		Expression
// }
// 	comments { single line syntax :== :), multi line }
// 	functionDef { syntax :== function $identifier ( $params ) { $body }  } ?? questionable if defined under variable assignment or as this.syntax
// 	conditionals { if, else if, else }
// 	loops { for, while, do while }
// 	functionCall { syntax :== $identifier ( $args )  }	
// }
