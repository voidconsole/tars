Commit elboration worth noting.

- defined datatypes for quaternions, lattices, fluxons and voids in paradigm, and implemented a lattice builder
- defined operations of datatypes in processor
- implemented adaptive error display  	

---

- created a registrar to bookkeep variable and function bindings; and perform as a statemachine during runtime, keeping line numbers and current scopes (phasors) and optimized it
- scope management via phases and phasors in registrar
- designated ~~handler~~ orchestrator to manage and overlook all operations and commands for the processing stream, connecting parser, dispatcher, punisher and registrar
- optimized invigilator and resolvers

---

- designed the error messages and built punisher
- used punisher for errors in dispacther and parser
- handled a few edge cases mentioned in dispatcher
- added journal from dimensionless notebook

---
- major developments in dispatcher
- added syntax for temporal and flux types
- added partial error handling, created punisher and invigilator
- developments in handler and supported variable writing
- changed syntax for assignment
- worked on input handling
- added support for string escapements
- cleaned parser code
- explored a few optimization tricks
- checked for well-bracketed-ness by default
---
