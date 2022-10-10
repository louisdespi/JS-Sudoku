let g = [
[0, 7, 6, 0, 8, 0, 0 ,4 ,1],
[0, 2, 1, 0, 0, 0, 9 ,0 ,7],
[5, 0, 0, 0, 0, 0, 0 ,8 ,6],
[4, 0, 0, 6, 7, 9, 0 ,2 ,0],
[0, 8, 0, 0, 4, 0, 0 ,5 ,0],
[0, 6, 0, 8, 2, 5, 0 ,0 ,4],
[7, 4, 0, 0, 0, 0, 0 ,0 ,5],
[6, 0, 2, 0, 0, 0, 4 ,7 ,0],
[1, 9, 0, 0, 5, 0, 8 ,6 ,0],
];

/*let g = [
[2, 0, 0, 0],
[1, 0, 0, 3],
[4, 0, 0, 0],
[3, 2, 0, 1]
];*/

/*let g = [
[0, 0, 0, 0],
[0, 0, 0, 0],
[0, 0, 0, 0],
[0, 0, 0, 0]
];*/

/*let g = [
[0, 0, 6, 0, 8, 0, 0 ,4 ,1],
[0, 2, 1, 0, 0, 0, 9 ,0 ,7],
[5, 0, 0, 0, 0, 0, 0 ,8 ,6],
[4, 0, 0, 6, 7, 9, 0 ,2 ,0],
[0, 8, 0, 0, 4, 0, 0 ,5 ,0],
[0, 6, 0, 8, 2, 5, 0 ,0 ,4],
[7, 4, 0, 0, 0, 0, 0 ,0 ,5],
[6, 0, 2, 0, 0, 0, 4 ,7 ,0],
[1, 0, 0, 0, 5, 0, 8 ,6 ,0],
];*/

let solutions = [];

function GridManager(grid) {
	this.initGrid = cloneGrid(grid);
	this.initState = buildInitState(grid);
	this.grid = grid;
	this.size = grid.length;
	this.sqrt = Math.sqrt(this.size);
}

GridManager.prototype.recurse =
	function () {
		
	}

GridManager.prototype.isOnLine =
	function (value, lineIndex) {
		
	}

GridManager.prototype.isOnColon =
	function (value, lineIndex) {
		
	}

GridManager.prototype.isOnSquare =
	function isOnSquare(value, lineIndex, colonIndex) {
		let lineStart = lineIndex - lineIndex % this.sqrt;
		let colonStart = colonIndex - colonIndex % this.sqrt;
		for (let i = 0; i < sqrt; i++) {
			for (let j = 0; j < sqrt; j++) {
				if (grid[lineStart + i][colonStart + j] === value)
					return true;
			}
		}
		return false;
	}

function buildInitState(grid) {
	let initState = [];
	for (let i = 0; i < grid.length; i++) {
		initState.push([]);
		for (let j = 0; i < grid[i].length; j++) {
			initState[i][j] = grid[i][j] === 0
		}
	}
	return initState;
}

function cloneGrid(grid) {
	let newGrid = [];
	for (let i = 0; i < grid.length; i++) {
		newGrid.push([]);
		for (let j = 0; j < grid[i].length; j++) {
			newGrid[i][j] = grid[i][j];
		}
	}
	return newGrid;
}

function isOnLine(grid, value, lineIndex) {
	for (let i = 0; i < grid[lineIndex].length; i++) {
		if (grid[lineIndex][i] === value)
			return true;
	}
	return false;
}

function isOnColon(grid, value, colonIndex) {
	for (let i = 0; i < grid.length; i++) {
		if (grid[i][colonIndex] === value)
			return true;
	}
	return false;
}

function isOnSquare(grid, value, lineIndex, colonIndex) {
	let s = Math.sqrt(grid.length); // le sudoku est compose de s x s carres de cote s
	let lineStart = lineIndex - lineIndex % s;
	let colonStart = colonIndex - colonIndex % s;
	for (let i = 0; i < s; i++) {
		for (let j = 0; j < s; j++) {
			if (grid[lineStart + i][colonStart + j] === value)
				return true;
		}
	}
	return false;
}

function isValid(grid) {
	countValidGrids(grid, 0);
}

function countValidGrids(grid, position) {
	if (position === grid.length * grid.length) {
		solutions.push(cloneGrid(grid));
		return true;
	}
	let colon = position % grid.length;
	let line = (position - colon) / grid.length;
	if (grid[line][colon] !== 0)
		return countValidGrids(grid, position + 1);
	let t = false;
	for (let i = 1; i <= grid.length; i++) {
		if (isOnLine(grid, i, line) === false && isOnColon(grid, i, colon) === false && isOnSquare(grid, i, line, colon) === false) {
			grid[line][colon] = i;
			t = countValidGrids(grid, position + 1);
		}
	}
	grid[line][colon] = 0;
	return t;
}

let gInitialState = cloneGrid(g);

console.log(gInitialState);
 
isValid(g);
console.log(solutions.length);
console.log(solutions.length === 1);

window.addEventListener('load', function() {
	if (solutions.length > 0) {
		let board = drawGrid(g);
		document.body.appendChild(board);
	}
});

for (let i = 0; i < solutions.length; i++) {
	console.log('Solution n_' + (i + 1));
	console.log(solutions[i]);
}

















/*function isValid(grid, position) {
	if (position === grid.length * grid.length)
		return true;
	let colon = position % grid.length;
	let line = (position - colon) / grid.length;
	if (grid[line][colon] !== 0)
		return isValid(grid, position + 1);
	for (let i = 1; i <= grid.length; i++) {
		if (isOnLine(grid, i, line) === false && isOnColon(grid, i, colon) === false && isOnSquare(grid, i, line, colon) === false) {
			grid[line][colon] = i;
			if (isValid(grid, position + 1))
				return true;
		}
	}
	grid[line][colon] = 0;
	return false;
}*/


