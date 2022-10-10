function printGrid(grid) {
	let ret = '[\n';
	for (let i = 0; i < grid.length; i++) {
		ret += '[';
		for (let j = 0; j < grid[i].length; j++) {
			ret += (j === grid[i].length - 1) ? grid[i][j] : grid[i][j] + ',';
		}
		ret += (i === grid.length - 1) ? ']\n' : '],\n';
	}
	ret += ']\n';
	console.log(ret);
}

let vp;
window.addEventListener('load', function () {
	vp = new ViewPort(9, 700, 500)
	vp.show();
})
