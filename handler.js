function stdout(log) {
	console.log("|||||"+log+"|||||")
}
function stdin(input) {
	return prompt(input)
}
function forLoop(expression, block) {
	console.log("For loop parameters:", expression, block)
}
function assignment(name, value) {
	console.log("Assignment parameters:", name, value)
}
export {stdout, stdin, forLoop, assignment};