function Cell(index, sudoku, value, squareIndex, width, height) {
	this.buildDomElement();
	this.index = index;
	this.sudoku = sudoku;
	this._value = value;
	this.locked = false;
	this.squareIndex = squareIndex;
	this.lineIndex = (index - (index % this.sudoku.side)) / this.sudoku.side;
	this.colonIndex = index % this.sudoku.side;
	this.resize(width, height);
}

Object.defineProperty(Cell.prototype, 'possibleValues', {
	get () {
		if (this.locked)
			return [];
		let possibleValues = [];
		for (let i = 1; i <= this.sudoku.side; i++) {
			if (this.canSetValue(i))
				possibleValues.push(i);
		}
		return possibleValues; 
	}
});

Object.defineProperty(Cell.prototype, 'value', {
	get () {
		return this._value;
	},
	set (newValue) {
		if (this.canSetValue(newValue)) {
			this._value = newValue;
			this.domApplyValue();
		}
	}
});

Cell.prototype.domApplyValue =
	function () {
		this.domElement.innerHTML = (this.value !== 0) ? this.value : '';
	}

Cell.prototype.buildDomElement =
	function () {
		if (this.domElement)
			return ;
		this.domElement = document.createElement('div');
		this.domElement.style.display = 'flex';
		this.domElement.style.justifyContent = 'center';
		this.domElement.style.alignContent = 'center';
		this.domElement.style.flexDirection = 'column';
		this.domElement.style.border = '1px solid black';
		this.domElement.style.fontWeight = 'bold';
		this.domElement.style.fontFamily = "'Courier New', monospace";
		this.domElement.style.textAlign = 'center';
	}

Cell.prototype.resize =
	function (width, height) {
		this.width = width;
		this.height = height;
		this.domElement.style.width = (this.width - 2) + 'px';
		this.domElement.style.height = (this.height - 2) + 'px';
	}

Cell.prototype.lock =
	function () {
		this.locked = true;
		this.domElement.style.backgroundColor = '#C5C5C5';
	}

Cell.prototype.unlock =
	function () {
		this.locked = false;
		this.domElement.style.backgroundColor = '#F0F0F0';
	}

Cell.prototype.canSetValue =
	function (value) {
		if (value === this.value)
			return true;
		if (this.locked)
			return false;
		if (value === 0)
			return true;
		let line = this.sudoku.lines[this.lineIndex];
		let colon = this.sudoku.colons[this.colonIndex];
		let square = this.sudoku.squares[this.squareIndex];
		return line.isValueSet(value) === false &&
			colon.isValueSet(value) === false &&
			square.isValueSet(value) === false;
	}

Cell.prototype.setValue =
	function (value, isInit) {
		if (this.canSetValue(value) === false)
			return false;
		this.value = value;
		if (this.value !== 0)
			this.domElement.innerHTML = value;
		else
			this.domElement.innerHTML = '';
		if (isInit){
			if (this.value !== 0)
				this.lock();
			else
				this.unlock();
		}
		return true;
	}

Cell.prototype.getNextPossibleValue =
	function (from) {
		for (let i = 1; i <= this.sudoku.side; i++) {
			let nextValue = (from + i) % (this.sudoku.side + 1);
			if (this.canSetValue(nextValue))
				return nextValue;
		}
		return 0;
	}

Cell.prototype.empty =
	function () {
		this.unlock();
		this.value = 0;
	}
