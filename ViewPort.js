function ViewPort(side, width, height) {
	this.width = width - 2;
	this.height = height - 2;
	this.side = side;

	// main window
	this.mainW = document.createElement('div');
	this.mainW.style.position = 'static';
	this.mainW.style.width = width + 'px';
	this.mainW.style.height = height + 'px';
	this.mainW.style.margin = 'auto';
	this.mainW.style.display = 'flex';
	this.mainW.style.justifyContent = 'space-evenly';
	this.mainW.style.alignContent = 'center';
	this.mainW.style.alignItems = 'center';

	this.secondaryW = document.createElement('div');
	this.secondaryW.style.position = 'static';
	this.secondaryW.style.width = width + 'px';
	this.secondaryW.style.height = height / 3 + 'px';
	this.secondaryW.style.margin = 'auto';
	this.secondaryW.style.display = 'flex';
	this.secondaryW.style.justifyContent = 'space-evenly';
	this.secondaryW.style.alignContent = 'center';
	this.secondaryW.style.alignItems = 'center';
	this.secondaryW.style.border = '1px solid black';

	// sudoku window
	this.sudokuW = document.createElement('div');
	this.sudokuW.style.position = 'relative';
	let isSquare = this.width === this.height;
	let sudokuRatio = 3/4;
	let ws = (isSquare) ? this.width * sudokuRatio : Math.min(this.width, this.height);
	let hs = (isSquare) ? this.height * sudokuRatio : Math.min(this.width, this.height);
	this.sudokuW.style.width = ws + 'px'
	this.sudokuW.style.height = hs + 'px';

	this.sudoku = new Sudoku(this, this.side, ws - 2, hs - 2);

	this.sudokuW.appendChild(this.sudoku.domElement);

	// info window
	this.infoW = createDomContainer([
		[
			['cell', ''],
			['line', ''],
			['colon', ''],
			['square', ''],
			['value', ''],
		],
		['solutions', '']
	], 
	{
		width : (this.width - ws) + 'px',
		height : hs + 'px',
		display : 'flex',
		flexWrap : 'wrap',
		alignContent : 'center',
		justifyContent : 'center',
		fontFamily : "'Courier New', monospace",
	});

	this.coord = this.infoW.firstChild;
	this.cell = {
		container : this.coord.firstChild,
		label : this.coord.firstChild.firstChild,
		value : this.coord.firstChild.lastChild
	};
	this.line = {
		container : this.cell.container.nextElementSibling,
		label : this.cell.container.nextElementSibling.firstChild,
		value : this.cell.container.nextElementSibling.lastChild
	};
	this.colon = {
		container : this.line.container.nextElementSibling,
		label :  this.line.container.nextElementSibling.firstChild,
		value : this.line.container.nextElementSibling.lastChild
	};
	this.square = {
		container : this.colon.container.nextElementSibling,
		label : this.colon.container.nextElementSibling.firstChild,
		value : this.colon.container.nextElementSibling.lastChild
	};
	this.value = {
		container : this.square.container.nextElementSibling,
		label : this.square.container.nextElementSibling.firstChild,
		value : this.square.container.nextElementSibling.lastChild
	};
	this.solutions = {
		container : this.coord.nextElementSibling,
		label : this.coord.nextElementSibling.firstChild,
		value : this.coord.nextElementSibling.lastChild
	};

	this.mainW.appendChild(this.sudokuW);
	this.mainW.appendChild(this.infoW);
	this.startListeners();
}

