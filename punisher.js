const C = {
	reset: "\x1b[0m",
	bold: "\x1b[1m",
	italic: "\x1b[3m",
	underline: "\x1b[4m",

	black: "\x1b[30m",
	red: "\x1b[31m",
	green: "\x1b[32m",
	yellow: "\x1b[33m",
	blue: "\x1b[34m",
	magenta: "\x1b[35m",
	cyan: "\x1b[36m",
	white: "\x1b[37m",

	gray: "\x1b[90m",
};

class tarsError extends Error {

	constructor(type, message, line, source, keyword) {
		super(message);
		this.type = type;
		this.line = line;
		this.source = source;
		this.keyword = keyword;
	}

	color() {
		return C.red + C.bold ;
	}
	format() {

		return `

${C.bold + this.color()}${this.type}${C.reset} at line ${C.yellow + this.line + C.reset}
${C.bold + C.blue + '='.repeat(this.source.length + 20)}
    ${C.white + this.line + C.blue} | ${C.reset + C.white + this.source}
${C.bold + C.blue + '='.repeat(this.source.length + 20) +C.reset}

${	this.message}
${'_'.repeat(40)}
`;
	}
	throw() {
		throw this.format();
	}
}

class tarsReferenceError extends tarsError {

	constructor(message, line, source) {
		super("Reference Error", message, line, source);
	}
}

class tarsSyntaxError extends tarsError {

	constructor(message, line, source) {
		super("Syntax Error", message, line, source);
	}

	color() {
		return C.yellow;
	}
}



class tarsTypeError extends tarsError {

	constructor(message, line, source) {
		super("Type Error", message, line, source);
	}
}



class tarsRuntimeError extends tarsError {

	constructor(message, line, source) {
		super("Runtime Error", message, line, source);
	}
}


function punish(message, type, line, source) {
	let error;
	switch (type) {
		case "Reference":
			error = new tarsReferenceError(message, line, source);
			break;
		case "Syntax":
			error = new tarsSyntaxError(message, line, source);
			break;
		case "Type":
			error = new tarsTypeError(message, line, source);
			break;
		case "Runtime":
			error = new tarsRuntimeError(message, line, source);
			break;
		default:
			error = new tarsError("Unknown Error", message, line, source);
	}
	error.throw();
}

export default punish;