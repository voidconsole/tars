# building data types and frameworks
nov 4, 2026
i modified invigilator to check for identifier. 
also, there was an edge case i had missed in the dispatcher, which are compound values, essentially assignment modifiers; so i handled that. 
for the errors i noticed the message boxes weren't behaving properly for very narrow terminals, so tried something that adapts to it, using the terminal width property of deno/node. probably overkill and i didn't check for bugs so i've kept it in legacy.

then to begin functions, i thought of making a unified system, but then i though i should separate the nouns from the verbs. so created paradigm.js, where stores all the data types, and initially i thought the operations will come here but then i thought it was better to have a dictionary which defines all the datatypes, and then another (processor.js) which has the engines and methods that handle the datatypes. 
in it firstly i created quaternion object and added a display object which returns a string in a+bi+cj+dk form but also adapts when signs are negative, when the values are 1, or when 0. so it can return "5 - j" for Quaternion(5,0,1,0), and follows the order ijk, irrespective of how it was defined. then in the processor i added the Ring object, which i thought was a appropriate name for handling binary operations for numbers (quaternions), and thus added sum product and difference methods. I wanted these to be universally usable, so that if only A is defined it works as a normal real number, and if a is 0 and the three imaginary parts are defined then it acts like a vector; the multiply()'s answer's real part would be the vector's dot product (in negative), while the imaginary part would be the vectors' cross product. i also added a quaternion dot which returns the sum of pair wise products. for other methods like magnitude or inverses i attached these to the paradigm in Quat classs because these are properties of the object than a binary operation. likewise, real, imaginary, conjugate. the thing that troubles me is that it creates new instances of Quats for every thing, which triggers garbage collection slowing this dowm. im considering to internally also have real type which will help performance though is less elegant, because full quaternions are redundant in general use cases. but externally, do NOT expose many numerical types, only a single unified quaternion, and thus must handle all conversions and handling internally.

then for the fluxon, which i changed from fluxion btw, cause it was more awkward to say, and had newton's derivative weight attached to it, though it suggested continuously changing, it sounded like a process than an object. so a fluxon, accurate to a quantized object, holds a stochastic value. i went with purely real for now, and later on i will consider if fluxons can be stochastic quaternions. to it i added two methods, collapse and decohere, where collapse would return a single number following its distribution, and decohere would permanently destroy the stochasticity, making the tolerance zero, though i cannot yet see where this docoherence will be useful in general cases, it'll definitely help me when im simulating electron interference.
the rng used is given by the stoche parameter, short for stochastic engine, with the seed. these are defined in /stochastic, a few default ones (perlin, uniform, gaussian, chaotic, more), but allows custom generators as well. and if seed is not given it is taken to be random. 
with a seed it allows reproducibility of stochastic results.

then i got drawn to lattices because there was simply so much to make in it. the main thing was storage. for numerical types i can highly optimize it with a flattyped array of size n*m instead of n arrays with m elements in each. but i cannot do this with strings or nested ones. i am considering a internal split architecture, for numerical and for more dynamic lattices, for most useful usecase for a lattice is a numerical matrix, then would be datasets/ tables.

ironically my apparently useless csv to html table parser i made 3 years ago is gonna come handy as i can just copy paste it here and modify it to an Lattice instance and the feature of importing csv files as Lattices is done. 

the thing with lattices is i want them to be extremely handy.  multiplying by 5 or adding 5 should do a fast elementwise sum, just as easy as adding and multiplying matrices. speaking of which i added a class in processor for the same, and i landed on errors. im not sure what errors i should return for nonconformability. its a runtime error sure, but i was wondering if i should make a new error system for this type of errors, and also for stochastic ones.

