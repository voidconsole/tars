let location = [];
// Sepereate raw datat on blobkcs of data and blocks of data based on lines. 
function lex(input) {
    const tokens = [];
    const lines = input.split("\n");
    lines.forEach((line, index) => {
	console.log(`Line ${index + 1}: ${line}`);
	// Tokenization logic would go here
    });
    return tokens;
}
export default lex;
