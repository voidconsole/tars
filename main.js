// Copyright (c) 2026 Satwik Bhusanur
// SPDX-License-Identifier: Apache-2.0


import parse from "./core/parser.js";
import bench from "./benchmark.js";
import { logVars } from "./core/handler.js";
if (import.meta.main) {
        // handleConfig('path/to/config.file')
        Deno.readTextFile("input.star").then((data) => {
                try {
                        parse(data);
                        logVars();
                } catch (error) {
                        console.error(error);
                }
        }).then(() => {
                // console.log("Benchmarking parse function with input.star...")
                // console.log(`Average parse time over 1000 iterations: ${bench(parse, Deno.readTextFileSync("input.star"), 1000)} ms`)
        });
}
// new logic to read everything, idenitify tokens [ syntax matches] and then translate them into functions, which are essentionallly js functions that execute the logic defined in the tars file.

