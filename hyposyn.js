//structure of syntax

// types?: string, number (float, int complex), array, object, function, null, undefined, flux, sheet, expression
// commands {
// 	assignment { 
// syntax:== $identifier = $limitor$value$limitor
// 		String,  $limitor = ", ' . `  \([A-Za-z])\w+[^\S\r\n]*=[^\S\r\n]*c\
// 		Number {Int, Float, Complex}, $limitor = ([A-Za-z])\w+[^\S\r\n]*=[^\S\r\n]*([0-9]+\.?[0-9]*)  TODO: Complex numbers
// 		Array, $limitor = [ ]
// 		Object, $limitor = { }
// 		Function, $limitor = (){ }
// 		Null, match null
// 		Undefined, match undefined
// 		Flux, search, ~
// 		Sheet, $limitor = < >
// 		Expression $limitor = ( ) or match operators
// }
// 	comments { single line syntax :== :), multi line }
// 	functionDef { syntax :== function $identifier ( $params ) { $body }  } ?? questionable if defined under variable assignment or as this.syntax
// 	conditionals { if, else if, else } :== if/else/else if ( $condition ) { $body }
// 	loops { for, while, do while } :== for/while/do while ( $condition ) { $body }
// 	functionCall { syntax :== $identifier ( $args )  }	
// }


// Write regex patterns for each of the above syntax types and commands to be used in the lexer for tokenization.
