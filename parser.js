import bufferer from "./bufferer.js"
function parse(input) {
	input = input.replace(/\r\n/g, "\n").replace(/\r/g, "\n") + "\n"
	var buffer = []
	var subBuffer = []
	var commandNum = 0
	var inLattice = false
	var depthCurly = 0
	var depthSquare = 0
	var depthParen = 0
	var inString = false
	var stringChar = null
	var inSingleComment = false
	var inMultiComment = false
	var meta = {
		curly: false,
		square: false,
		paren: false,
		lattice: false,
		equals: false,
	}

	for (let i = 0; i < input.length; i++) {
		const char = input[i]
		if (char === "\t" || char === "\v") {
			if (inSingleComment || inMultiComment || inString) {
				buffer.push(char)
			}
			continue
		} else {
			if (!inSingleComment && !inMultiComment){
				buffer.push(char)
			}else{
				subBuffer.push(char)
			}
			// console.log(`Char: "${char}"| Buffer: ${buffer.join('')}`)
		}
		if (char === ":" && (input[i + 1] === ")" || input[i + 1] === "|")) {
			inSingleComment = input[i + 1] === ")"
			inMultiComment = input[i + 1] === "|"
			buffer.pop() // remove : from buffer
			
			subBuffer.push(char)
			continue
		}
		if (char === "\n" && inSingleComment) {
			inSingleComment = false
			//TODO: handle single line comment buffer if needed
			console.log("Single line got here in sub:", subBuffer.join("").trim())
			subBuffer = []
			continue
		}
		if (char === ":" && input[i - 1] === "|" && inMultiComment) {
			inMultiComment = false
			//TODO: handle multi line comment buffer if needed
			console.log("Multi line comment got here:", subBuffer.join("").trim())
			subBuffer = []
			continue
		}
		if (!inSingleComment && !inMultiComment) {
			if (!inString) {
				switch (char) {
					case "|":
						meta.lattice = true
						inLattice = !inLattice
						break
					case "{":
						meta.curly = true
						depthCurly++
						break
					case "}":
						depthCurly--
						break
					case "[":
						meta.square = true
						depthSquare++
						break
					case "]":
						depthSquare--
						break
					case "(":
						meta.paren = true
						depthParen++
						break
					case ")":
						depthParen--
						break
					case "=":
						meta.equals = true
						break
				}
				// console.log(
				// 	depthAngular,
				// 	depthCurly,
				// 	depthSquare,
				// 	depthParen
				// )
			}
			if (("'" + "`" + '"').includes(char) && !inString)
				[inString, stringChar] = [true, char]
			else if (char === stringChar) [inString, stringChar] = [false, null]

			
			if (
				char === "\n" &&
				!inString &&
				!inLattice &&
				depthCurly === 0 &&
				depthSquare === 0 &&
				depthParen === 0 &&
				buffer.length > 1
			) {
				buffer.pop() // remove newline
				let bufferStr = buffer.join("").trim()
				if (
					bufferStr !== "" &&
					bufferStr !== null &&
					bufferStr !== "\n"
				) {
					if((bufferStr.startsWith("if") || bufferStr.startsWith("for") || bufferStr.startsWith("while") || bufferStr.startsWith("else")) && bufferStr.endsWith(")")){
						// likely a control statement that should include the next block
						console.log("Control statement detected, waiting for block...")
						continue
					}
					commandNum++
					console.log(commandNum + " __" + bufferStr+"__ ")
					bufferer(bufferStr, meta)
					buffer = []
					meta = {
						lattice: false,
						curly: false,
						square: false,
						paren: false,
						equals: false,
					}
					console.log(
						"---------------------------------------------------------------------------\n"
					)
					
				}
buffer = []



			}
		}
	}
}


export default parse

