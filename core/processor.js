// verbs; frameworks for handling operations on different paradigms
class Ring {
	add(A, B) {
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

class Module {
	build(rows, columns, builder) { // also consider lazy lattice, where it stores the builder function instead of creating large lists
		let result = []
		for (let i = 0; i < rows; i++) {
			result[i] = []
			for (let j = 0; j < columns; j++) {
				result[i][j] = builder(i, j)
			}
		}
		return new Lattice(result)
	}

	add(A, B) {
		if (A.type !== Number || B.type !== Number)
			return punish("Only numeric lattices can be added togeather", "type", state.line, A.display())

		if (A.rows !== B.rows || A.columns !== B.columns) {
			return punish("Lattices must have the same dimensions for addition", "runtime", state.line, A.display())
		}

		let result = []
		for (let i = 0; i < A.rows; i++) {
			let row = []
			for (let j = 0; j < A.columns; j++) {
				row.push(A.get(i, j) + B.get(i, j))
			}
			result.push(row)
		}
		return new Lattice(result, Number)
	}

	subtract(A, B) {
		if (A.type !== Number || B.type !== Number)
			return punish("Only numeric lattices can be subtracted", "type", state.line, A.display())

		if (A.rows !== B.rows || A.columns !== B.columns) {
			return punish("Lattices must have the same dimensions for subtraction", "runtime", state.line, A.display())
		}

		let result = []
		for (let i = 0; i < A.rows; i++) {
			let row = []
			for (let j = 0; j < A.columns; j++) {
				row.push(A.get(i, j) - B.get(i, j))
			}
			result.push(row)
		}
		return new Lattice(result, Number)
	}

	multiply(A, B) {
		if (A.type !== Number || B.type !== Number)
			return punish("Only numeric lattices can be multiplied", "type", state.line, A.display())

		if (A.columns !== B.rows) {
			return punish("Lattices must have compatible dimensions for multiplication\nNumber of olumns of the first lattice must\nequal number of rows of the second.", "type", state.line, A.display())
		}

		let result = []
		for (let i = 0; i < A.rows; i++) {
			let row = []
			for (let j = 0; j < B.columns; j++) {
				let sum = 0
				for (let k = 0; k < A.columns; k++) {
					sum += A.get(i, k) * B.get(k, j)
				}
				row.push(sum)
			}
			result.push(row)
		}
		return new Lattice(result, Number)
	}

	convolve(A, K, stride = 1) {
		if (A.type !== Number || K.type !== Number)
			return punish("Only numeric lattices can be convoluted", "type", state.line, A.display())

		if (!Number.isInteger(stride) || stride < 1)
			return punish("The stride must be a natural number", "type", state.line, A.display())

		let rows = Math.floor((A.rows - K.rows) / stride) + 1
		let cols = Math.floor((A.columns - K.columns) / stride) + 1

		if (rows <= 0 || cols <= 0)
			return punish("The kernel cannot exceed input dimensions", "runtime", state.line, A.display())

		let a = A.data, k = K.data
		let ac = A.columns, kc = K.columns
		let result = Array.from({ length: rows }, () => [])

		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < cols; j++) {
				let sum = 0
				let offset = i * stride * ac + j * stride

				for (let ki = 0; ki < K.rows; ki++) {
					let ai = offset + ki * ac
					let kiOffset = (K.rows - 1 - ki) * kc

					for (let kj = 0; kj < kc; kj++)
						sum += a[ai + kj] * k[kiOffset + kc - 1 - kj]
				}

				result[i][j] = sum
			}
		}

		return new Lattice(result, Number)
	}

	cut(M, startx, starty, endx, endy) { // expose slice() function on developerside
		if (startx > endx || starty > endy)
			return punish("Cannot slice a lattice with a start index greater than the end index", "runtime", state.line, M.display())

		const result = []
		for (let r = starty; r < endy; r++) {
			const row = []
			for (let c = startx; c < endx; c++) {
				row.push(M.get(r, c))
			}
			result.push(row)
		}
		return new Lattice(result, M.type)
	}

	transpose(M) {
		const result = Array.from({ length: M.columns }, (_, j) =>
			Array.from({ length: M.rows }, (_, i) => M.get(i, j))
		)
		return new Lattice(result, M.type)
	}

	reverseRows(M) {
		const result = []
		for (let i = M.rows - 1; i >= 0; i--) {
			const row = []
			for (let j = 0; j < M.columns; j++) {
				row.push(M.get(i, j))
			}
			result.push(row)
		}
		return new Lattice(result, M.type)
	}

	reverseColumns(M) {
		const result = []
		for (let i = 0; i < M.rows; i++) {
			const row = []
			for (let j = M.columns - 1; j >= 0; j--) {
				row.push(M.get(i, j))
			}
			result.push(row)
		}
		return new Lattice(result, M.type)
	}

	rref(M) {
		if (M.type !== Number)
			return punish("The lattice must be purely numerical to be reduced", "type", state.line, M.display())

		let A = M.data.slice()
		let m = M.rows, n = M.columns
		let pivot = 0

		for (let j = 0; j < n && pivot < m; j++) {
			let p = pivot

			for (let i = pivot + 1; i < m; i++)
				if (Math.abs(A[i * n + j]) > Math.abs(A[p * n + j]))
					p = i

			if (Math.abs(A[p * n + j]) < 1e-12) continue

			for (let k = 0; k < n; k++)
				[A[pivot * n + k], A[p * n + k]] =
					[A[p * n + k], A[pivot * n + k]]

			let divisor = A[pivot * n + j]

			for (let k = 0; k < n; k++)
				A[pivot * n + k] /= divisor

			for (let i = 0; i < m; i++) {
				if (i === pivot) continue

				let factor = A[i * n + j]
				for (let k = 0; k < n; k++)
					A[i * n + k] -= factor * A[pivot * n + k]
			}

			pivot++
		}

		return new Lattice(
			Array.from({ length: m }, (_, i) =>
				A.slice(i * n, (i + 1) * n)
			),
			Number
		)
	}

	find(M, predicate) {
		for (let i = 0; i < M.rows; i++) {
			for (let j = 0; j < M.columns; j++) {
				const val = M.get(i, j)
				if (predicate(val, i, j)) {
					return { value: val, row: i, column: j }
				}
			}
		}
		return null
	}

	count(M, predicate) {
		let total = 0
		for (let i = 0; i < M.rows; i++) {
			for (let j = 0; j < M.columns; j++) {
				if (predicate(M.get(i, j), i, j)) {
					total++
				}
			}
		}
		return total
	}
}