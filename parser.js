import bufferer from "./bufferer.js"
function parse(input) {
	input = input.replace(/\r\n/g, "\n").replace(/\r/g, "\n") + "\n"
	var buffer = []
	var commandNum = 0
	var depthAngular = 0
	var depthCurly = 0
	var depthSquare = 0
	var depthParen = 0
	var inString = false
	var stringChar = null
	var inSingleComment = false
	var inMultiComment = false
	var meta = {
		angular: false,
		curly: false,
		square: false,
		paren: false,
		angular: false,
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
			buffer.push(char)
		}
		if (char === ":" && (input[i + 1] === ")" || input[i + 1] === "|")) {
			inSingleComment = input[i + 1] === ")"
			inMultiComment = input[i + 1] === "|"
			continue
		}
		if (char === "\n" && inSingleComment) {
			inSingleComment = false
			//TODO: handle single line comment buffer if needed
			console.log("Single line comment skipped.", buffer)
			buffer = []
			continue
		}
		if (char === ":" && input[i - 1] === "|" && inMultiComment) {
			inMultiComment = false
			//TODO: handle multi line comment buffer if needed
			console.log("Multi line comment skipped.", buffer)
			buffer = []
			continue
		}
		if (!inSingleComment && !inMultiComment) {
			if (!inString) {
				switch (char) {
					case "<":
						depthAngular++
						meta.angular = true
						break
					case ">":
						depthAngular--
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
				depthAngular === 0 &&
				depthCurly === 0 &&
				depthSquare === 0 &&
				depthParen === 0 &&
				buffer.length > 1
			) {
				let bufferStr = buffer.join("").trim()
				if (
					bufferStr !== "" &&
					bufferStr != null &&
					bufferStr !== "\n"
				) {
					commandNum++
					console.log(commandNum + bufferStr)
					bufferer(bufferStr, meta)
					buffer = []
					meta = {
						angular: false,
						curly: false,
						square: false,
						paren: false,
						equals: false,
					}
					console.log(
						"---------------------------------------------------------------------------\n"
					)
					
				}
			}
		}
	}
}
export default parse
