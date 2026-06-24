<img width="1282" height="519" alt="A4 - 76tars" src="https://github.com/user-attachments/assets/10abac89-12c3-4d37-8555-619019794d4c" />

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

---

# Core Model

Every computation in ***tars*** exists in one of three forms.

## Deterministic Values

Known quantities.

```***tars***
mass: 10
velocity: 5

momentum: mass * velocity
```

These values behave exactly as expected.

---

## Fluxions

A Fluxion represents uncertainty directly.

```***tars***
temperature: 30 ~ 5
```

This represents a value centered around 30 with a tolerance of 5.

The uncertainty is preserved and propagated throughout computation.

```***tars***
mass: 100 ~ 2
velocity: 50 ~ 1

momentum: mass * velocity
```

Because the inputs contain uncertainty, the result does too.

Fluxions allow uncertainty to remain part of the computation rather than being discarded at the start.

---

## Collapse

Eventually uncertainty must become an observation.

```***tars***
temperature: 30 ~ 5

sample: <temperature>
```

The collapse operator resolves a Fluxion into a concrete value.

This is one of the central ideas behind ***tars***.

Uncertainty exists.

Collapse turns possibility into observation.

---

# Language Overview

## Variables

Assignment uses `:`.

```***tars***
name: "Satwik"
age: 18
```

This keeps assignment distinct from equality.

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

---

# Probability & Stochastic Computation

***tars*** treats uncertainty as a native computational concept.

## Uniform Fluxions

```***tars***
temperature: 30 ~ 5
```

Represents values between 25 and 35.

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

---

## Random Sampling

```***tars***
noise: <>
```

Generates a value between 0 and 1.

---

## Weighted Distributions

```***tars***
choice: <0.1:"A", 0.4:"B", 0.5:"C">
```

Produces weighted probabilistic outcomes.

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

---

## Supported Data Types

* Text
* Images
* Audio
* Video
* Time Series
* Graphs
* Multimodal Data

---

## Supported Architectures

### Text

* Transformer
* GPT
* BERT
* T5
* RNN
* LSTM
* GRU

### Vision

* CNN
* Vision Transformer
* GAN
* Diffusion Models

### Audio

* Transformer
* Wav2Vec
* RNN

### Graphs

* GCN
* GAT
* GraphSAGE

### Multimodal

* CLIP
* AudioCLIP
* Perceiver IO

---

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

---

# Implementation

Compiler: JavaScript

Runtime Target: Python

Execution Model:

* Compiled
* Interpreted
* Hybrid execution

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

---

# Vision

***tars*** is an attempt to rethink what a programming language becomes when uncertainty, time, intelligence, mathematics, and software are treated as parts of the same system rather than separate domains.

The long-term objective is not merely to create another language.

It is to create a computational environment capable of expressing everything from equations and simulations to agents, models, applications, and entirely new forms of computation through a single coherent framework.

---

> ***tars*** is a language for building systems that evolve, predict, learn, simulate, and reason.
