=| 
   TARS Compiler Test Suite
   Version: 1.0
   Coverage: All datatypes, Lattices, Fluxions, and Control Flow
   Copyright (c) 2026 Satwik Bhusanur
   SPDX-License-Identifier: Apache-2.0
|=

=] --- SECTION 1: BASIC VARIABLES & TYPES ---
app_name: "TarsOS"
version: 2i + 3j + 7k =] Quaternions 
sensor_readings: 34 ~ 5
is_active: maybe
tags: ["compiler", "fuzzy-logic", ["sub-tag", 42]]
=] config: {
=]     mode: "debug";
=]     timeout: 500;
=]     buffer: 0.05;
=] }
weather = <30: "Sunny", 50: "Cloudy", 20: "Rainy">
=] --- SECTION 2: LATTICE STRUCTURES ---
=] Matrix: 2D Grid
spatial_grid: |
    [1.0, 0.0, 0.0],
    [0.0, 1.0, 0.0],
    [0.0, 0.0, 1.0]
|

=] Sheet: Column-oriented
data_sheet: |
    ID:[1, 2, 3],
    Label:["A", "B", "C"],
    Value:[10.5, 20.1, 15.3]
|

=] CSV: Row-oriented
log_data: |
    2025-12-30, "ERR_01", "Sensor Timeout";
    2025-12-30, "INF_02", "System Restart";
    2025-12-31, "WRN_01", "Low Voltage"
|

=] --- SECTION 3: FLUXION TYPES (FUZZY LOGIC) ---
temp_reading: 25.5 ~ 0.5    =] helo world

system_failure: maybe       =] 50% chance
critical_risk: maybe ~ 0.8  =] 80% weight

=] --- SECTION 4: FUNCTIONS & PIPELINES ---
=] Functions as first-class values
square: (n) {
    return n * n
}

clean: (val) {
    return val + 1.0
}
=] erranous
=] Pipeline execution
raw_input: 10
processed: raw_input -> square -> clean

=] --- SECTION 5: CONDITIONALS & FLUX CHECKING ---

=] Standard Comparison
if (version >= 2.0) {
	=] this is a test comment that should be ignored
    >>> "Software version is up to date."
} else {
    >>> "Update required."
}

=] Approximate Equality (~=)
target_voltage: 12.0
sensor_v: 11.9 ~ 0.2

if (sensor_v ~= target_voltage) {
    status: "Voltage Stable"
}

=] Range Checking (in)
speed: 41.5
limit: 40 ~ 2

if (speed in limit) {
    >>> "Speed within tolerance" =] handles the comments
}

=] Maybe Checks (Probabilistic Truth)
decision: <30: true, 70: false>

if (decision) {
    >>> "The 30% chance succeeded"
}

=] Pipeline inside a conditional
if (10 -> square ~= 100) {
    >>> "Math check passed"
}

=] --- SECTION 6: OPERATORS & I/O ---

count: 0
count +: 10
count *: 2
count ^: 2

>>> "Please enter system code: "
user_input: <<< "The prompt acing as standard output"

final_output: "System Result: " + user_input
>>> final_output
=] End of File
