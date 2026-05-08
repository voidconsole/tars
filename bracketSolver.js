function isWellBracketed(input) {
        const stack = [];
        for (const char of input) {
                if (char === "(" || char === "{" || char === "[") {
                        stack.push(char);
                } else if (char === ")" || char === "}" || char === "]") {
                        if (stack.length === 0) return false;
                        const last = stack.pop();
                        if (
                                (char === ")" && last !== "(") ||
                                (char === "}" && last !== "{") ||
                                (char === "]" && last !== "[")
                        ) {
                                return false;
                        }
                }
        }
        return stack.length === 0;
}

export default isWellBracketed;
