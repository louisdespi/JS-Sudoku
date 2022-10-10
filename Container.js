function createDomContainer(content, style) {
	let domContainer = document.createElement('div');
	Object.assign(domContainer.style, style);
	let width = parseInt(domContainer.style.width);
	let height = parseInt(domContainer.style.height);
	let childrenStyle = {
		//border : '1px solid black',
		display : 'flex',
		flexWrap : 'wrap'
	}
	if (width > height) {
		childrenStyle.width = (width / content.length - 3) + 'px'
		childrenStyle.height = (height - 2) + 'px'
		childrenStyle.flexDirection = 'row';
	} else {
		childrenStyle.width = (width - 2) + 'px'
		childrenStyle.height = (height / content.length - 3) + 'px'
		childrenStyle.flexDirection = 'column';
	}
	if (Array.isArray(content)) {
		for (let i = 0; i < content.length; i++) {
			let child = createDomContainer(content[i], childrenStyle);
			domContainer.appendChild(child);
		}
	} else {
		domContainer.style.border = '1px solid black';
		domContainer.innerHTML = content.toString();
		domContainer.style.justifyContent = 'center';
		domContainer.style.backgroundColor = '#F0F0F0';
		domContainer.style.alignContent = 'center';
		domContainer.style.flexDirection = 'column';
		domContainer.style.textAlign = 'center';
	}
	return domContainer;
}

function createDomContainer(content, style) {
	let domContainer = document.createElement('div');
	Object.assign(domContainer.style, style);
	let width = parseInt(domContainer.style.width);
	let height = parseInt(domContainer.style.height);
	let childrenStyle = {
		//border : '1px solid black',
		display : 'flex',
		flexWrap : 'wrap'
	}
	if (width > height) {
		childrenStyle.width = (width / content.length - 3) + 'px'
		childrenStyle.height = (height - 2) + 'px'
		childrenStyle.flexDirection = 'row';
	} else {
		childrenStyle.width = (width - 2) + 'px'
		childrenStyle.height = (height / content.length - 3) + 'px'
		childrenStyle.flexDirection = 'column';
	}
	if (Array.isArray(content)) {
		for (let i = 0; i < content.length; i++) {
			let child = createDomContainer(content[i], childrenStyle);
			domContainer.appendChild(child);
		}
	} else {
		domContainer.style.border = '1px solid black';
		domContainer.innerHTML = content.toString();
		domContainer.style.justifyContent = 'center';
		//domContainer.style.wordBreak = 'normal';
		//domContainer.style.overflowWrap = 'anywhere'; //overflow-wrap: break-word;
		//domContainer.style.overflow = 'hidden';
		domContainer.style.backgroundColor = '#F0F0F0';
		domContainer.style.alignContent = 'center';
		domContainer.style.flexDirection = 'column';
		domContainer.style.textAlign = 'center';
	}
	return domContainer;
}
