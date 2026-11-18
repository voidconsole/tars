import punish from './punisher.js'
import { state } from './registrar.js'

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
	constructor(a, i = 0, j = 0, k = 0){ // in parser order should not matter
		this.a = a
		this.i = i
		this.j = j
		this.k = k
	}
	display(){
		let result = ''
		if (this.a !== 0){
			result += this.a
		}
		if (this.i !== 0){
			const abs = Math.abs(this.i)
			const term = abs === 1 ? 'i' : abs + 'i'; // memory allocation is minimal; don't optimize
			if (result.length > 0){
				result += (this.i < 0 ? ' - ' : ' + ') + term
			} else {
				result += (this.i < 0 ? '-' : '') + term
			}
		}
		if (this.j !== 0){
			const abs = Math.abs(this.j)
			const term = abs === 1 ? 'j' : abs + 'j';
			if (result.length > 0){
				result += (this.j < 0 ? ' - ' : ' + ') + term
			} else {
				result += (this.j < 0 ? '-' : '') + term
			}
		}
		if (this.k !== 0){
			const abs = Math.abs(this.k)
			const term = abs === 1 ? 'k' : abs + 'k';
			if (result.length > 0){
				result += (this.k < 0 ? ' - ' : ' + ') + term
			} else {
				result += (this.k < 0 ? '-' : '') + term
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
		const magSq = this.magnitude() ** 2
		if (magSq === 0){
			punish("Cannot divide by a zero number", "runtime", state.line, this.display())
		}
		return new Quaternion(
			this.a / magSq,
			-this.i / magSq,
			-this.j / magSq,
			-this.k / magSq
		)
	}
	// add(Q){
	// 	return new Quaternion(this.a + Q.a, this.i + Q.i, this.j + Q.j, this.k + Q.k)
	// } // reconsider if binary operations should be methods of quaternions or external functions. 
}

class fluxon { // TODO: go over whether quaternions should be stochastic 
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




// TODO: allow lattice elements to be quaternions
class Lattice { // access by ROW, then columns
	constructor(source, type = Number){
		this.rows = source.length
		this.columns = source[0].length
		this.square = this.rows === this.columns
		this.type = type
		this.data = source.flat() // for numeric maybe have a typed array? 
	}

	display(){
		let result = '| '
		for (let i = 0; i < this.rows; i++){
			for (let j = 0; j < this.columns; j++)
				result += this.get(i, j) + ', '
			result += ';\n  '
		}
		return result + '|'
	}
	get(m, n){
		if (m >= this.rows || n >= this.columns) punish(`Requested index out of lattice bounds\n Cannot access [${m}, ${n}] from a lattice of size ${this.rows}x${this.columns}`, "runtime", state.line, this.display())
		return this.data[m * this.columns + n]
	}

	set(m, n, value){
		if (m >= this.rows || n >= this.columns) punish(`Requested index out of lattice bounds\n Cannot access [${m}, ${n}] from a lattice of size ${this.rows}x${this.columns}`, "runtime", state.line, this.display()) // TODO: CANNOT USE DISPLAY, need source file.
		this.data[m * this.columns + n] = value
		if (this.type === Number && typeof value != "number") this.type = "mixed" // thus matrices can only contain real numbers, TODO: extend to quaternions later. 
	}
	trace(){
		if (this.type !== Number) punish("The lattice must be purely numerical to compute the trace", "type", state.line, this.display())
		if (!this.square) punish("The lattice must be square to compute the trace", "type", state.line, this.display())

		let sum = 0
		for (let i = 0; i < this.rows; i++)
			sum += this.get(i, i)
		return sum
	}

	det(){
		if (this.type !== Number) punish("The lattice must be purely numerical to compute the determinant", "type", state.line, this.display())
		if (!this.square) punish("The lattice must be square to compute the determinant", "type", state.line, this.display())

		let A = this.data.slice() //non destructive copy
		let n = this.rows, det = 1

		for (let i = 0; i < n; i++){
			let p = i

			for (let j = i + 1; j < n; j++)
				if (Math.abs(A[j * n + i]) > Math.abs(A[p * n + i]))
					p = j

			if (Math.abs(A[p * n + i]) < 1e-12) return 0

			if (p !== i){
				for (let j = 0; j < n; j++)
					[A[i * n + j], A[p * n + j]] = [A[p * n + j], A[i * n + j]]
				det *= -1
			}

			let pivot = A[i * n + i]
			det *= pivot

			for (let j = i + 1; j < n; j++){
				let factor = A[j * n + i] / pivot
				for (let k = i + 1; k < n; k++)
					A[j * n + k] -= factor * A[i * n + k]
			}
		}

		return det
	}

	

	rank(){
		if (this.type !== Number) punish("The lattice must be purely numerical to have a rank", "type", state.line, this.display())

		let R = this.rref()
		let rank = 0

		for (let i = 0; i < R.rows; i++)
			if (R.data.slice(i * R.columns, (i + 1) * R.columns)
				.some(x => Math.abs(x) > 1e-12))
				rank++

		return rank
	}

	inverse(){

		if (this.type !== Number) punish("The lattice must be purely numerical to have an inverse", "type", state.line, this.display())
		if (!this.square) punish("The lattice must be square to have an inverse", "type", state.line, this.display())

		let n = this.rows
		let A = Array.from({ length: n }, (_, i) => [
			...this.data.slice(i * n, (i + 1) * n),
			...Array.from({ length: n }, (_, j) => i === j ? 1 : 0)
		])

		for (let i = 0; i < n; i++){
			let p = i

			for (let j = i + 1; j < n; j++)
				if (Math.abs(A[j][i]) > Math.abs(A[p][i]))
					p = j

			if (Math.abs(A[p][i]) < 1e-12)
				punish("Lattice is singular and cannot be inverted", "type", state.line, this.display())

				[A[i], A[p]] = [A[p], A[i]]

			let divisor = A[i][i]
			for (let j = 0; j < 2 * n; j++)
				A[i][j] /= divisor

			for (let j = 0; j < n; j++){
				if (j === i) continue

				let factor = A[j][i]
				for (let k = 0; k < 2 * n; k++)
					A[j][k] -= factor * A[i][k]
			}
		}

		return new Lattice(A.map(row => row.slice(n)), Number)
	}




	adjoint(){  // unsure if this belongs in paradigm or processor
		if (this.type !== Number)
			punish("The lattice must be purely numerical to compute the adjoint", "type", state.line, this.display())
		if (!this.square)
			punish("The lattice must be square to compute the adjoint", "type", state.line, this.display())

		const n = this.rows
		if (n === 1){
			return new Lattice([[1]], Number)
		}

		const minorDet = (skipRow, skipCol) => {
			const sub = []
			for (let r = 0; r < n; r++){
				if (r === skipRow) continue
				for (let c = 0; c < n; c++){
					if (c === skipCol) continue
					sub.push(this.get(r, c))
				}
			}
			const subLattice = new Lattice(
				Array.from({ length: n - 1 }, (_, r) =>
					sub.slice(r * (n - 1), (r + 1) * (n - 1))
				),
				Number
			)
			return subLattice.det()
		}

		//   transpose of the cofactor matrix: adj[j][i] = cofactor(i, j)
		const adj = Array.from({ length: n }, () => Array(n).fill(0))
		for (let i = 0; i < n; i++){
			for (let j = 0; j < n; j++){
				const sign = (i + j) % 2 === 0 ? 1 : -1
				const cofactor = sign * minorDet(i, j)
				adj[j][i] = cofactor === 0 ? 0 : cofactor // avoid -0
			}
		}

		return new Lattice(adj, Number)
	}
	// hermitian(){} //once quaternions are supported
}


class Void { // akin to null or undefined, merged into one, much like None
	constructor(){
		this.value = null
	}
	display(){
		return 'void' // consider operations with other objects, like string or number
	}
}