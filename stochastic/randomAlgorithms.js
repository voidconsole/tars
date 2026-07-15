// Copyright (c) 2026 Satwik Bhusanur
// SPDX-License-Identifier: Apache-2.0



// 1. Recursive hashing
// 2. Character extraction of an hash
function hash(seed) {
	seed = seed.toString()
	let out = ''
	let buffer = seed.codePointAt(0)
	for (let round = 1; round < 5; round++) {
		buffer += seed.codePointAt(round % seed.length)
		for (let i = 1; i <= 128; i++) {
			let previousBuffer = buffer
			buffer ^= buffer >>> 13
			buffer = Math.imul(previousBuffer, buffer ^ previousBuffer)
				^ (buffer << 17 | buffer >>> 15)
			buffer = (buffer ^ (buffer * seed.codePointAt((i - 1) % seed.length))) >>> 0
		}
		buffer ^= buffer >>> 13
		buffer = Math.imul(buffer, 0xc2b2ae35)
		buffer ^= buffer >>> 16
		out += buffer.toString(16).padStart(8, '0')
	}
	return out
}

function obfuscate(seed) {
	let base = hash(seed)
	// console.log("BASE: ", base)
	let buffer = seed.toString().codePointAt(0)
	let suffer = ""
	for (let i = 1; i <= base.length; i++) {
		let previousBuffer = buffer + base.codePointAt((i - 1) % base.length)
		// console.log("STEP1: ", buffer) 
		buffer =
			parseInt(
				buffer
					.toString(16)
					.padStart(8, '0')
					.split('')
					.reverse()
					.join(''),
				16
			) >>> 0		// buffer = base.codePointAt(i - 1) << 13
		// console.log("STEP2: ", buffer)
		const irrational =
			(Math.PI * (buffer ^ previousBuffer) * (i + Math.E))
				.toString()
				.replace('.', '')
		buffer ^= buffer >>> (base.codePointAt(base.length - i) % 5 + 1)		// console.log("STEP3: ", buffer)
		buffer = (parseInt(irrational, seed.toString().codePointAt(i - 1) % 32 + 4)).toString()
		buffer = hash(parseInt(buffer + `${Math.sqrt(i + 2 * Math.E)}`, 36))


		buffer ^= previousBuffer >> 17
		buffer ^= Math.imul(
			base.codePointAt(i - 1),
			buffer ^ previousBuffer
		)
		buffer = ((buffer << 15) | (buffer >>> 17)) ^ base.codePointAt(i - 1)		// console.log("STEP8: ", buffer)
		buffer ^= (
			base.codePointAt(i - 1) *
			base.codePointAt(base.length - i)
		) >>> 0
		// console.log("STEP7: ", (buffer >>> 0).toString(2).padStart(32, '0'))
		const h = hash(hash(buffer.toString()) + buffer.toString())
		buffer ^= parseInt(h.slice(0, 8), 16) >>> 0
		// console.log("STEP8: ", buffer)
		suffer += (buffer >>> 0)
			.toString(2)
			.padStart(32, '0')
	}

	// console.log("SUFFER: ", suffer)
	return suffer
}
let index = 0
function* oblivion() {
	while (true) {
		yield obfuscate(index++)
	}
}


let percentArray = []
const generator = oblivion()
for (let i = 0; i < 10000; i++) {
	const { zeroCount, oneCount } = onePercent(generator.next().value)
	percentArray.push(zeroCount / (zeroCount + oneCount) * 100)
}

function onePercent(text) {
	let zeroCount = 0	
	let oneCount = 0
	for (let i = 0; i < text.length; i++) {
		const char = text[i]
		if (char === '0') {
			zeroCount++
		} else if (char === '1') {
			oneCount++
		}
	}
	return { zeroCount, oneCount }
}


function median(arr) {
	if (!arr.length) return null

	const sorted = [...arr].sort((a, b) => a - b)
	const mid = Math.floor(sorted.length / 2)

	if (sorted.length % 2 === 0) {
		return (sorted[mid - 1] + sorted[mid]) / 2
	}

	return sorted[mid]
}
function mean(arr) {
	let sum = 0;
	for (let a of arr) {
		sum += a
	}
	return sum / arr.length
}
function mode(arr) {
	// lets say the data is [0,2, 34,5,3,1] mode is 34
	let frequency = {};
	let maxFreq = 0;
	let modeValue = null;
	for (let num of arr) {
		frequency[num] = (frequency[num] || 0) + 1;

		if (frequency[num] > maxFreq) {
			maxFreq = frequency[num];
			modeValue = num;
		}
	}

	return modeValue;

}
console.log("Median: ", median(percentArray))
console.log("Mean: ", mean(percentArray))
console.log("Mode: ", mode(percentArray))
// console.log("Deviation from 50%: ", percentArray.map(p => Math.abs(p - 50)))
console.log("Mean deviation from 50%: ", mean(percentArray.map(p => Math.abs(p - 50))))
console.log("Lowest: ", Math.min(...percentArray))
console.log("Highest: ", Math.max(...percentArray))
console.log("Range: ", Math.max(...percentArray) - Math.min(...percentArray))