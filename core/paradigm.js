// nouns
class String {
	constructor(string){
		this.string = string
	}
	display(){
		return this.string
	}
}

class Quaternion { // a quaternion OBJECT; NOT a quaternion handler.
	constructor(a, i=0, j=0, k=0){ // in parser order should not matter
		this.a = a;
		this.i = i
		this.j = j
		this.k = k
	}
	display() {
		let result = '';
		if (this.a !== 0) {
			result += this.a;
		}
		if (this.i !== 0) {
			const abs = Math.abs(this.i);
			const term = abs === 1 ? 'i' : abs + 'i'; // memory allocation is minimal; don't optimize
			if (result.length > 0) {
				result += (this.i < 0 ? ' - ' : ' + ') + term;
			} else {
				result += (this.i < 0 ? '-' : '') + term;
			}
		}
		if (this.j !== 0) {
			const abs = Math.abs(this.j);
			const term = abs === 1 ? 'j' : abs + 'j'; 
			if (result.length > 0) {
				result += (this.j < 0 ? ' - ' : ' + ') + term;
			} else {
				result += (this.j < 0 ? '-' : '') + term;
			}
		}
		if (this.k !== 0) {
			const abs = Math.abs(this.k);
			const term = abs === 1 ? 'k' : abs + 'k'; 
			if (result.length > 0) {
				result += (this.k < 0 ? ' - ' : ' + ') + term;
			} else {
				result += (this.k < 0 ? '-' : '') + term;
			}
		}

		return result || '0'; // NOTE: it returns in the order ijk, irrespective of how it was defined. 
	
	}
	magnitude(){
		return Math.hypot(this.a, this.i, this.j, this.k)
	}
	real(){
		return this.a
	}
	imaginary(){
		return new Quaternion(0, this.i, this.j, this.k)
	}
	conjugate(){
		return new Quaternion(this.a, -this.i, -this.j, -this.k)
	}
	inverse(){
		const magSq = this.magnitude() ** 2;
		if (magSq === 0) {
			punish("Cannot divide by a zero number");
		}
		return new Quaternion(
			this.a / magSq,
			-this.i / magSq,
			-this.j / magSq,
			-this.k / magSq
		);
	}
	// add(Q){
	// 	return new Quaternion(this.a + Q.a, this.i + Q.i, this.j + Q.j, this.k + Q.k)
	// } // reconsider if binary operations should be methods of quaternions or external functions. 
}

class fluxon{ // TODO: go over whether quaternions should be stochastic 
	constructor(value, tolerance, stoche = null, seed = null){
		this.value = value
		this.tolerance = tolerance
		this.stoche = stoche
		this.seed = seed ? seed : Math.random()
	}
	collapse(){ 
		return this.value + this.stoche(this.tolerance, this.seed)
	}
	decohere(){ // destroy stochasticity and lose superposition
		this.value += this.stoche(this.tolerance, this.seed)
		this.tolerance = 0
	}
}	






class Lattice { // access by ROW, then columns
	constructor(source){ 
		// TODO: instead of a 2d array, store in a single 1d array with mapped elements. [For numeric perhaps? maybe create a new class called numeric lattice? ]
		this.input = source
		this.rows = source.length
		this.columns = source[0].length
	}
	display(){
		let result = '| '
		for (let i = 0; i < this.rows; i++){
			for (let j = 0; j < this.columns; j++){
				result += this.input[i][j].display() + ', '
			}
			result += ';\n  '
		}
		result += '|'
		return result
	}
}


class Void { // akin to null or undefined, merged into one, much like None
	constructor() {
		this.value = null
	}
	display() {
		return 'void' // consider operations with other objects, like string or number
	}
}