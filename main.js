import lex from "./lexer.js";
import parse from "./parser.js";
if (import.meta.main) {
// handleConfig('path/to/config.file')
Deno.readTextFile('input.tars').then(data => {
const tokens = lex(data)
const parsed = parse(tokens)
})
}
