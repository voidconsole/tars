function isWellOrdering(input) {
    let stack = [];
    for (let char of input) {
        if (char === '(' || char === '{' || char === '[') {
            stack.push(char);
        } else if (char === ')' || char === '}' || char === ']') {
            if (stack.length === 0) return false;
            let last = stack.pop();
            if ((char === ')' && last !== '(') ||
                (char === '}' && last !== '{') ||
                (char === ']' && last !== '[')) {
                return false;
            }
        }
    }   return stack.length === 0;

}