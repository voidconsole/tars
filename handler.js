var variables = new Map();
var functions = new Map();

function expressionHandler(expression) {

}
function stdout(log) {
	console.log("|||||" + log + "|||||")
}
function stdin(query) {
	// console.log("STDIN query:", query);
	let input = prompt(query)
	console.log("User input received: ", input);
	return input;
}
function forLoop(expression, block) {
	console.log("For loop parameters: ", expression + " ===== " + block)
}

function assignment(name, value, type = "simple") {
	if (type === 'stdin') {
		let text = value.slice(3).trim(); // substring after '<<<'
		variables.set(name, { value: stdin(text), type: "stdin" });
		console.log("Simple assignment parameters:", name + " ===== ", variables.get(name))
		// look into this because not yet resolved.
	}
	else if (type === "simple") {
		variables.set(name, { value: value, type: "simple" });
		console.log("Simple assignment parameters:", name + " ===== ", variables.get(name))
	}
	

}
function logVars() { console.log(variables) }
export { stdout, stdin, forLoop, assignment, logVars };