// Copyright (c) 2026 Satwik Bhusanur
// SPDX-License-Identifier: Apache-2.0

// import { performance } from "perf_hooks"; // in Node; in Deno use globalThis.performance

function bench(func, s, iterations = 1000) {
        const t0 = globalThis.performance.now();

        for (let i = 0; i < iterations; i++) {
                try {
                        func(s);
                } catch (error) {
                        console.error(error);
                }

                // console.log(`\n\n---------------------Iteration ${i+1} complete---------------------\n\n`)
        }
        const t1 = globalThis.performance.now();
        return (t1 - t0) / iterations;
}

// set up `s` as a realistic large input, perferably read from a file
export default bench;
