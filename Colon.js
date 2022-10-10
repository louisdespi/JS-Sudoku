function Colon(index, sudoku) {
	this.index = index;
	this.sudoku = sudoku;
	this.cells = [];
	let sc = (index - (index % this.sudoku.ssr)) / this.sudoku.ssr;
	let cc = index % this.sudoku.ssr;
	for (let i = 0; i < this.sudoku.ssr; i++) {
		for (let j = 0; j < this.sudoku.ssr; j++) {
			this.cells[i * this.sudoku.ssr + j] =
				this.sudoku.squares[sc + (this.sudoku.ssr * i)].cells[cc + (this.sudoku.ssr * j)];
		}
	}
}

Colon.prototype.isValueSet =
	function (value) {
		for (let cell of this.cells) {
			if (cell.value === value)
				return true;
		}
		return false;
	}
