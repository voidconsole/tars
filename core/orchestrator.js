// Copyright (c) 2026 Satwik Bhusanur
// SPDX-License-Identifier: Apache-2.0

// orchastrate data and commands on the flow

import { state, getPhase, newPhase, currentPhase, allSpaces } from "./registrar.js";

function expressionHandler(expression) {
	return true
}

function stdout(log) {
	console.log("|||||" + log + "|||||"); // TODO: format properly at production
}

function stdin(query) {
	// console.log("STDIN query:", query);
	// TODO: resolve query first. 
	let input = prompt(query);
	console.log("User input received: ", input);
	return input;
}
function forLoop(expression, block) {
	console.log("For loop parameters: ", expression + " ===== " + block);
}

function assignment(name, value, type = "simple") {
	switch (type) {
		case "stdin": {
			const text = value.slice(3).trim(); // substring after '<<<'
			currentPhase().bind(name, stdin(text), "stdin");
			console.log(
				"Standard input assignment parameters:",
				name + " ===== ",
				currentPhase().get(name),
			); break
			// look into this because not yet resolved.
		}
		case "simple": {
			currentPhase().bind(name, value, "simple");
			console.log(
				"Simple assignment parameters:",
				name + " ===== ",
				currentPhase().get(name),
			); break
		}
		case "compound": {
			let currentValue = currentPhase().get(name);
		};break
	}
}
function logVars() {
	console.log(allSpaces());
}
export { assignment, forLoop, logVars, stdin, stdout };
