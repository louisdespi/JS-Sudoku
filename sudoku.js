function Sudoku(vp, side, width, height) {
	this.vp = vp;
	this.buildDomElement();
	this.side = side;
	this.ssr = Math.sqrt(this.side);
	this.squares = [];
	for (let i = 0; i < this.side; i++) {
		this.squares[i] = new Square(
			i,
			this,
			this.computeSquareWidth(),
			this.computeSquareHeight()
		);
		this.domElement.appendChild(this.squares[i].domElement);
	}
	this.lines = [];
	this.colons = [];
	for (let i = 0; i < this.side; i++) {
		this.lines[i] = new Line(i, this);
		this.colons[i] = new Colon(i, this);
	}
	this.cells = [];
	for (let i = 0; i < this.side; i++) {
		for (let j = 0; j < this.side; j++) {
			this.cells[this.squares[i].cells[j].index] = this.squares[i].cells[j];
		}
	}
	this.worker = null;
	this.empty();
	this.resize(width, height);
}

Object.defineProperty(Sudoku.prototype, 'value', {
	get () {
		return this.lines.map(function (line) {
			return line.value;
		})
	},
	set (newValue) {
		if (!this.canSetValue(newValue))
			return false;
		for (let i = 0; i < newValue.length; i++) {
			this.lines[i].value = newValue[i];
		}
	}
});

Sudoku.prototype.buildDomElement =
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

Sudoku.prototype.computeSquareWidth =
	function () {
		return (this.width / this.ssr) - 2;
	}

Sudoku.prototype.computeSquareHeight =
	function () {
		return (this.height / this.ssr) - 2;
	}

Sudoku.prototype.resize =
	function (width, height) {
		this.width = width;
		this.height = height;
		for (let i in this.squares) {
			this.squares[i].resize(this.computeSquareWidth(), this.computeSquareHeight());
		}
		this.domElement.style.width = (this.width - 2) + 'px';
		this.domElement.style.height = (this.height - 2) + 'px';
	}

Sudoku.prototype.startWorker =
	function (from, delay, matrix, opt, mustUpdate) {
		if (!this.setUpWorker(matrix))
			return false;
		if (mustUpdate) this.worker.bound = true;
		this.countSolution = 0;
		this.vp.solutions.value.innerHTML = 'computing...<br/> (' + (this.countSolution) + ')';
		this.worker.inst.postMessage({
			cmd : 'start',
			from : from,
			opt : opt,
			matrix : matrix,
			delay : delay
		});
		this.worker.atWork = true;
		return true;
	}

Sudoku.prototype.pauseWorker =
	function () {
		this.worker.inst.postMessage({
			cmd : 'pause'
		});
	}

Sudoku.prototype.resumeWorker =
	function () {
		this.worker.inst.postMessage({
			cmd : 'resume'
		});
	}

Sudoku.prototype.killWorker =
	function () {
		if (!this.worker)
			return false;
		this.worker.inst.terminate();
		this.worker = null;
		this.vp.focus = -1;
		this.vp.solutions.value.innerHTML = 'interrupted : ' + this.countSolution;
		return true;
	}

Sudoku.prototype.setUpWorker =
	function (matrix) {
		if (!this.worker) {
			this.worker = {
				inst : new Worker('recurseTask.js'),
				atWork : false,
				bound : false,
				ready : false
			};
		}
		if (this.worker) {
			if (this.worker.ready) {
				console.log('Worker is already ready');
				return false;
			}
			if (this.worker.atWork) {
				console.log('Worker is already working');
				return false;
			}
		}
		//this.solutions = [];
		this.worker.inst.addEventListener('message', function(e) {
			switch (e.data.cmd) {
				case 'answer':
					this.killWorker();
					console.log('This sudoku has ' + e.data.answer + ' solutions');
					this.vp.solutions.value.innerHTML = e.data.answer;
					this.vp.focus = -1;
					break;
				case 'solutionUpdate':
					/*for (let i = 0; i < e.data.matrix.length; i++) {
						e.data.matrix[i] = e.data.matrix[i].map(x => x.value);
					}
					this.solutions.push(e.data.matrix);*/
					this.vp.solutions.value.innerHTML = 'computing...<br/> (' + (++this.countSolution) + ')';
					break;
				case 'focusUpdate':
					if (this.worker.bound)
						this.vp.focus = e.data.focus;
					break;
				case 'valueUpdate':
					if (this.worker.bound)
						this.cells[e.data.focus].value = e.data.value;
					break;
				case 'debug':
					console.log(e.data.values);
					break;
			}
		}.bind(this));
		this.worker.inst.postMessage({
			cmd : 'setUp',
			matrix : matrix
		});
		this.worker.ready = true;
		return true;
	}

Sudoku.prototype.lockCells =
	function () {
		for (let cell of this.cells) {
			if (cell.value !== 0)
				cell.lock();
		}
	}

Sudoku.prototype.unlockCells =
	function () {
		for (let cell of this.cells) {
			cell.unlock();
		}
	}

Sudoku.prototype.canSetValue =
	function (value) {
		if (!(Array.isArray(value) && value.length === this.side))
			return false;
		for (let i = 0; i < value.length; i++) {
			if (!this.lines[i].canSetValue(value[i]))
				return false;
		}
		return true;
	}

Sudoku.prototype.empty =
	function () {
		for (let line of this.lines) {
			line.empty();
		}
	}
