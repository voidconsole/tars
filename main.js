import parse from "./parser.js"
if (import.meta.main) {
    // handleConfig('path/to/config.file')
    Deno.readTextFile("input.tars").then(data => {
	parse(data)
    })
}

// new logic to read everything, idenitify tokens [ syntax matches] and then translate them into functions, which are essentionallly js functions that execute the logic defined in the tars file.