i was also struck by an amusing idea to build a lattice builder, which takes in the rows and columns and a builder function (whose parameters take the row and column number and returns an output) which generates the lattice with corresponding values. then i realized i can just store the builder function in the lattice instead and generate them on the fly as the thing is being called. this will let the user create arrays of extreme sizes, like 10000x10000 grids without barely affecting memory for all values are generated when accessed. but i found i had to be very careful with this because if a value is set to a cell later on, it has to be that and not generated by the function. and also, if the function is stochastic, then making sure the all values are in the same step of generation else the rng will proceed to different steps and reproducibility will be destroyed. so until i address these problems i will stick to populating the grid on creations. 
this came when I went on a rabbit hole in machine learning algorithms when i saw functions which initialize weights with xavier distributions. with the current features this would be fairly easy to do in tars, with a uniform or guassion function as builder. the rest of the stuff would just be calculus, which is something ive scheduled for later.
for the row,column order i went with Row major because it follows math conventions; but it goes against cartersian notation and also standard spreadsheet notion. the cartesian notation also seemed like a no because even if the x is mapped, i would have to pick the 4th quadrant as regular notation which i couldnt justify so i went with standard matrix notation. 
i also thought if i could allow not only `[n,m]` but  `[B3]` like a spreadsheet (so that importing data from datasets will be handy) but i might ditch that idea if it turned out redundant and more complexity to add. 

then i had the most insane thought id call the Null types "void" HAHHAHAHHAHAAHA; they're just perfect. 

---

## state machine
Nov 1, 2026

so instead of passing variables across the files, i thought of using a state machine that can hold the current line number, and scope. it then struck me i can move the variables and function bindings to this file instead of the handler. thus in this registrar, i initially used nested objects for scopes and each object having its own Map to store the bindings in that scope. but then i realized that was terribly slow and i was surprised to find out a class definition works much better and thus i made a structure which takes a parent and binds the child scope to its parent, and thus each new instance is a child scope. aptly i named this structure phase (space) and added the methods to read and write. i also decided to have a single map for both variables and functions. the phase class looks for a element and climbs up its parents to find, and this is quite effeicient due to classes and no memory reallocations as in with a object. the global scope would be the root phase.
i also needed a way to store the lines, and clearly objects were too slow. i thought of using premade classes, which although fast, i thought i could use an array, though its unconvientient accessing items by index. i almost went with a class called state but then i realized the only things im storing there are line number, column number and current phase. for storing phases the convenient way would be to use objects and creating new items for each, when i realized i didnt actually have to name the phase instances, i could just push the instances into an array, and the array index would be the phase space's name (aptly phasor). thus now the phasor is also an integer, and the state machine can simply be a fixed length integer array, hyperoptimizing state access, read and writes. and then i had another shocking find, unlike i previously thoughy, fixed integer typed arrays are actually slower for small fixed size elements because the js compiler has to contain them in a warpper and send them lower level, as compared to a dynamic array. and then stupidly, just storing the values themselves in bare variables is even faster. which apparantly is also the most trivial way i could have made a state machine. _sighs_
anddd well, is that wasn't enough, i could say, as i found out, in my defence that when you realize the state machine is going to be exported and read, single variables does horribly cause you need to import and export 3 varibales, and i think this was the reason i picked containers albeit lost track of it. either way, arrays would be faster, but objects would have better nomenclature and the loss wasnt significant, about 1.1-1.5x slower, so i went with that. 
i also created helper functions to fetch current phase, register new phases and get a particular phase, instead of exporting the entire `space` at once, on each import.
i also thought to store the phasor on the phase itself, incase i had to jump between phases, having access to current phase will let me skip to parent's phase instead of trying to find the child. this will help in nesting and backtracking.





---

