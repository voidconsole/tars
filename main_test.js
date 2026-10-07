// Copyright (c) 2026 Satwik Bhusanur
// SPDX-License-Identifier: Apache-2.0

import parse from "./core/parser.js";
import bench from "./benchmark.js";
import { logVars } from "./core/handler.js";

async function loadStochastic() {
	const algoText = await Deno.readTextFile("./stochastic/randomAlgorithms.js");
	const genText = await Deno.readTextFile("./stochastic/randomGenerator.js");

	const cleanGen = genText
		.replaceAll("[0]*10", "new Array(10).fill(0)")
		.replaceAll("[0]*21", "new Array(21).fill(0)")
		.replaceAll("rndfnc()", "rndfn()")
		.replaceAll("testNum", "testnum")
		.replaceAll("sum = 0;", "let sum = 0;")
		.replaceAll(/for\s*\(\s*a\s+of/g, "for (let a of")
		.replaceAll("Math.max(arr)", "Math.max(...arr)");

	const algo = new Function(
		`${algoText}\nreturn { hash, obfuscate, oblivion, onePercent, mean, median, mode };`
	)();

	const gen = new Function(
		`${cleanGen}\nreturn { rngSeries, random, randomnessBenchmark, Statistics };`
	)();

	return { ...algo, ...gen };
}

function bitsToText(bitString) {
	let text = "";
	for (let i = 0; i < bitString.length; i += 8) {
		const byte = bitString.slice(i, i + 8);
		if (byte.length === 8) {
			text += String.fromCharCode(parseInt(byte, 2));
		}
	}
	return text;
}

function bitsToFloats(bitString) {
	const floats = [];
	for (let i = 0; i < bitString.length; i += 32) {
		const chunk = bitString.slice(i, i + 32);
		if (chunk.length < 32) break;
		floats.push(parseInt(chunk, 2) / 4294967295);
	}
	return floats;
}

if (import.meta.main) {
	try {
		const starData = await Deno.readTextFile("input.star");
		parse(starData);
		logVars();
	} catch (err) {
		console.error(err);
	}

	const { hash, obfuscate, onePercent, mean, median, mode, Statistics } = await loadStochastic();

	const seed = "hello universe";
	const hashedSeed = hash(seed);
	const bitString = obfuscate(seed);
	const textOutput = bitsToText(bitString);

	console.log("bits:", bitString);
	console.log("text:", textOutput);

	const bitCounts = onePercent(bitString);
	const floatValues = bitsToFloats(bitString);

	console.log("seed:", seed);
	console.log("hash:", hashedSeed);
	console.log("counts:", bitCounts);

	const stats = new Statistics(floatValues);
	console.log("stats mean:", stats.mean(floatValues));
	console.log("stats median:", stats.median(floatValues));
	console.log("stats range index:", stats.range(floatValues));

	const zeroPct = (bitCounts.zeroCount / (bitCounts.zeroCount + bitCounts.oneCount)) * 100;
	console.log("bit zero ratio:", zeroPct.toFixed(2) + "%");
	console.log("algo mean:", mean([zeroPct]));
	console.log("algo median:", median([zeroPct]));
	console.log("algo mode:", mode([zeroPct]));
}