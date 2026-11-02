// Copyright (c) 2026 Satwik Bhusanur
// SPDX-License-Identifier: Apache-2.0


// invigilate dispatched commands and forward to handler
// This is where remaining syntax errors are caught and reported
import * as handler from "./orchestrator.js";
import syntax from "./detector.js"
function invigilate(suspect, type, subtype = null) {
	console.log("Invigilation started.");
	// Further invigilation logic here
	switch (type) {
		case "expression": {
			console.log("Variable invigilation for:", suspect);
			if (subtype === "lattice") {
				console.log("Lattice variable detected:", suspect);
			} else {
				console.warn("Handle edge case pleaseeeee")
			}
		};
		case "function": {
			console.log("Function invigilation for:", suspect);
		};
		case "identifier": {
			console.log("Identifier Invigilation for: ", suspect)
			syntax.varname.test(varname);
		}
	}
}
export { invigilate };