## designing the punisher
Oct 31, 2026
tars log: error handling
played with ansi, colors, formatting usability, and the tone of error messages.
goal was to make an error message that was easy to understand, not too robotic and nor too gimmicky. i used border boxes, and though they are ulgy when copied, the error messages are copyable, and i chose that cluuter of copying trading for clarity and design. i spent a lot of time for the coloring and formatting of the border lines, text, deep into color psychology and the contrasts between the terminal and text. i ended up making custom ansi codes to get the exact colors i want. i didnt know you could do that with ansi escape codes initially. 
another thing was to add help messages at the end in green, which gives suggestions to solveable problems, but i decided to run with that later once the core features were made. 
i also found the thing broke for multiline code and messages, so i added the code to handle that, along with support for mentioning exact line and underline start position and length, for the problematic token. ![image.png](https://cdn.jsdelivr.net/gh/voidconsole/assets/2026/10/26/163-1793017382503-7q1bwh.png)

![2a7d3dd8-5c22-422a-8ea0-38ee648d163c.jpg](https://cdn.jsdelivr.net/gh/voidconsole/assets/2026/10/26/163-1793017362976-x2rt9t.jpg)

![ed8b038f-e1b5-445e-9c0e-9dda06df10a8.jpg](https://cdn.jsdelivr.net/gh/voidconsole/assets/2026/10/26/163-1793017364734-4u47o5.jpg)

![4e3beffd-ed35-4aba-b721-845179c354b6.jpg](https://cdn.jsdelivr.net/gh/voidconsole/assets/2026/10/26/163-1793017366431-v5lfu0.jpg)

![b01b40b1-31e0-44a2-a773-83e018138bb2.jpg](https://cdn.jsdelivr.net/gh/voidconsole/assets/2026/10/26/163-1793017368418-a6asxt.jpg)

![831bf31c-2323-4f2d-84b9-aaaba620b0f3.jpg](https://cdn.jsdelivr.net/gh/voidconsole/assets/2026/10/26/163-1793017370352-fikxnd.jpg)

![7a5499ff-a086-4818-ac41-d24c504a05a9.jpg](https://cdn.jsdelivr.net/gh/voidconsole/assets/2026/10/26/163-1793017372071-qxy8vf.jpg)

![863677d3-d048-461f-a986-1d12e9eae4e3.jpg](https://cdn.jsdelivr.net/gh/voidconsole/assets/2026/10/26/163-1793017374185-1jr92t.jpg)

![9c165d7a-f709-452b-af09-afe2df1bf425.jpg](https://cdn.jsdelivr.net/gh/voidconsole/assets/2026/10/26/163-1793017375859-ttkfoe.jpg)

![6ad2ff14-8144-48ed-897f-e4e70e310046.jpg](https://cdn.jsdelivr.net/gh/voidconsole/assets/2026/10/26/163-1793017377567-okwul6.jpg)

![378edb4f-6829-4c93-b9c6-8fc1f9517e71.jpg](https://cdn.jsdelivr.net/gh/voidconsole/assets/2026/10/26/163-1793017379209-x4tude.jpg)

![f31c9339-1992-485c-b9bc-0ad207cf7936.jpg](https://cdn.jsdelivr.net/gh/voidconsole/assets/2026/10/26/163-1793017380903-0hr58z.jpg)

---
_Mon, Oct 26, 05:52 PM_

## way to handle infinite decimals
oct 23, 2026
adding to my older idea of storing values as fractions, 
we can use 1.3... as a notation for it to be identical to 4/3. 
let a number be p.q...r...
to compute them, the repeating part r is taken and if it has k digits, and q has n digits then the fraction is p +  {qr-q}/{(10^k - 1)*(10^n)}
and this notation can laso be used for p adic numbers
...r...q_p where p is the base. 

## architecture diagrams
aug 30, 2026
i spent a while drawing the architecture diagram of the language for it was getting too complicated to keep it all in my head.

so i made the architecture diagram for the entire language.
![image](https://cdn.hackclub.com/01a053df-87d3-7ab5-bbd1-a8b068693573/image.png)
and then for each of dispatcher, parser, and handler.



## modelled vectors using quaternions and nested matrices
aug 25, 2026
from experience from my fluid engine project (voidconsole/fluid-sim) i realized support for vectors are much needed, cause in it I had built a vector library just for things to work. in tars i could certainly use lattices, but then again it needs to be extremely easy to use. thus, if i can model quaternion operations to behave like vectr operations without losing higher dimensionality, that would allow me to solve this problem.

also for the problem of representing nested lattices, i think i found a way.

so A : ||a1, b1; c1, d1|, |a2, b2; c2, d2|; |a3, b3; c3, d3|, |a4, b4; c4, d4|| is equivalent to
https://cdn.hackclub.com/01a053d4-d16b-7506-857c-74c724998e01/image.png

or equivalently A : | X, Y; Z, W| where X,Y,Z,W are the corresponding lattices defined in the same scope

---
## patched bugs and missing edge cases in dispatcher in the latest commit
jul1, 2026	
i reorganized the files into proper files, cleaned the whole mess. next, i realized there were a lot of logical inconsistencies in my parser and my dispatcher. i fixed the inconsistencies by eliminating edge cases, and restructuring the entire logical tree. Also, added a lot more errors, with more specificity.
![image](https://cdn.hackclub.com/019f18ec-aa7e-7597-aef6-1a24333eb6ce/image.png)
the hardest part of making a dispatcher/lexer for a language is not falling into biases, especially survivorship biases.

you’d have a certain case in mind, and you code around it, but that would often miss something that does not follow the cases in your head.

thus im following a very strict rule: every IF statement must have an ELSE. to handle all possible conditions.

its sort of counter-intuitive, but not throwing errors when there are active errors is terribly bad. unlike in programming, one strives for minimizing errors, designing one requires you to shift the mindset to being extremely strict and throw as many errors as needed.

besides that, this is one of the few times i actually have to comment a lot voluntarily, and draw graphs and flowcharts do i do not miss any datapoints.

this art really requires a different nerve.

even minute things like order of checking condition matter because if youre checking for a case at the top that is less likely then you’re wasting compute.
![image](https://cdn.hackclub.com/019f18ed-5a2f-7a16-8300-ac5c788d3aef/image.png)

i'm comparing characters instead of strings, because its blazingly fast compared to regex or string matching functions. It gives enough heuristics to eliminate most of the irrelevant code, and fast. only on the last layer, we run a full regex scan to make sure it is syntactically accurate.

---
## deriving the logics of timekeeping
jun 30, 2026
time is a very important aspect but it is highly underworked in the current programming languages. For tars, the temporal engine must have a universal tick tock, and pay utmost importance to causality. Time can stretch and squeeze for each time instance or timeline, but must not conflict. An example usecase would be rendering a point whose coordinates are the magnitude of the time instance's tick. Time also needs a collapse operator, perhaps called a timekeeper, for it is dynamic and automation updates time instances all around the code asynchronously, and if collapsed it returns the time ticks at the time of collapse.

The most important, the tick must be independent of the program code running.

Several timelines can exist as "branches".

[I know this sounds a lot like Quantumania and Loki mixed with relativity, but its logical and it works]

to put it down more rigorously, a timekeeper can be instantiated with a certain frequency, in Hertz. If i create #reset(30Hz) it creates a clock that is triggered thirty times a second. 1/10 Hz thus makes a clock that is run every 10 seconds. here, the measurements are made relative to the main timeline, which is a clock ticking every second, passing through time at 1 second per second. so a parallel timekeeper running at 2Hz is a timeline equivalent to the main timeline that is sped up twice.

---
## implementing config files
may 26, 2026
I spent a few hours sketching, whiteboarding and trying to find out the optimal tars.config file. I went down a rabbit hole (again, though a short one this time), analysing what would be the most effective configuration file and what settings tars should allow to be configured. I also went over I how I could implement it.

For TL;DR of my exploration, tars.config would have
- ability select the language being interpreted or compiled (to python and C)
- ability to configure toolsets (or crates like rust, i'll settle the nomenclature later), like mathica (for advanced native math solvers), intelligence (for creating machine learning models natively), graphica (for a native rendering engine)
- ability to select the randomness engine (cursed, xoroshiro, hashlance, etc)
- ability to preserve comments in the compiled code (yes, im insane)
well thats it FOR NOW.

---

## cleaned dispatcher
may 25,2026
there were a few bugs in the dispatcher, like the split splitting at every equals sign, and the bracket matcher was not analyzing for well-ordering. Patched both the issues, and also optimized the well-ordering algorithm to run in the same frequency map, making it supafast.

besides that, I cleaned the dispatcher code, and now it looks beautiful (and gladly, still works fine.)	

---
## a hash function that finally works
may 24, 2026
After learning a lot about hashing algorithms, elliptic curves, state spaces, I was finally about to fix the hell I created a few days ago. It is still as radioactive, but it now works. I also benchmarked it, and it turns out to work so surprisingly well. ChatGPT, the one who roasted it so bad, now had to be humbled.
![tr](https://cdn.hackclub.com/019e5b3a-20e2-76f6-9129-f23ec17002e2/image.png)

the hash of `hello world` is 
![hello](https://cdn.hackclub.com/019e5b3a-d54d-7741-b1a0-c4c6b363722f/image.png)
or scattered bits to analyse scores:
![image](https://cdn.hackclub.com/019e5b3b-43cb-75a8-9b88-f413c7c4c4d1/image.png)
It is still the same chaotic hell as it was before though.
but i fixed it by proper bit mixing and now it can be used as a proper random algorithm without worrying about attarctors.

```// 1. Recursive hashing
// 2. Character extraction of an hash
function hash(seed) {
	seed = seed.toString()
	let out = ''
	let buffer = seed.codePointAt(0)
	for (let round = 1; round < 5; round++) {
		buffer += seed.codePointAt(round % seed.length)
		for (let i = 1; i <= 128; i++) {
			let previousBuffer = buffer
			buffer ^= buffer >>> 13
			buffer = Math.imul(previousBuffer, buffer ^ previousBuffer)
				^ (buffer << 17 | buffer >>> 15)
			buffer = (buffer ^ (buffer * seed.codePointAt((i - 1) % seed.length))) >>> 0
		}
		buffer ^= buffer >>> 13
		buffer = Math.imul(buffer, 0xc2b2ae35)
		buffer ^= buffer >>> 16
		out += buffer.toString(16).padStart(8, '0')
	}
	return out
}

function obfuscate(seed) {
	let base = hash(seed)
	// console.log("BASE: ", base)
	let buffer = seed.toString().codePointAt(0)
	let suffer = ""
	for (let i = 1; i <= base.length; i++) {
		let previousBuffer = buffer + base.codePointAt((i - 1) % base.length)
		// console.log("STEP1: ", buffer) 
		buffer =
			parseInt(
				buffer
					.toString(16)
					.padStart(8, '0')
					.split('')
					.reverse()
					.join(''),
				16
			) >>> 0		// buffer = base.codePointAt(i - 1) << 13
		// console.log("STEP2: ", buffer)
		const irrational =
			(Math.PI * (buffer ^ previousBuffer) * (i + Math.E))
				.toString()
				.replace('.', '')
		buffer ^= buffer >>> (base.codePointAt(base.length - i) % 5 + 1)		// console.log("STEP3: ", buffer)
		buffer = (parseInt(irrational, seed.toString().codePointAt(i - 1) % 32 + 4)).toString()
		buffer = hash(parseInt(buffer + `${Math.sqrt(i + 2 * Math.E)}`, 36))


		buffer ^= previousBuffer >> 17
		buffer ^= Math.imul(
			base.codePointAt(i - 1),
			buffer ^ previousBuffer
		)
		buffer = ((buffer << 15) | (buffer >>> 17)) ^ base.codePointAt(i - 1)		// console.log("STEP8: ", buffer)
		buffer ^= (
			base.codePointAt(i - 1) *
			base.codePointAt(base.length - i)
		) >>> 0
		// console.log("STEP7: ", (buffer >>> 0).toString(2).padStart(32, '0'))
		const h = hash(hash(buffer.toString()) + buffer.toString())
		buffer ^= parseInt(h.slice(0, 8), 16) >>> 0
		// console.log("STEP8: ", buffer)
		suffer += (buffer >>> 0)
			.toString(2)
			.padStart(32, '0')
	}

	// console.log("SUFFER: ", suffer)
	return suffer
}
let index = 0
function* oblivion() {
	while (true) {
		yield obfuscate(index++)
	}
}


let percentArray = []
const generator = oblivion()
for (let i = 0; i < 10000; i++) {
	const { zeroCount, oneCount } = onePercent(generator.next().value)
	percentArray.push(zeroCount / (zeroCount + oneCount) * 100)
}

function onePercent(text) {
	let zeroCount = 0
	let oneCount = 0
	for (let i = 0; i < text.length; i++) {
		const char = text[i]
		if (char === '0') {
			zeroCount++
		} else if (char === '1') {
			oneCount++
		}
	}
	return { zeroCount, oneCount }
}

[[ STATISTICS STUFF WAS OMITTED FOR BREVITY]]
[[ FOR BREVITY IS THE SOUL OF WIT ]]
console.log("Median: ", median(percentArray))
console.log("Mean: ", mean(percentArray))
console.log("Mode: ", mode(percentArray))
// console.log("Deviation from 50%: ", percentArray.map(p => Math.abs(p - 50)))
console.log("Mean deviation from 50%: ", mean(percentArray.map(p => Math.abs(p - 50))))
console.log("Lowest: ", Math.min(...percentArray))
console.log("Highest: ", Math.max(...percentArray))
console.log("Range: ", Math.max(...percentArray) - Math.min(...percentArray)) ```

---
## exlored usecases and examples
may 21
	I sketched out a few scenarios and tried to use Tars' features to handle them. I explored

how to model gaussian distributions, perlin noises,
how to handle nested fluxions
how I could create a gaussian truth
how to handle stochastic gates
lattice addition without making it messy
Schrodinger's cat but in Tars
collapse operator in loops
scaffolding for domains of AI, or math
declaring local and global constants
configuring engines for randomness, chaos, math, rendering, and AI in tars.config
time branching upon each time
hoisting of time-seeking expressions to always listen to timers
setting of seed parameters and how to implement them in real use
stretching and squeezing of time branches and follow temporal physics

![img](https://cdn.hackclub.com/019e4bcb-e0c1-739e-b35d-1c199fa8d1d1/WhatsApp%20Image%202026-05-21%20at%2011.53.21%20PM%20(1).jpeg)
![img2](https://cdn.hackclub.com/019e4bcb-f652-7390-b2cc-190d47306ce3/WhatsApp%20Image%202026-05-21%20at%2011.53.21%20PM.jpeg)
![img3](https://cdn.hackclub.com/019e4bcc-09c2-7fad-a299-733ee0e393a3/WhatsApp%20Image%202026-05-21%20at%2011.53.20%20PM%20(1).jpeg)
![img4](https://cdn.hackclub.com/019e4bcc-21c7-7b8d-8870-773b39bf2103/WhatsApp%20Image%202026-05-21%20at%2011.53.20%20PM.jpeg)


---
## trying to uncurse the cursed generator
may 19, 2026
Classic Javascript errors, the weirdest of the NaN popping up. I probably should not have made my generator THIS chaotic, but whatever. Either way, I spent too much time trying to fix the bugs, and I got it from generating NaNs infinitely to saying
```Î
Þß""¾ñ
*++Bâ```

which is the encoding for the word hello
I will return. And I will make this chaos usable.

---
## considering p-adic numbers
may 20, 2026
While I have regarded quaternions as a reasonable numeric data-type, I came across another numerical system, called k-adic numbers, where k is an integer and p stands for prime, and there's a really good video by veritasium [What happens if you keep squaring?], that goes over these.

Either way, due to their rising importance in pure math, and even being consequential in proving fermat's last theorem, I did consider implementing them in Tars.

I researched their algebraic properties, and pondered over potential syntactic and semantic implementations in Tars. However, I did not find enough reasonable use cases in general programming (yet) so I have moved this feature down the priority list.
https://en.wikipedia.org/wiki/P-adic_number

---
may 19, 2026
I had went to a park, and then kinda got inspired by the wind moving the grass to create a new kind of state mixing generator that has a general forward bias (like the wind), but is still inherently random. So I went back home and tried programming it, but apparently could not get the required behaviour. i returened in hopes of more ideas.

Also, I created a benchmark to evaluate my randomness engines, and for it created a mini-statistics engine to give me the metrics (mean, mode, median, standard deviation, mean of the deviation, median of the deviation, etc) of the generated distributions, iterated over a certain number of cycles.

In the following days, I will try to use this statistics engine in evaluating the hashing functions that I generate.

---
## created a few hashing generators
may 16, 2026
The goal is to have a seed, and using that seed the generator must produce a sequence of numbers that is pseudo-random, and the catch is that this random-like distribution should not have any patterns, not have any local attractors, dead zones, large cyclicity (which while is pretty hard in itself) and should be completely deterministic. What this means is that if the same seed is set initially, all 'random' numbers generated should be the same on each run, i.e., code results must be reproducible.

To start off, since in Tars a seed can be any string of any size, I normalized this into a constant size with a sha256 hash, which should be a good starting point.

And then... um... I was trying to make the most extreme generator that is extremely unpredictable, chaotic and diabolical at like  4ish am. 

"It looks like a cryptographic algorithm designed by someone trapped in a room with only caffeine, transcendental constants, and emotional damage.
...
This is not an algorithm.
This is what happens when a calculator falls down the stairs into a cryptography textbook during a lightning storm.

You didn’t write code.
You summoned a numerical poltergeist.

The variable names alone sound like the internal thoughts of someone debugging at 3:12 AM after three coffees and one existential crisis:... "
chatgpt's review.
Accurate, if I would say the least. Heres one of the algorithm's
https://cdn.hackclub.com/019e2f73-5737-710a-ad20-b433238aaf1d/WhatsApp%20Image%202026-05-16%20at%2011.51.30%20AM.jpeg
somehow it works.
but yeah i should name my variables properly.


---
## Accidentally started following a lost ancient school of philosophy
may 15, 2026
Cynicism, Stoicism..., enter Stochastism. I have fallen in this randomness rabbit hole too deep. I started with basic probability, went on to random generators, deterministic reasoning, tried to create my own randomness engine. Instead of stopping, I for some reason doubled down and went deeper in the rabbit hole, stright to group theory and chaos theory, and apparently ended up on MatLab T.T
![image](https://cdn.hackclub.com/019e2ce3-524d-712f-bd4c-5422ebb02eb5/image.png)(The lorentz attractor, what i was admiring in matlab, from chaos theory)

 I went on a 4 hour lecture on Quantum Mechanics? Wasn't probably necessary but, all that just for a single collapse operator. That said, quantum has really helped me in settling this uneasiness (ironically) for now the stochastic data types behave like electron wavefunctions that collapse when observed.
 https://cdn.hackclub.com/019e2ce4-4b1a-7cf6-b215-4f1d319ba593/image.png

---
## Worked on the math for logical reasoning
may 13,2026
Went down a rabbit hole chasing the logic and math behind probabilistic booleans, and other stochastic distributions. I also researched and explored how one could implement tensors and their math involved in Tars via lattices.
![image](https://cdn.hackclub.com/019e1d48-0dab-73b3-b36a-de573d5ff6b4/image.png)
![image](https://cdn.hackclub.com/019e1d4a-0573-74b4-9f3e-0e89bf47cd2e/image.png)

---
## Redefined syntax and semantics to accuracy
may 12, 2026
Spent far too much time overthinking about the syntax, but finally settled on the core values of the language, designed (on my whiteboard) how the stochastic and temporal features should behave, and explored edge cases and logical behaviour involving probabilistic values.

For example,
![alt text](https://cdn.hackclub.com/019e69be-c236-761c-b381-72b9ce0d0343/image.png)
This would implicitly be considered as a mathematical matrix.

And this would be considered as a table with a header:![alt text](https://cdn.hackclub.com/019e69c0-ae4d-7608-96d7-9cf3b7f12d0f/image.png)

One can create a timer using #, and introduce a seed parameter using @. A timer is a nodal point in the language's runtime, where it branches off to different timeline, which can be stretched or squeezed.![image](https://cdn.hackclub.com/019e69c4-ef76-7316-b66e-bd30f0e1dfbd/image.png)

A seed is a string which can be used to input the flux engines, and thus all stochastic values generated with the same seed will be the same. All flux engines are assigned a random seed on runtime.