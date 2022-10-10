function setUpBoard(grid) {
	console.log('setUpBoard called');
	let board = document.createElement('div');
	board.style.display = 'flex';
	board.style.flexWrap = 'wrap';
	board.style.margin = 'auto';
	board.style.width = (grid.length * 52 +  (Math.sqrt(grid.length) * 2)) + 'px';
	board.style.height =  (grid.length * 52 + (Math.sqrt(grid.length) * 2)) + 'px';
	board.style.border = '2px solid black';
	return board;
}

function setUpSquare(grid) {
	console.log('setUpSquare called');
	let square = document.createElement('div');
	let s = Math.sqrt(grid.length);
	square.style.margin = 'auto';
	square.style.width = (s * 52) + 'px';
	square.style.height = (s * 52) + 'px';
	square.style.border = '1px solid black';
	return square;
}

function setUpLine() {
	console.log('setUpLine called');
	let line = document.createElement('div');
	line.style.display = 'flex';
	line.style.margin = 'auto';
	line.style.height = '52px';
	return line;
}

function setUpCell() {
	console.log('setUpCell called');
	let cell = document.createElement('div');
	cell.style.display = 'flex';
	cell.style.justifyContent = 'center';
	cell.style.alignContent = 'center';
	cell.style.flexDirection = 'column';
	cell.style.width = '50px';
	cell.style.height = '50px';
	cell.style.border = '1px solid black';
	return cell;
}

function drawGrid(grid) {
	console.log('drawGrid called');
	let s = Math.sqrt(grid.length);
	let board = setUpBoard(grid);
	for (let i = 0; i < grid.length; i++) {
		let square = setUpSquare(grid);
		let squareStartColon = (i % s) * s;
		let squareStartLine = ((i - (i % s)) / s) * s;
		for (let j = 0; j < s; j++) {
			let line = setUpLine();
			for (let k = 0; k < s; k++) {
				let cellIsEmpty = grid[squareStartLine + j][squareStartColon + k] === 0;
				 
				let cell = setUpCell();
				if (!cellIsEmpty) {
					cell.style.backgroundColor = 'orange';
				}
				let value = document.createElement('div');
				value.style.fontWeight = 'bold';
				value.style.fontFamily = "'Courier New', monospace";
				value.style.display = 'inline';
				value.style.textAlign = 'center';
				value.innerHTML = (!cellIsEmpty) ? grid[squareStartLine + j][squareStartColon + k] : '';
				cell.appendChild(value);
				line.appendChild(cell);
			}
			square.appendChild(line);
		}
		board.appendChild(square);
	}
	return board;
}
