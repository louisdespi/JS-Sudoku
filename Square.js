function Square(index, sudoku, width, height) {
	this.buildDomElement();
	this.index = index;
	this.sudoku = sudoku;
	this.cells = [];
	for (let i = 0; i < this.sudoku.side; i++) {
		let squareLine = (index - (index % this.sudoku.ssr)) / this.sudoku.ssr;
		let squareColon = index % this.sudoku.ssr;
		let inSquareLine = (i - (i % this.sudoku.ssr)) / this.sudoku.ssr;
		let inSquareColon = i % this.sudoku.ssr;
		let line = (squareLine * this.sudoku.ssr) + inSquareLine
		let colon = (squareColon * this.sudoku.ssr) + inSquareColon;
		this.cells[i] = new Cell(
			line * this.sudoku.side + colon,
			this.sudoku,
			0,
			this.index,
			this.computeCellWidth(),
			this.computeCellHeight()
		);
		this.domElement.appendChild(this.cells[i].domElement);
	}
	this.resize(width, height);
}

Square.prototype.isValueSet =
	function (value) {
		for (let cell of this.cells) {
			if (cell.value === value)
				return true;
		}
		return false;
	}

Square.prototype.buildDomElement =
	function () {
		if (this.domElement)
			return ;
		this.domElement = document.createElement('div');
		this.domElement.style.display = 'flex';
		this.domElement.style.flexWrap = 'wrap';
		this.domElement.style.justifyContent = 'space-evenly';
		this.domElement.style.alignItems = 'center';
		this.domElement.style.border = '1px solid black';
	}

Square.prototype.computeCellWidth =
	function () {
		return (this.width / this.sudoku.ssr) - 2;
	}

Square.prototype.computeCellHeight =
	function () {
		return (this.height / this.sudoku.ssr) - 2;
	}

Square.prototype.resize =
	function (width, height) {
		this.width = width;
		this.height = height;
		for (let i in this.cells) {
			this.cells[i].resize(this.computeCellWidth(), this.computeCellHeight());
		}
		this.domElement.style.width = (this.width - 2) + 'px';
		this.domElement.style.height = (this.height - 2) + 'px';
	}
