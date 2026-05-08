# TARS

A stochastic-temporal programming language where **uncertainty, values, and time
coexist as first-class constructs**. TARS is designed for:

- simulations
- AI systems
- physics modeling
- generative systems
- structured computation under uncertainty

---

<!-- TODO: Verbosify the documentation -->

# Core Philosophy

TARS operates on three layers:

1. **Deterministic Values** — exact, known values
2. **Fluxions** — values with uncertainty (distributions)
3. **Collapse (`<...>`)** — sampling uncertainty into reality

> You don’t “generate randomness”. You **resolve uncertainty**.

---

# File

```
script.star
```

---

# Variables

## Syntax

```
name: value
```

- `:` is **assignment**
- Variables can store any type

---

# Data Types

## Strings

```
label: "hello"
```

---

## Numbers

```
a: 10
b: 3.14
q: 1 + 2i + 3j + 4k
```

---

## Arrays

```
arr: [1, 2, 3, [4,5]]
```

---

## Objects

```
obj: {
  x: 10,
  y: 20
}
```

---

## Functions

```
add: (a, b) {
  <- a + b
}
```

- Last expression auto-returns
- `<-` forces return

---

# Comments

```
=] single line

=|
multi line
|=
```

---

# Fluxion System (Uncertainty Core)

A **Fluxion** represents a value as a **distribution**, not a fixed number. The
tolerences of a distribution are operated arithimatically similar to physical
uncertainity.

---

## Range (Uniform Distribution)

```
temp: 30 ~ 5
```

Meaning:

> Uniform distribution from 25 to 35

---

## Boolean Fluxion

```
flag: maybe
```

Meaning:

> 50% true, 50% false

---

# Collapse Operator `<...>`

## Definition

```
<expr>
```

> Samples a value from a distribution **immediately at evaluation time**

---

## Examples

```
<>              // Uniform(0,1)
<Gaussian>      // Gaussian(0,1)
<x>             // sample fluxion x
```

---

## Important Rules

### 1. Immediate Evaluation

```
x: <>
y: x
```

- `x` is already a resolved value

---

### 2. Independent Sampling

```
x: 30 ~ 5

a: <x>
b: <x>
```

- `a` and `b` are **different samples**

---

### 3. Single Meaning

> `<...>` ALWAYS means: **sample from distribution**

### Weighted Distribution

```
choice: <0.1:"A", 0.4:"B", 0.5:"C">
```

Rules:

- weights can be any numbers
- automatically normalized

---

# Operators

## Arithmetic

```
+  -  *  /  ^
```

## Assignment

```
:    assign
+:   add assign
-:   subtract assign
*:   multiply assign
/:   divide assign
^:   power assign
```

## Comparison

```
=   equal
!=  not equal
>   greater
<   less
>=  greater equal
<=  less equal
~=  approximate
```

---

# Approximate Equality

```
if (A ~= B)
```

Rules:

- works with fluxions
- uses tolerance

```
abs(A - B) <= tolerance
```

---

# Conditionals

## Syntax

```
if condition {
  ...
}
```

---

## Auto Collapse Rule

> Fluxions are **automatically sampled once per reference** inside conditionals

---

### Example

```
x: 30 ~ 5

if (x ~= 30) {
  >>> "near 30"
}
```

Equivalent to:

```
if (<x> ~= 30)
```

---

### Important

```
if (x + x > 50)
```

means:

```
<x> + <x>
```

NOT:

```
2 * <x>
```

---

# Loops

## Range Loop

```
for i in 0..10 {
  >>> i
}
```

---

## Array Loop

```
for item in arr {
  >>> item
}
```

---

# Try / Catch

```
try {
  risky()
} catch err {
  >>> err
}
```

Optional:

```
finally {
  cleanup()
}
```

---

# Pipeline

```
value -> func -> next
```

Example:

```
data -> clean -> normalize -> export
```

---

# Lattice System (Matrix + Sheet Unified)

## Matrix Mode

```
// No header → matrix mode
grid: |
  1, 2, 3
  4, 5, 6
  7, 8, 9
|
```

- numeric grid
- matrix operations enabled

---

## Sheet Mode

```
// Header → named columns
data: |
  Name, Age, Score
  alice, 28, 0.91
  bob, 34, 0.87
|
```

- column access enabled

```
data.Name
```

---

---

# Time System

```
#timer.start()
#timer.pause(5)
#timer.play()

if #timer = 10 {
  >>> "done"
}
```

```
freeze()
```

---

# Standard IO

```
>>> "output"

input: <<<
input2: <<< "prompt"
```

---

# Execution Model

1. Values exist
2. Fluxions represent uncertainty
3. `<...>` resolves uncertainty
4. Conditionals auto-collapse

---

# Example (Putting It All Together)

```
temp: 30 ~ 5
noise: <>
flag: maybe

value: <temp> + noise

if (flag AND temp ~= 30) {
  >>> value
}
```

---

# Design Principles

- One meaning per symbol
- Uncertainty is first-class
- Sampling is explicit (except conditionals)
- No hidden behavior

---

# What TARS Enables

- physics simulations with uncertainty
- AI decision systems
- procedural generation
- probabilistic modeling
- data pipelines with noise

---

# General Purpose Capabilities

TARS is not limited to stochastic systems — it is a **fully general-purpose
language**.

## 1. Control Flow

```
if condition { }
for i in 0..10 { }
try { } catch err { }
```

Supports:

- branching
- iteration
- error handling

---

## 2. Functions as First-Class Values

```
square: (x) { <- x * x }

apply: (f, v) {
  <- f(v)
}

apply(square, 5)
```

- functions can be passed, stored, returned

---

## 3. Data Structures

- arrays
- objects
- lattices (matrix + table hybrid)

```
users: [
  {name:"a"},
  {name:"b"}
]
```

---

## 4. Functional Pipelines

```
data -> clean -> transform -> output
```

- enables composable transformations

---

## 5. Mathematical Computing

- vectors, matrices
- quaternions
- lattice operations

```
weights @ weights.T
```

---

## 6. Input / Output

```
>>> "hello"
input: <<<
```

---

## 7. Modules (Import / Export)

TARS supports modular code organization.

### Export

```
add: (a, b) { <- a + b }

export { add }
```

### Import

```
import "math.star" { add }

result: add(2, 3)
```

### Namespace Import (optional)

```
import "math.star" as math

math.add(2, 3)
```

---

## 8. File I/O

Basic file operations are built-in.

### Read File

```
content: read("data.txt")
```

### Write File

```
write("out.txt", content)
```

### Append

```
append("log.txt", "new entry")
```

---

## 9. Extensibility

TARS can integrate with:

- JavaScript runtime
- external libraries
- system APIs

---

## 10. Deterministic + Stochastic Hybrid

TARS uniquely allows:

```
deterministic + uncertain → combined systems
```

```
signal: 10
noise: <>

result: signal + noise
```

---

# Tensor Support (Nested Lattices)

Tensors are supported as **nested lattice structures**.

## Example

Rules:

- each nested layer represents a higher dimension
- consistent shape is required

---

## Behavior

- 2D lattice → matrix
- 3D+ lattice → tensor

Operations:

- element-wise arithmetic
- broadcasting (future extension)
- slicing (future extension)

---

## Design Note

Tensors are **not a separate type**.

> They are an extension of the lattice system into higher dimensions.

---

# Final Definition

TARS is:

> A general-purpose programming language where computation happens not just on
> values, but on **distributions, time, and evolving systems**, unified through
> a single collapse-based execution model.
