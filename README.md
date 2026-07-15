<img width="1282" height="519" alt="A4 - 76tars" src="https://github.com/user-attachments/assets/10abac89-12c3-4d37-8555-619019794d4c" />

<br><br>

<p align="center">
  <i>
tars stands for temporal, analytical, and stochastic.
<br>
The r reminds us that reality doesn't fit neatly into four letters.
  </i>
</p>

<br><br>
---
A language built for a world that no longer fits inside traditional programming.

Most programming languages were designed around a simple assumption:

Reality is deterministic.

If you assign a value, it is known.
If you compare two values, they are exact.
If you want uncertainty, probability, randomness, time, AI, simulation, prediction, or emergent systems, you build them yourself.

That assumption made sense when software mostly moved data from one place to another.

It makes far less sense when software predicts the future, drives vehicles, simulates physical systems, generates content, trains neural networks, and reasons under incomplete information.

***tars*** starts from a different assumption:

Uncertainty is not an edge case.

Time is not an edge case.

Intelligence is not an edge case.

They are becoming the default.

> ***tars*** is a stochastic, temporal, analytical, high-level general-purpose programming language and ecosystem designed to make those concepts first-class citizens instead of afterthoughts.

Built in JavaScript, targeting a Python AI runtime, ***tars*** aims to make everything from scientific computing to machine learning feel like part of the language itself.

<br><br>
---

# Why ***tars*** Exists

Programming languages have become increasingly specialized.

One ecosystem for machine learning.

Another for scientific computing.

Another for web development.

Another for simulation.

Another for data analysis.

***tars*** aims to provide a unified computational environment where these domains can coexist naturally.

The goal is not to replace every tool.

The goal is to remove unnecessary boundaries between them.

A neural network, a differential equation, a simulation, and a website are all systems.

***tars*** is designed to describe systems.

<br><br>
---


# Architecture
<img width="1290" height="907" alt="image" src="https://github.com/user-attachments/assets/3c6f6180-7413-452f-8b79-1c932f602bd6" />
<br><br>
The component names are descriptive; their names reflect their literal meanings.

<br><br>
---

# Computational Model

tars is built around the idea that modern computation extends beyond deterministic values.

Rather than treating time, mathematics, and uncertainty as libraries layered on top of the language, tars makes them first-class computational dimensions.

Every computation in tars exists across three complementary dimensions.

- **Temporal:** 
> Computation can evolve through time rather than existing only in the present. Values may represent the past, present, or future, evolve continuously, and be observed through collapse when a concrete state is required. Multiple timelines having different speeds can evolve independently. Time is part of the computation itself, not merely something measured around it.

- **Analytical:**  
> Mathematical reasoning is a native capability of the language. Structures such as lattices, vectors, tensors, equations, and computational models are treated as fundamental building blocks, enabling scientific computing, optimization, and simulation without relying on separate numerical ecosystems.

- **Stochastic:**  
> Uncertainty is represented directly rather than approximated through external libraries. Fluxions preserve distributions throughout computation, Seeds provide reproducible randomness, and collapse transforms possibility into observation only when a concrete value is required.

These dimensions are independent, yet compose naturally within the same program, allowing deterministic algorithms, mathematical models, temporal systems, and probabilistic computation to coexist under the same computational model.

<br><br>
---

# Language Overview

## Variables

Assignment uses `:`.

```***tars***
name: "Satwik"
age: 18
```

This keeps assignment distinct from equality.

<br><br>
---

## Data Types

### Strings

```***tars***
message: "Hello World"
```

### Numbers

```***tars***
integer: 42
decimal: 3.14159
```

### Quaternions

```***tars***
rotation: 1 + 2i + 3j + 4k
```

### Arrays

```***tars***
numbers: [1, 2, 3, 4]
```

### Objects

```***tars***
person: {
    name: "Alice",
    age: 24
}
```

<br><br>
---

# Functions

Functions are first-class values.

```***tars***
square: (x) {
    <- x * x
}

apply: (f, value) {
    <- f(value)
}

result: apply(square, 5)
```

Functions can be stored, passed, and returned like any other value.

<br><br>
---

# Control Flow

## Conditionals

```***tars***
if score > 90 {
    >>> "Excellent"
}
```

Fluxions automatically collapse inside conditional evaluation.

```***tars***
temperature: 30 ~ 5

if temperature ~= 30 {
    >>> "Near expected value"
}
```

<br><br>
---

## Loops

### Range Loop

```***tars***
for i in 0..10 {
    >>> i
}
```

### Collection Loop

```***tars***
for item in inventory {
    >>> item
}
```

<br><br>
---

# Probability & Stochastic Computation

***tars*** treats uncertainty as a native computational concept.

## Uniform Fluxions

```***tars***
temperature: 30 ~ 5
```

Represents values between 25 and 35.

<br><br>
---

## Boolean Fluxions

```***tars***
flag: maybe
```

Represents:

```text
50% true
50% false
```

<br><br>
---

## Random Sampling

```***tars***
noise: <>
```

Generates a value between 0 and 1.

<br><br>
---

## Weighted Distributions

```***tars***
choice: <0.1:"A", 0.4:"B", 0.5:"C">
```

Produces weighted probabilistic outcomes.

<br><br>
---

# Approximate Equality

