function UniqueValueArray(size, def) {
	this.size = size;
	this.count = (def === false) ? 0 : this.size;
	this.values = [];
	for (let i = 0; i < this.size; i++) {
		this.values[i] = def;
	}
}

UniqueValueArray.prototype.hasValue =
	function (value) {
		return this.values[value - 1] === true;
	}

UniqueValueArray.prototype.removeValue =
	function (value) {
		if (this.values[value - 1] === false || this.count === 0)
			return false;
		this.values[value - 1] = false;
		this.count--;
		return true;
	}

UniqueValueArray.prototype.addValue =
	function (value) {
		if (this.values[value - 1] === true || this.count === this.size)
			return false;
		this.values[value - 1] = true;
		this.count++;
		return true;
	}

UniqueValueArray.prototype.getArray =
	function () {
		let array = [];
		for (let i = 1; i <= this.values.length; i++) {
			if (this.hasValue(i)) array.push(i);
		}
		return array;
	}

let rt;

self.addEventListener('message', function (e) {
	let answer;
	switch(e.data.cmd) {
		case 'setUp' :
			rt = new RecurseTask(e.data.matrix);
			break;
		case 'start':
			if (e.data.opt) {
				let orderedCells = rt.cells.filter(function (cell) {
					return cell.value === 0 && cell.index >= e.data.from;
				}).sort(function(a, b){
					return rt.getCellCandidates(a).count - rt.getCellCandidates(b).count;
				});
				answer = rt.optRecurseThrough(orderedCells, e.data.delay);
			} else {
				answer = rt.recurseThrough(e.data.from, e.data.delay);
			}
			self.postMessage({
				cmd : 'answer',
				answer : answer
			});
			break;
		case 'kill':
			self.close();
			break;
	}
});

function sleep(milliseconds) {
	var start = new Date().getTime();
		for (var i = 0; i < 1e7; i++) {
			if ((new Date().getTime() - start) > milliseconds){
				break;
		}
	}
}

function RecurseTask (matrix) {
	this.matrix = [];
	this.side = matrix.length;
	this.ssr = Math.sqrt(this.side);
	for (let i = 0; i < matrix.length; i++) {
		this.matrix[i] = [];
		for (let j = 0; j < matrix[i].length; j++) {
			this.matrix[i][j] = {
				value : matrix[i][j],
				index : i * this.side + j,
				line : i,
				colon : j,
				square : ((j - (j % this.ssr)) / this.ssr) + (i - (i % this.ssr)),
			}
		}
	}
	this.cells = this.matrix.flat(2);

	// sets declarations
	this.lines = [];
	this.colons = [];
	this.squares = [];
	for (let i = 0; i < this.side; i++) {
		this.lines[i] = {
			cells : [],
			index : i
		};
		this.colons[i] = {
			cells : [],
			index : i
		};
		this.squares[i] = {
			cells : [],
			index : i
		};
	}

	// sets initializations and binding
	for (let i = 0; i < this.cells.length; i++) {
		let cell = this.cells[i];
		this.lines[cell.line].cells[i % this.side] = cell;
		this.colons[cell.colon].cells[(i - i % this.side) / this.side] = cell;
		this.squares[cell.square].cells[(cell.line % this.ssr) * this.ssr + (cell.colon % this.ssr)] = cell;
		cell.line = this.lines[cell.line];
		cell.colon = this.colons[cell.colon];
		cell.square = this.squares[cell.square];
	}

	// sets candidates initalization
	for (let i = 0; i < this.side; i++) {
		this.lines[i].candidates = this.getSetCandidates(this.lines[i]);
		this.colons[i].candidates = this.getSetCandidates(this.colons[i]);
		this.squares[i].candidates = this.getSetCandidates(this.squares[i]);
	}
}

RecurseTask.prototype.setCellValue =
	function (cell, value) {
		if (value === cell.value)
			return true;
		let newValue = value; // 9
		let oldValue = cell.value; // 8
		if (oldValue !== 0) {
			cell.line.candidates.addValue(oldValue);
			cell.colon.candidates.addValue(oldValue);
			cell.square.candidates.addValue(oldValue);
		}
		if (newValue !== 0) {
			cell.line.candidates.removeValue(newValue);
			cell.colon.candidates.removeValue(newValue);
			cell.square.candidates.removeValue(newValue);
		}
		cell.value = value;
	}

