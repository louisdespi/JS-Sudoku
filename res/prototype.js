function Sudoku(matrix) {
	this.side = matrix.length;
	this.sR = Math.sqrt(this.side);
	this.buildCells(matrix);
}

Sudoku.prototype = Object.create(EventTarget.prototype);
Sudoku.prototype.constructor = Sudoku;

Sudoku.prototype.buildCells =
	function (matrix){
		this.cells = [];
		this.lines = [];
		this.colons = [];
		this.squares = [];
		for (let i = 0; i < this.side; i++) {
			this.squares[i] = [];
			this.lines[i] = [];
			this.colons[i] = [];
		}
		for (let i = 0; i < matrix.length; i++) {
			for (let j = 0; j < matrix[i].length; j++) {
				let squareLine = (i - (i % this.sR)) / this.sR;
				let squareColon = (j - (j % this.sR)) / this.sR;
				let inSquareLine = i % this.sR;
				let inSquareColon = j % this.sR;
				let cell = new Cell(i * 9 + j, this);
				cell.width = 38;
				cell.height = 38;
				if (matrix[i][j] !== 0)
					cell.value = matrix[i][j];
				this.cells.push(cell);
				this.lines[i][j] = cell;
				this.colons[j][i] = cell;
				this.squares[(squareLine * this.sR) + squareColon][(inSquareLine * this.sR) + inSquareColon] = cell;
			}
		}
	}

Sudoku.prototype.getVisual = 
	function (width, height) {
		let aWidth = width - (2 * 2);
		let aHeight = height - (2 * 2);
		let visual = document.createElement('div');
		visual.style.display = 'flex';
		visual.style.flexWrap = 'wrap';
		visual.style.justifyContent = 'space-evenly';
		visual.style.width = aWidth + 'px';
		visual.style.height = aHeight + 'px';
		visual.style.border = '2px solid black';
		for (let i = 0; i < this.side; i++) {
			visual.appendChild(this.getVisualSquare(i, aWidth / this.sR, aHeight / this.sR));
		}
		return visual;
	} // ceci ne dessine pas un instantane, mais cree l'arborescence dom du sudoku. Il faut indexer 

Sudoku.prototype.getVisualSquare =
	function (index, width, height) {
		let aWidth = width - (2 * 1);
		let aHeight = height - (2 * 1);
		let square = document.createElement('div');
		square.style.display = 'flex';
		square.style.flexWrap = 'wrap';
		square.style.justifyContent = 'space-evenly';
		square.style.alignItems = 'center';
		square.style.width = aWidth + 'px';
		square.style.height = aHeight + 'px';
		square.style.border = '1px solid black';
		for (let i = 0; i < this.side; i++) {
			square.appendChild(this.squares[index][i].domElement);
		}
		return square;
	}

Sudoku.prototype.getVisualLine =
	function (index, width, height) {
		let aWidth = (width - (2 * 1));
		let aHeight = (height - (2 * 1));
		let line = document.createElement('div');
		line.style.display = 'flex';
		line.style.flexWrap = 'wrap';
		line.style.justifyContent = 'space-evenly';
		line.style.alignItems = 'center';
		line.style.width = aWidth + 'px';
		line.style.height = aHeight + 'px';
		line.style.border = '1px solid black';
		for (let i = 0; i < this.side; i++) {
			line.appendChild(this.lines[index][i].getVisual((aWidth / this.side) - 2, aHeight - 2));
		}
		return line;
	}

Sudoku.prototype.getVisualColon =
	function (index, width, height) {
		let aWidth = (width - (2 * 1));
		let aHeight = (height - (2 * 1));
		let colon = document.createElement('div');
		colon.style.display = 'flex';
		colon.style.flexWrap = 'wrap';
		colon.style.justifyContent = 'space-evenly';
		colon.style.alignItems = 'center';
		colon.style.width = aWidth + 'px';
		colon.style.height = aHeight + 'px';
		colon.style.border = '1px solid black';
		for (let i = 0; i < this.side; i++) {
			colon.appendChild(this.colons[index][i].getVisual((aWidth / this.side) - 2, aHeight - 2));
		}
		return colon;
	}

// la prochaine etape sera d'avoir un viewport dans lequel le sudoku est modifie en temps reel

let sudoku = new Sudoku([
[0, 7, 6, 0, 8, 0, 0 ,4 ,1],
[0, 2, 1, 0, 0, 0, 9 ,0 ,7],
[5, 0, 0, 0, 0, 0, 0 ,8 ,6],
[4, 0, 0, 6, 7, 9, 0 ,2 ,0],
[0, 8, 0, 0, 4, 0, 0 ,5 ,0],
[0, 6, 0, 8, 2, 5, 0 ,0 ,4],
[7, 4, 0, 0, 0, 0, 0 ,0 ,5],
[6, 0, 2, 0, 0, 0, 4 ,7 ,0],
[1, 9, 0, 0, 5, 0, 8 ,6 ,0],
]);

let vp = new ViewPort(sudoku);
window.addEventListener('load', function() {
	document.body.appendChild(vp.mainW);
	vp.refresh();
	sudoku.addEventListener('update', function() {vp.refresh()});
});
