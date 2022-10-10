function Line(index, sudoku) {
	this.index = index;
	this.sudoku = sudoku;
	this.cells = [];
	let sl = (index - (index % this.sudoku.ssr)) / this.sudoku.ssr;
	let cl = index % this.sudoku.ssr;
	for (let i = 0; i < this.sudoku.ssr; i++) {
		for (let j = 0; j < this.sudoku.ssr; j++) {
			this.cells[i * this.sudoku.ssr + j] =
				this.sudoku.squares[sl * this.sudoku.ssr + i].cells[cl * this.sudoku.ssr + j];
		}
	}
}

Object.defineProperty(Line.prototype, 'value', {
	get () {
		return this.cells.map(function (cell) {
			return cell.value;
		});
	},
	set (newValue) {
		if (!this.canSetValue(newValue))
			return false;
		for (let i = 0; i < newValue.length; i++) {
			this.cells[i].value = newValue[i];
		}
	}
});

Line.prototype.canSetValue =
	function (value) {
		if (!(Array.isArray(value) && value.length === this.sudoku.side))
			return false;
		for (let i = 0; i < value.length; i++) {
			if (!this.cells[i].canSetValue(value[i]))
				return false;
		}
		return true;
	}

Line.prototype.setValue =
	function (newValue, isInit) {
		if (this.canSetValue(newValue) === false)
			return false;
		for (let i = 0; i < newValue.length; i++) {
			this.cells[i].value = newValue[i];
		}
		return true;
	}

Line.prototype.isValueSet =
	function (value) {
		for (let cell of this.cells) {
			if (cell.value === value)
				return true;
		}
		return false;
	}

Line.prototype.empty =
	function () {
		for (let cell of this.cells) {
			cell.empty();
		}
	}
