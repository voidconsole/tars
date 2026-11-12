// verbs; frameworks for handling operations on different paradigms
class Ring{
	add(A, B){ 
		return new Quaternion(A.a + B.a, A.i + B.i, A.j + B.j, A.k + B.k)
	} 
	subtract(A, B) {
		return new Quaternion(A.a - B.a, A.i - B.i, A.j - B.j, A.k - B.k)
	}
	multiply(A, B) {
		return new Quaternion(
			A.a * B.a - A.i * B.i - A.j * B.j - A.k * B.k,
			A.a * B.i + A.i * B.a + A.j * B.k - A.k * B.j,
			A.a * B.j - A.i * B.k + A.j * B.a + A.k * B.i,
			A.a * B.k + A.i * B.j - A.j * B.i + A.k * B.a
		);
	}
	dot(A, B) {
		return A.a * B.a + A.i * B.i + A.j * B.j + A.k * B.k;
	}
	divide(A, B) {
		this.multiply(A, B.inverse());
	}
}


class lattice{
	build(rows, columns, builder){ // also consider lazy lattice, where it stores the builder function instead of creating large lists	
		let result = []
		for (let i = 0; i < rows; i++) {
			result[i] = [];
			for (let j = 0; j < columns; j++) {
				result[i][j] = builder(i, j);
			}
		}
		return new Lattice(result);
	}
	add(A, B){
		if (A.rows !== B.rows || A.columns !== B.columns) {
			punish("Lattices must have the same dimensions for addition", "");
		}
		let result = [];
		for (let i = 0; i < A.rows; i++) {
			result[i] = [];
			for (let j = 0; j < A.columns; j++) {
				result[i][j] = A.input[i][j].add(B.input[i][j]);
			}
		}
		return new Lattice(result);
	
	}
	subtract(A, B){
		if (A.rows !== B.rows || A.columns !== B.columns) {
			punish("Lattices must have the same dimensions for subtraction");
		}
		let result = [];
		for (let i = 0; i < A.rows; i++) {
			result[i] = [];
			for (let j = 0; j < A.columns; j++) {
				result[i][j] = A.input[i][j].subtract(B.input[i][j]);
			}
		}
		return new Lattice(result);
	}
	multiply(A, B){
		if (A.columns !== B.rows) {
			punish("Lattices must have compatible dimensions for multiplication");
		}
		let result = [];
		for (let i = 0; i < A.rows; i++) {
			result[i] = [];
			for (let j = 0; j < B.columns; j++) {
				let sum = new Quaternion(0, 0, 0, 0); // extremely sloww, please optimize
				for (let k = 0; k < A.columns; k++) {
					sum = sum.add(A.input[i][k].multiply(B.input[k][j]));
				}
				result[i][j] = sum;
			}
		}
		return new Lattice(result);
	}
}