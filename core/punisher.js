// Copyright (c) 2026 Satwik Bhusanur
// SPDX-License-Identifier: Apache-2.0


const C = {
	reset: "\x1b[0m",
	bold: "\x1b[1m",
	italic: "\x1b[3m",
	underline: "\x1b[4m",
	black: "\x1b[30m",
	red: "\x1b[38;2;255;110;110m",
	green: "\x1b[32m",
	yellow: "\x1b[38;2;255;185;90m",
	blue: "\x1b[38;2;110;170;255m",
	magenta: "\x1b[35m",
	cyan: "\x1b[36m",
	white: "\x1b[37m",
	gray: "\x1b[38;2;105;105;105m",
};

class tarsError extends Error {
	// TODO: later, add help message and suggestions in green
	constructor(type, message, line, source, startline, start, length, color = C.red) {
		super(message);

		this.type = type;
		this.startline = startline;
		this.source = source;
		this.color = color;
		this.start = start;
		this.errlength = length;
		this.errline = line;
	}
	format() {
		const { type, color, start, errlength } = this;
		
		// const sourceLines = [].concat(this.source);
		const sourceLines = [].concat(this.source).map(l => l.replace(/\t/g, '    ')); // for tabs in sprints
		const msgLines = String(this.message).split('\n');
		const numWidth = String(this.startline).length;
		
		const longest = (lines) => Math.max(...lines.map(l => l.length));
		const pad = (n) => ' '.repeat(Math.max(0, n));
		
		const contentLen = Math.max(numWidth + 3 + longest(sourceLines), longest(msgLines), 30);
		const boxWidth = contentLen + 6;
		
		const wall = `${C.gray}┃${C.reset}`;
		const blankRow = wall + pad(boxWidth) + wall;
		const divider = '━'.repeat(boxWidth);
		const row = (content, visibleLen) =>
			`${wall}   ${content}${pad(contentLen - visibleLen)}   ${wall}`;
		
		const top = `${C.gray}┏━ ${color}${C.bold}${type}${C.reset}${C.gray} ${'━'.repeat(Math.max(0, contentLen + 4 - (type.length + 1)))}┓${C.reset}`;

		// Source code lines (with the underline row when applicable)
		const sourceRows = sourceLines.flatMap((src, i) => {
			const num = String(Number(this.startline) + i).padStart(numWidth);
			const rows = [
				row(
					`${C.yellow}${C.bold}${num}${C.reset} ${C.yellow}┃${C.reset} ${C.white}${src}${C.reset}`,
					numWidth + 3 + src.length
				),
			];
			if (i === this.errline || sourceLines.length === 1) {
				const indent = 6 + numWidth + start;
				rows.push(
					`${wall}${pad(indent)}${color}${C.bold}${'-'.repeat(errlength)}${C.reset}${pad(boxWidth - indent - errlength)}${wall}`
				);
			}
			return rows;
		});
		const messageRows = msgLines.map(line =>
			row(`${C.white}${line}${C.reset}`, line.length)
		);
		return `\n${[
			top,
			blankRow,
			...sourceRows,
			...(sourceLines.length == this.errline ? [blankRow] : []), // omit spacer line for single line source
			`${C.gray}┣${divider}┫${C.reset}`,
			blankRow,
			...messageRows,
			blankRow,
			// `${C.gray}┣${divider}┫${C.reset}`,
			// ...helpRows
			`${C.gray}┗${divider}┛${C.reset}`,
		].join('\n')}\n`;
	}
	throw() {
		throw this.format();
	}
}
class tarsReferenceError extends tarsError {

	constructor(message, line, source, startline, start, length) {
		super("Reference Error", message, line, source, startline, start, length, C.red);
	}
}

class tarsSyntaxError extends tarsError {
	constructor(message, line, source, startline, start, length) {
		super("Syntax Error", message, line, source, startline, start, length, C.red);
	}
}

class tarsTypeError extends tarsError {

	constructor(message, line, source, startline, start, length) {
		super("Type Error", message, line, source, startline, start, length, C.magenta);
	}
}



class tarsRuntimeError extends tarsError {

	constructor(message, line, source, startline, start, length) {
		super("Runtime Error", message, line, source, startline, start, length, C.red);
	}
}


function punish(message, type, startline, source, line = 0, start = 0, length = 0) {
	length = length ? length : source[line].length - start
	// line is relative to startline
	let error;
	switch (type) {
		case "Reference":
			error = new tarsReferenceError(message, line, source, startline, start, length);
			break;
		case "Syntax":
			error = new tarsSyntaxError(message, line, source, startline, start, length);
			break;
		case "Type":
			error = new tarsTypeError(message, line, source, startline, start, length);
			break;
		case "Runtime":
			error = new tarsRuntimeError(message, line, source, startline, start, length);
			break;
		default:
			error = new tarsError("Unknown Error", message, line, source, start, length, startline);
	}
	error.throw();
}
export default punish;