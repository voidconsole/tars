# Variables

## Structure / Syntax

```
variableName = value
```

A variable may hold any datatype: string, number, float, array, object, matrix, sheet, CSV, fluxion, function reference, etc.

---

# Strings

## Structure / Syntax

```
myString = "text"
```

## Use-Case

Storing UI labels, user input, file paths, serialized data.

---

# Numbers

## Structure / Syntax

```
myNum = 34
myFloat = 35.64
```

## Use-Case

Counters, indices, physics values, configuration parameters.

---

# Arrays

## Structure / Syntax

```
myArray = [item1, item2, item3, [nestedItems]]
```

## Use-Case

Lists of values, stacks, queues, arguments, nested structures.

---

# Objects

## Structure / Syntax

```
myObj = {
	key1: value1;
	key2: value2;
}
```

## Use-Case

Configuration structures, grouped data, dictionaries, parameter maps.

---

# Functions

## Structure / Syntax

```
hello = (param1, param2) {
	return expression
}
```

Functions are first-class values assigned to variables.

## Use-Case

Encapsulation of repeated logic, transformations, math utilities.

---

# Comments

## Single-Line

```
:) a simple comment
```

## Multi-Line

```
:(
   multiple lines of documentation
:)
```

## Use-Case

Annotations, explanations, temporary disabling of code sections.

---

# Matrix

## Structure / Syntax

```
myMatrix = <
  [r1c1, r1c2, r1c3],
  [r2c1, r2c2, r2c3],
  [r3c1, r3c2, r3c3]
>
```

A rectangular 2D grid. All rows must have equal length.

## Use-Case

Representing:

-   Physics simulation grids
-   Transformation matrices
-   Map tiles
-   Adjacency matrices

---

# Sheet

## Structure / Syntax

```
mySheet = <
  ColumnA:[row1, row2, row3],
  ColumnB:[row1, row2, row3],
  ColumnC:[row1, row2, row3]
>
```

Column-oriented tabular data. Every column must have the same number of rows.

## Use-Case

Useful for:

-   Small in-memory tables
-   Datasets with named fields
-   Structured data import/export
-   Computations where columns matter more than rows

---

# CSV

## Structure / Syntax

```
myCsv = <
  a1, a2, a3;
  b1, b2, b3;
  c1, c2, c3
>
```

Row-oriented simple table.
`;` separates rows, `,` separates cells.

## Use-Case

Ideal for:

-   Logs
-   Exporting/importing to external tools
-   List-like data meant to be saved or transmitted

---

# Fluxion Type

Represents uncertain, fuzzy, or probabilistic values.

## Boolean

```
flag = true
flag2 = false
```

## Flux Range (Value with Tolerance)

```
temp = 30 ~ 5        // meaning: 30 with ±5 variation
```

## Probabilistic / Maybe-Value

```
choice = maybe
chance = maybe 0.3   // 30% weight or likelihood
```

## Use-Case

Useful in:

-   Noisy sensor readings
-   AI logic
-   Approximated physics values
-   Probabilistic decisions
-   Fuzzy comparisons

---

# Operators

These operators apply to all numeric-compatible types and, where appropriate, strings, arrays, and fluxions.

## Arithmetic

```
+   addition
-   subtraction
*   multiplication
/   division
^   power
```

## Flux Operator

```
~   creates a fuzz-range: a ~ b meaning "a with tolerance b"
```

## Logical / Negation

```
!   negation or logical not
```

## Compound Assignments

```
+=   add and assign
-=   subtract and assign
*=   multiply and assign
/=   divide and assign
^=   exponentiate and assign
!=   invert or negate and assign
~=   adjust flux tolerance and assign
```

## Pipeline

```
value -> func -> nextFunc
```

This passes the result of each expression into the next function, left to right.
Functional-style chaining.
Useful for:

-   Data transformations
-   Stream processing
-   Signal pipelines
-   Computational pipelines

Example:

```
data -> clean -> normalize -> export
```

---

# Conditionals

Conditionals evaluate expressions and execute blocks based on truth values, comparisons, or flux (fuzzy) checks.

---

# If / Else

## Structure / Syntax

```
if (condition) {
	...block...
} else if (condition) {
	...block...
} else {
	...block...
}
```

-   Parentheses contain any valid expression that returns a boolean or flux-evaluated boolean.
-   Blocks must explicitly return or mutate something depending on context.

## Use-Case

Regular branching logic.

Example:

```
if (score > 90) {
	grade = "A"
} else if (score > 75) {
	grade = "B"
} else {
	grade = "C"
}
```

---

# Comparison Operators

Standard comparisons:

```
==   equal
!=   not equal
>    greater than
<    less than
>=   greater or equal
<=   less or equal
```

Used inside conditions:

```
if (a == b) { ... }
```

---

# Flux Checking

Flux values allow fuzzy comparisons.

---

# Approximate Equality

## Structure / Syntax

```
if (A ~= B) { ... }
```

`A ~= B` means:
A and B are within tolerance.

### Rules:

1. If A is `value ~ tol`, tolerance is `tol`.
2. If B is `value ~ tol`, tolerance is `tol`.
3. If both are fuzzy, tolerances add.
4. If one side is crisp (just a number/string), tolerance comes from the fuzzy side.
5. Approx check succeeds when:

```
abs(A.value - B.value) <= combinedTolerance
```

## Use-Case

Sensor comparisons, noisy values, physics buffers, animation smoothing.

Example:

```
targetTemp = 100
reading = 98 ~ 3

if (reading ~= targetTemp) {
	status = "stable"
}
```

---

# Maybe Checks (Probabilistic Truth)

`maybe` represents unknown or probabilistic truth.

## Structure / Syntax

```
if (value ?) { ... }
```

Where:

-   `value = maybe` → 50% default probability
-   `value = maybe p` → probability weight p (0 to 1)

### Behavior:

```
value ?    returns true with probability p
```

## Use-Case

AI behavior, branching randomness, decision systems.

Example:

```
wander = maybe 0.2

if (wander ?) {
	action = "randomMove"
} else {
	action = "followPath"
}
```

---

# Flux Range Checking

Compare a crisp value against a fuzzy range.

## Structure / Syntax

```
if (X in Y) { ... }
```

Where Y is a flux range `value ~ tol`.

### Meaning:

```
abs(X - Y.value) <= Y.tolerance
```

## Use-Case

Threshold detection, margin-of-error logic.

Example:

```
speed = 39
limit = 40 ~ 2

if (speed in limit) {
	alert = "safe"
}
```

---

# Combined Conditionals

All boolean logic works:

```
&&   logical and
||   logical or
!    negate
```

Example:

```
if ((temp ~= 80) && (pressure > 30)) {
	state = "nominal"
}
```

---

# Pipeline Inside Condition

Pipelines evaluate to a value, so they’re allowed:

```
if (sensorData -> normalize -> clamp ~= 0) {
	safe = true
}
```

---
