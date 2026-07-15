// Copyright (c) 2026 Satwik Bhusanur
// SPDX-License-Identifier: Apache-2.0

import { assertEquals } from "@std/assert";
import { add } from "./main.js";

Deno.test(function addTest() {
        assertEquals(add(2, 3), 5);
});
