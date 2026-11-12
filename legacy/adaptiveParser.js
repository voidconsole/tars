// Copyright (c) 2026 Satwik Bhusanur
// SPDX-License-Identifier: Apache-2.0

// TODO: needs heavy testing
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

const ANSI_PATTERN = /\x1B\[[0-?]*[ -/]*[@-~]/g;

function getTerminalWidth() {
	try {
		const denoWidth = globalThis.Deno?.consoleSize?.().columns;
		if (Number.isFinite(denoWidth) && denoWidth > 0) return denoWidth;
	} catch {
		// Deno may not have an attached terminal.
	}
	const nodeWidth = globalThis.process?.stdout?.columns;
	return Number.isFinite(nodeWidth) && nodeWidth > 0 ? nodeWidth : 80;
}

function charWidth(char) {
	const code = char.codePointAt(0);

	// Combining marks, variation selectors, and joiners do not occupy a cell.
	if (
		code === 0x200d ||
		(code >= 0x0300 && code <= 0x036f) ||
		(code >= 0x1ab0 && code <= 0x1aff) ||
		(code >= 0x1dc0 && code <= 0x1dff) ||
		(code >= 0x20d0 && code <= 0x20ff) ||
		(code >= 0xfe00 && code <= 0xfe0f) ||
		(code >= 0xfe20 && code <= 0xfe2f) ||
		(code >= 0xe0100 && code <= 0xe01ef)
	) return 0;

	// Approximate the double-cell characters used by common terminal fonts.
	if (
		code >= 0x1100 && (
			code <= 0x115f ||
			code === 0x2329 || code === 0x232a ||
			(code >= 0x2e80 && code <= 0xa4cf) ||
			(code >= 0xac00 && code <= 0xd7a3) ||
			(code >= 0xf900 && code <= 0xfaff) ||
			(code >= 0xfe10 && code <= 0xfe19) ||
			(code >= 0xfe30 && code <= 0xfe6f) ||
			(code >= 0xff00 && code <= 0xff60) ||
			(code >= 0xffe0 && code <= 0xffe6) ||
			(code >= 0x1f300 && code <= 0x1faff) ||
			(code >= 0x20000 && code <= 0x3fffd)
		)
	) return 2;

	return 1;
}

function displayWidth(value) {
	return [...String(value).replace(ANSI_PATTERN, "")]
		.reduce((width, char) => width + charWidth(char), 0);
}

function wrapLine(value, maxWidth) {
	const chars = [...String(value)];
	if (chars.length === 0) return [{ text: "", startColumn: 0, endColumn: 0 }];

	const rows = [];
	let start = 0;
	let startColumn = 0;

	while (start < chars.length) {
		let end = start;
		let width = 0;
		let lastSpace = -1;

		while (end < chars.length) {
			const nextWidth = charWidth(chars[end]);
			if (width + nextWidth > maxWidth && end > start) break;

			width += nextWidth;
			if (/\s/u.test(chars[end])) lastSpace = end;
			end++;
			if (width >= maxWidth) break;
		}

		if (end < chars.length && lastSpace >= start) {
			end = lastSpace + 1;
			width = chars.slice(start, end).reduce((sum, char) => sum + charWidth(char), 0);
		}

		// A single double-cell character may be wider than a very narrow terminal.
		if (end === start) {
			width = charWidth(chars[end]);
			end++;
		}

		rows.push({
			text: chars.slice(start, end).join(""),
			startColumn,
			endColumn: startColumn + width,
		});
		startColumn += width;
		start = end;
	}

	return rows;
}

function sourceColumnAt(source, index) {
	return displayWidth(source.slice(0, Math.max(0, index)));
}

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

	format({ color = true, width = getTerminalWidth() } = {}) {
		const { type, start, errlength } = this;
		const sourceLines = [].concat(this.source ?? "").map(line => String(line).replace(/\t/g, "    "));
		const msgLines = String(this.message).split("\n");
		const lastLineNumber = Number(this.startline) + Math.max(0, sourceLines.length - 1);
		const numWidth = Math.max(String(this.startline).length, String(lastLineNumber).length);
		const pad = amount => " ".repeat(Math.max(0, amount));
		const longest = lines => lines.reduce((max, line) => Math.max(max, displayWidth(line)), 0);

		// The existing frame is eight columns wider than its content area.
		// Keep the complete error title visible even in unusually narrow terminals.
		const terminalWidth = Math.max(1, Math.floor(Number(width) || 80));
		const maxContentWidth = Math.max(1, terminalWidth - 8);
		const naturalContentWidth = Math.max(
			30,
			numWidth + 3 + longest(sourceLines),
			longest(msgLines)
		);
		const contentLen = Math.min(naturalContentWidth, maxContentWidth);
		const boxWidth = contentLen + 6;
		const sourceWidth = Math.max(1, contentLen - numWidth - 3);
		const paint = color ? C : Object.fromEntries(Object.keys(C).map(key => [key, ""]));
		const errorColor = color ? this.color : "";

		const wall = `${paint.gray}┃${paint.reset}`;
		const blankRow = wall + pad(boxWidth) + wall;
		const divider = "━".repeat(boxWidth);
		const row = (content, visibleLen = displayWidth(content)) =>
			`${wall}   ${content}${pad(contentLen - visibleLen)}   ${wall}`;

		const titleFill = Math.max(0, contentLen + 4 - (displayWidth(type) + 1));
		const top = `${paint.gray}┏━ ${errorColor}${paint.bold}${type}${paint.reset}${paint.gray} ${"━".repeat(titleFill)}┓${paint.reset}`;

		const sourceRows = sourceLines.flatMap((source, lineIndex) => {
			const lineNumber = String(Number(this.startline) + lineIndex).padStart(numWidth);
			const segments = wrapLine(source, sourceWidth);
			const isErrorLine = lineIndex === this.errline || sourceLines.length === 1;
			const rows = [];

			segments.forEach((segment, segmentIndex) => {
				const number = segmentIndex === 0
					? `${paint.yellow}${paint.bold}${lineNumber}${paint.reset} ${paint.yellow}┃${paint.reset} `
					: `${pad(numWidth)} ${paint.yellow}┃${paint.reset} `;
				rows.push(row(`${number}${paint.white}${segment.text}${paint.reset}`));

				if (!isErrorLine) return;

				const errorStart = sourceColumnAt(source, start);
				const rawErrorLength = Math.max(0, Number(errlength) || 0);
				const errorEnd = errorStart + (
					rawErrorLength > 0
						? displayWidth(source.slice(start, start + rawErrorLength))
						: 1
				);
				const overlapStart = Math.max(errorStart, segment.startColumn);
				const overlapEnd = Math.min(errorEnd, segment.endColumn);
				const isZeroLengthAtEnd = rawErrorLength === 0 && errorStart === segment.endColumn;

				if (overlapEnd > overlapStart || isZeroLengthAtEnd) {
					const relativeStart = Math.max(0, overlapStart - segment.startColumn);
					const markLength = isZeroLengthAtEnd ? 1 : overlapEnd - overlapStart;
					const indent = 6 + numWidth + relativeStart;
					const available = Math.max(0, boxWidth - indent);
					const marks = Math.min(markLength, available);
					rows.push(
						`${wall}${pad(indent)}${errorColor}${paint.bold}${"-".repeat(marks)}${paint.reset}${pad(boxWidth - indent - marks)}${wall}`
					);
				}
			});

			return rows;
		});

		const messageRows = msgLines.flatMap(line =>
			wrapLine(line, contentLen).map(segment =>
				row(`${paint.white}${segment.text}${paint.reset}`, displayWidth(segment.text))
			)
		);

		return `\n${[
			top,
			blankRow,
			...sourceRows,
			...(sourceLines.length == this.errline ? [blankRow] : []),
			`${paint.gray}┣${divider}┫${paint.reset}`,
			blankRow,
			...messageRows,
			blankRow,
			`${paint.gray}┗${divider}┛${paint.reset}`,
		].join("\n")}\n`;
	}

	throw(options) {
		throw this.format(options);
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

function createError(message, type, startline, source, line = 0, start = 0, length = 0) {
	const sourceLines = [].concat(source ?? "");
	length = length || String(sourceLines[line] ?? "").length - start;

	switch (type) {
		case "reference":
			return new tarsReferenceError(message, line, sourceLines, startline, start, length);
		case "syntax":
			return new tarsSyntaxError(message, line, sourceLines, startline, start, length);
		case "type":
			return new tarsTypeError(message, line, sourceLines, startline, start, length);
		case "runtime":
			return new tarsRuntimeError(message, line, sourceLines, startline, start, length);
		default:
			return new tarsError("Unknown Error", message, line, sourceLines, startline, start, length, C.red);
	}
}

function punish(message, type, startline, source, line = 0, start = 0, length = 0, options = {}) {
	createError(message, type, startline, source, line, start, length).throw(options);
}

export function formatPunishment(message, type, startline, source, line = 0, start = 0, length = 0, options = {}) {
	return createError(message, type, startline, source, line, start, length).format({
		...options,
		color: options.color ?? false,
	});
}

export default punish;