Object.defineProperty(ViewPort.prototype, 'focus', {
	get () {
		if (!this._focus)
			this._focus = -1;
		return this._focus;
	},
	set (value) {
		this._focus = value;
		if (value >= 0 && value <= (this.side * this.side) - 1) {
			this.cell.value.innerHTML = this._focus;
			this.line.value.innerHTML = this.sudoku.cells[this._focus].lineIndex;
			this.colon.value.innerHTML = this.sudoku.cells[this._focus].colonIndex;
			this.square.value.innerHTML = this.sudoku.cells[this._focus].squareIndex;
			this.value.value.innerHTML = this.sudoku.cells[this._focus].value;
			this.setOverlays(); // pas du tout opti
			let cellRect = this.sudoku.cells[0].domElement.getBoundingClientRect();
			let sudokuRect = this.sudokuW.getBoundingClientRect();
			this.lineOverlay.style.top = (this.sudoku.cells[this._focus].domElement.getBoundingClientRect().top - sudokuRect.top) + 'px';
			this.colonOverlay.style.left = (this.sudoku.cells[this._focus].domElement.getBoundingClientRect().left - sudokuRect.left) + 'px';
			//this.squareOverlay.style.left = (this.sudoku.squares[this.sudoku.cells[this._focus].squareIndex].domElement.getBoundingClientRect().left - sudokuRect.left) + 'px';
			//this.squareOverlay.style.top = (this.sudoku.squares[this.sudoku.cells[this._focus].squareIndex].domElement.getBoundingClientRect().top - sudokuRect.top) + 'px';
			this.sudokuW.appendChild(this.lineOverlay);
			this.sudokuW.appendChild(this.colonOverlay);
			//this.sudokuW.appendChild(this.squareOverlay);
		}
		else {
			if (this.lineOverlay) this.lineOverlay.remove();
			if (this.colonOverlay) this.colonOverlay.remove();
			//this.squareOverlay.remove();
			this.cell.value.innerHTML = '';
			this.line.value.innerHTML = '';
			this.colon.value.innerHTML = '';
			this.square.value.innerHTML = '';
			this.value.value.innerHTML = '';
		}
	}
})

ViewPort.prototype.setOverlays =
	function () {
		let sudokuRect = this.sudokuW.getBoundingClientRect();
		let cellRect = this.sudoku.cells[0].domElement.getBoundingClientRect();
		let squareRect = this.sudoku.squares[0].domElement.getBoundingClientRect();
		if (!this.lineOverlay) {
			this.lineOverlay = document.createElement('div');
			this.lineOverlay.style.backgroundColor = 'red';
			this.lineOverlay.style.opacity = '0.25';
			this.lineOverlay.style.width = sudokuRect.width + 'px';
			this.lineOverlay.style.height = cellRect.height + 'px';
			this.lineOverlay.style.pointerEvents = 'none';
			this.lineOverlay.style.zIndex = '2';
			this.lineOverlay.style.position = 'absolute';
			//this.sudokuW.appendChild(this.lineOverlay);
		}

		if (!this.colonOverlay) {
			this.colonOverlay = document.createElement('div');
			this.colonOverlay.style.backgroundColor = 'blue';
			this.colonOverlay.style.opacity = '0.25'
			this.colonOverlay.style.width = cellRect.width + 'px';
			this.colonOverlay.style.height = sudokuRect.height + 'px';
			this.colonOverlay.style.pointerEvents = 'none';
			this.colonOverlay.style.zIndex = '2';
			this.colonOverlay.style.position = 'absolute';
			this.colonOverlay.style.top = '0px';
			//this.sudokuW.appendChild(this.colonOverlay);
		}

		/*if (!this.squareOverlay) {
			this.squareOverlay = document.createElement('div');
			this.squareOverlay.style.backgroundColor = 'green';
			this.squareOverlay.style.opacity = '0.15';
			this.squareOverlay.style.width = squareRect.width + 'px';
			this.squareOverlay.style.height = squareRect.height + 'px';
			this.squareOverlay.style.pointerEvents = 'none';
			this.squareOverlay.style.zIndex = '2';
			this.squareOverlay.style.position = 'absolute';
			this.squareOverlay.style.top = '0px';
		}*/
	}

ViewPort.prototype.startListeners =
	function () {
		for (let i in this.sudoku.cells) {
			let cell = this.sudoku.cells[i];
			cell.domElement.addEventListener('mouseover', function () {
				this.focus = cell.index;
			}.bind(this));
			cell.domElement.addEventListener('mouseout', function () {
				this.focus = -1;
			}.bind(this));
			cell.domElement.addEventListener('click', function () {
				if (!cell.locked) {
					let v = cell.getNextPossibleValue(cell.value);
					cell.setValue(v, false);
				}
				this.focus = cell.index;
			}.bind(this));
		}
	}

ViewPort.prototype.show =
	function () {
		document.body.appendChild(this.mainW);
		document.body.appendChild(this.secondaryW);
	}
