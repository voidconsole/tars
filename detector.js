//structure of syntax
const syntaxAdv = {
    //assignment
    string: /^([A-Za-z]\w*)[^\S\r\n]*=[^\S\r\n]*("[^"\n]*"|'[^'\n]*'|`[^`\n]*`)/,
    number: /^([A-Za-z]\w*)[^\S\r\n]*=[^\S\r\n]*(\d+(?:\.\d+)?)/,
    array: /^([A-Za-z]\w*)[^\S\r\n]*=[^\S\r\n]*\[(.*)\]$/m, // needs special handling for nested arrays and parsing elements
    object: /^([A-Za-z]\w*)[^\S\r\n]*=[^\S\r\n]*\{(.*)\}$/m, // needs special handling for nested objects and parsing key-value pairs
    function: /^([A-Za-z]\w*)[^\S\r\n]*=[^\S\r\n]*\((.*)\)\s*\{(.*)\}$/m, // needs special handling for parameters and body
    null: /^([A-Za-z]\w*)[^\S\r\n]*=[^\S\r\n]*null$/,
    undefined: /^([A-Za-z]\w*)[^\S\r\n]*=[^\S\r\n]*undefined$/,
    flux: /^([A-Za-z]\w*)[^\S\r\n]*=[^\S\r\n]*(true|false|maybe|maybe[^\S\r\n]*~[^\S\r\n]*0\.\d+){1}/,
    lattice: /^([A-Za-z]\w*)[^\S\r\n]*=[^\S\r\n]*<(.*)>$/m, // needs special handling for parsing elements
    // expression: /^([A-Za-z]\w*)[^\S\r\n]*=[^\S\r\n]*\(.*\)|[+\-*/%^]=?|==|!=|<=|>=|&&|\|\|/,
    //conditionals
    if: /^if[^\S\r\n]*\((.*)\)\s*\{(.*)\}$/m,
    else_if: /^else if[^\S\r\n]*\((.*)\)[^\S\r\n]*\{(.*)\}$/m,
    else: /^else[^\S\r\n]*\{(.*)\}$/m,
    //loops

    for: /^for[^\S\r\n]*\((.*?)\)[^\S]*\{([^S]*)\}$/,
    while: /^while[^\S\r\n]*\(.*\)[^\S\r\n]*\{(.*)\}$/m,
    //function call
    call: /^[A-Za-z]\w*[^\S\r\n]*\((.*)\)$/,
}
const syntax = {
    assignment: /[A-Za-z]\w*[^\S\r\n]*=[^\S\r\n]*/,
    if: /if[^\S\r\n]*\(/,
    else_if: /else if[^\S\r\n]*\(/,
    else: /else[^\S\r\n]*\{/,
    for: /for[^\S\r\n]*\(/,
    while: /while[^\S\r\n]*\(/,
    call: /^[A-Za-z]\w*[^\S\r\n]*\(/,
}
// types?: string, number (float, int complex), array, object, function, null, undefined, flux, lattice, expression
// commands {
// 	assignment {
// 	syntax:== $identifier = $limitor$value$limitor
// 		String,  $limitor = ", ' . `  \([A-Za-z])\w+[^\S\r\n]*=[^\S\r\n]*(('.+')|".+")|(`.+`))\
// 		Number {Int, Float, Complex},  ([A-Za-z])\w+[^\S\r\n]*=[^\S\r\n]*([0-9]+\.?[0-9]*)  TODO: Complex numbers
// 		Array, $limitor = [ ]
// 		Object, $limitor = { }
// 		Function, $limitor = (){ }
// 		Null, match null
// 		Undefined, match undefined
// 		Flux, search, ~
// 		lattice, $limitor = < >
// 		Expression $limitor = ( ) or match operators
// }

// 	comments { single line syntax :== :), multi line }
// 	functionDef { syntax :== function $identifier ( $params ) { $body }  } ?? questionable if defined under variable assignment or as this.syntax
// 	conditionals { if, else if, else } :== if/else/else if ( $condition ) { $body }
// 	loops { for, while, do while } :== for/while/do while ( $condition ) { $body }
// 	functionCall { syntax :== $identifier ( $args )  }
// }
// Write regex patterns for each of the above syntax types and commands to be used in the lexer for tokenization.
export { syntax, syntaxAdv }