Many systems operate on measurements rather than exact values.

***tars*** provides approximate comparison directly.

```***tars***
if reading ~= expected {
    >>> "Acceptable"
}
```

This becomes particularly useful when working with simulations, sensors, scientific computation, and AI systems.

<br><br>
---

# Pipelines

Many computations are simply transformations.

***tars*** provides pipeline syntax to express them directly.

```***tars***
data
-> clean
-> normalize
-> analyze
-> export
```

Pipelines allow computations to be expressed as flows rather than nested calls.

<br><br>
---

# Lattices

***tars*** introduces a unified structure called a Lattice.

A lattice can behave as:

* Matrix
* Spreadsheet
* Dataset
* Tensor foundation
* Computational grid

depending on context.

## Matrix Mode

```***tars***
grid: |
  1, 2, 3
  4, 5, 6
  7, 8, 9
|
```

<br><br>
---

## Dataset Mode

```***tars***
students: |
  Name, Physics, Math
  Alice, 91, 95
  Bob, 87, 90
|
```

Column access:

```***tars***
students.Physics
```

<br><br>
---

# Input & Output

Output:

```***tars***
>>> "Hello World"
```

Input:

```***tars***
name: <<<
```

Prompted Input:

```***tars***
name: <<< "Enter your name"
```

<br><br>
---

# File Operations

Read:

```***tars***
content: read("data.txt")
```

Write:

```***tars***
write("output.txt", content)
```

Append:

```***tars***
append("log.txt", "entry")
```

<br><br>
---

# Error Handling

```***tars***
try {
    risky()
}
catch err {
    >>> err
}
finally {
    cleanup()
}
```

<br><br>
---
# Time

Time is a native construct within ***tars***.

```***tars***
#timer.start()

if #timer = 10 {
    >>> "Done"
}
```

Additional temporal systems include:

* Timers
* Temporal conditions
* Scheduling
* Time-aware simulations
* State evolution

<br><br>
---

# Mathematics

Mathematics is a foundational capability of ***tars***.

Planned support includes:

* Algebra
* Calculus
* Trigonometry
* Complex Numbers
* Vectors
* Matrices
* Tensors
* Quaternions
* Differential Equations
* Optimization
* Statistics
* Signal Processing
* FFT

Example:

```***tars***
force: mass * acceleration
```

```***tars***
trajectory:
    solve(projectile_equation)
```

<br><br>
---


# Artificial Intelligence

Artificial intelligence is a primary domain of ***tars***.

The language is being designed to support machine learning systems directly rather than treating them as separate ecosystems.

## Example

```***tars***
data: Dataset("data.csv")

model: Classifier(data)

model.train()

prediction: model.predict(input)
```

<br><br>
---

## Supported Data Types

* Text
* Images
* Audio
* Video
* Time Series
* Graphs
* Multimodal Data

## Supported Tasks

* Classification
* Regression
* Generation
* Translation
* Summarization
* Detection
* Segmentation
* Clustering
* Retrieval
* Reinforcement Learning
* Reasoning

<br><br>
---


# Modules

Export:

```***tars***
add: (a,b) {
    <- a+b
}

export { add }
```

Import:

```***tars***
import "math.star" { add }

result: add(2,3)
```

Namespace Import:

```***tars***
import "math.star" as math

math.add(2,3)
```

<br><br>
---

# Example: Noisy Sensor Simulation

```***tars***
actualTemperature: 30 ~ 5
sensorNoise: <> * 2

reading:
    <actualTemperature> +
    sensorNoise

if reading ~= 30 {
    >>> "Within expected range"
}
```

<br><br>
---

# Example: Machine Learning Pipeline

```***tars***
data:
    load("dataset.csv")

data
-> clean
-> normalize
-> split

model:
    Classifier(data)

model.train()

accuracy:
    model.test()

>>> accuracy
```

<br><br>
---

# Example: Rocket Simulation

```***tars***
wind: 15 ~ 3
thrust: 5000 ~ 200

trajectory:
    simulate(
        wind,
        thrust
    )

>>> <trajectory>
```

<br><br>
---

# Current Progress

### Completed

* Core parser
* Dispatcher architecture
* Flux syntax
* Temporal syntax
* Input handling
* Assignment syntax
* String escape support
* Parser optimization
* Bracket validation

### In Progress

* Assignment & memory management
* Error handling framework

### Planned

* Type inference
* Pattern matching
* Package manager
* REPL
* LSP support
* Debugger
* Testing framework
* FFI
* Concurrency primitives
* Security model
* Cross compilation

<br><br>
---

# Implementation

Compiler: JavaScript

Runtime Target: Python, Rust, C

Execution Model:

* Compiled
* Interpreted

File Extension:

```text
.star
```

Examples:

```text
simulation.star
model.star
website.star
```

<br><br>
---

# Vision

***tars*** is an attempt to rethink what a programming language becomes when uncertainty, time, intelligence, mathematics, and software are treated as parts of the same system rather than separate domains.

The long-term objective is not merely to create another language.

It is to create a computational environment capable of expressing everything from equations and simulations to agents, models, applications, and entirely new forms of computation through a single coherent framework.

<br><br>
---

<br><br>
<p align="center"> tars is a language for building systems that evolve, predict, learn, simulate, and reason. </p>