RecurseTask.prototype.isOnLine =
	function (value, lineIndex) {
		for (let i = 0; i < this.matrix[lineIndex].length; i++) {
			if (this.matrix[lineIndex][i] &&
				this.matrix[lineIndex][i].value === value)
				return true;
		}
		return false;
	}

RecurseTask.prototype.isOnColon =
	function (value, colonIndex) {
		for (let i = 0; i < this.matrix.length; i++) {
			if (this.matrix[i][colonIndex] &&
				this.matrix[i][colonIndex].value === value)
				return true;
		}
		return false;
	}

RecurseTask.prototype.isOnSquare =
	function (value, lineIndex, colonIndex) {
		let lineStart = lineIndex - lineIndex % this.ssr;
		let colonStart = colonIndex - colonIndex % this.ssr;
		for (let i = 0; i < this.ssr; i++) {
			for (let j = 0; j < this.ssr; j++) {
				if (this.matrix[lineStart + i][colonStart + j] &&
					this.matrix[lineStart + i][colonStart + j].value === value)
					return true;
			}
		}
		return false;
	}

RecurseTask.prototype.canSetValue =
	function (value, line, colon) {
		return !(this.isOnLine(value, line)) &&
				!(this.isOnColon(value, colon)) &&
				!(this.isOnSquare(value, line, colon));
	}

RecurseTask.prototype.getSetCandidates =
	function (set) {
		let candidates = new UniqueValueArray(this.side, true); // true means each value is set when created
		set.cells.forEach(function(cell){
			candidates.removeValue(cell.value);
		})
		return candidates;
	}

RecurseTask.prototype.getCellCandidates =
	function (cell) {
		let candidates = new UniqueValueArray(this.side, false);
		if (cell.value === 0) {
			for (let i = 1; i <= this.side; i++) { // optimisable
				if (cell.line.candidates.hasValue(i) &&
						cell.colon.candidates.hasValue(i) &&
						cell.square.candidates.hasValue(i))
					candidates.addValue(i)
			}
		}
		return candidates;
	}

RecurseTask.prototype.optRecurseThrough =
	function (emptyCells, delay) {
		let cell = emptyCells.shift();
		if (cell === undefined) {
			self.postMessage({
				cmd : 'solutionUpdate',
				matrix : this.matrix
			});
			return 1;
		}
		let position = cell.index;
		let solutions = 0;
		let candidates = this.getCellCandidates(cell).getArray();
		for (let candidate of candidates) {
			self.postMessage({
				cmd : 'focusUpdate',
				focus : position
			});
			sleep(delay);
			this.setCellValue(cell, candidate);
			emptyCells.sort(function(a, b){
				return this.getCellCandidates(a).count - this.getCellCandidates(b).count;
			}.bind(this));
			self.postMessage({
				cmd : 'valueUpdate',
				value : cell.value,
				focus : position
			});
			sleep(delay);
			solutions += this.optRecurseThrough(emptyCells, delay);
		}
		this.setCellValue(cell, 0);
		emptyCells.push(cell);
		self.postMessage({
			cmd : 'focusUpdate',
			focus : position
		});
		sleep(delay);
		self.postMessage({
			cmd : 'valueUpdate',
			value : cell.value,
			focus : position
		});
		sleep(delay);
		return solutions;
	}

RecurseTask.prototype.recurseThrough =
	function (position, delay) {
		self.postMessage({
			cmd : 'focusUpdate',
			focus : position
		});
		sleep(delay);
		if (position === this.matrix.length * this.matrix.length) {
			self.postMessage({
				cmd : 'solutionUpdate',
				matrix : this.matrix,
			});
			return 1;
		}
		let colon = position % this.matrix.length;
		let line = (position - colon) / this.matrix.length;
		if (this.matrix[line][colon].value !== 0)
			return this.recurseThrough(position + 1, delay);
		let solutions = 0;
		for (let i = 1; i <= this.side; i++) {
			if (this.isOnLine(i, line) === false &&
					this.isOnColon(i, colon) === false &&
					this.isOnSquare(i, line, colon) === false) {
				this.matrix[line][colon].value = i;
				self.postMessage({
					cmd : 'valueUpdate',
					value : this.matrix[line][colon].value,
					focus : position
				});
				sleep(delay);
				solutions += this.recurseThrough(position + 1, delay);
			}
		}
		this.matrix[line][colon].value = 0;
		self.postMessage({
			cmd : 'focusUpdate',
			focus : position
		});
		self.postMessage({
			cmd : 'valueUpdate',
			value : this.matrix[line][colon].value,
			focus : position
		});
		sleep(delay);
		return solutions;
	}
