this project can be tested by tweaking parts of the code, and there a lot of things to test.
it is under heavy development, and the optimal way to test this (and have fun while doing so) is by probing parts of the code while watching the output.
please read all developer journals, for they explain all the things created.
as for the commit frequency, I only commit per meaningful addition/change of the codespace, which may take 15 mins or a week, and that is something i maintain across my GitHub.

---
to begin, clone this repository, and install deno on your system. 

> irm https://deno.land/install.ps1 | iex

for windows powershell
> curl -fsSL https://deno.land/install.sh | sh

for macOs/linux

then, in the project repository, simply run, 
> deno run dev

---

you will immediately see parsed content from input.star file.
the first lines are the ones that are being parsed, and a prompt pops up asking you to enter text. if you see input.star and match the lines, you can see that this is as example for user input. when entered, the whole parsing will complete, then dispatching and then the object handler returns an object of all the variables created and stored.

you may change any lines from input.star to see how the parser handles it, be it a variable storage or comments or syntax highlighting, or even deliberately entering wrong code.
Oh for syntax highlighting, please visit https://github.com/voidconsole/tarsx for the extension code. 
For usage download the .visc file from the drive folder, and upload it to vscode in extensions tab to allow syntax highlighting.
the syntax.md gives all the syntax for the language, with their usecases, including their reason for existance. 

i would also urge you to try uncommenting/commenting console.logs in core/
1. parser.js
2. dispatcher.js
3. handler.js
to understand how the input is being handled at each step.  
the code architecture for these files are there in the google drive and also briefly in the developer journal. 

in `main.js` uncomment the code in `.then() ` to allow benchmarking of code, to test the performance of parser as you increase/decrease code size, make changes to the files or the processor.

next, for checking out the stochastic generators, you may paste the code from main_test.js into main.js and run `deno run dev` and give read access.

here it would show the efficacy and parameters of the generator, which can be accessed in stochastic/randomAlgorithms and generators, which i have commented with information on how to assess the stats. you may tweak any numbers you find in the generator algorithm, and see how your particular number changes the stats. you can change the seed in the main.js file you just pasted into.

one may also check out tars.json as it would be one of the core interfaces for using the language by configuring the language parameters. 
the syntax.md gives all the syntax for the language, with their usecases, including their reason for existance. 

g'day! =]