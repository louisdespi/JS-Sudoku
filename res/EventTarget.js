const EventTarget = function () {
	this.listeners = {};
}

EventTarget.prototype.listeners = {};
EventTarget.prototype.addEventListener =
	function (type, callback) {
		if (!(type in this.listeners)) {
			this.listeners[type] = []
		}
		this.listeners[type].push(callback)
	}

EventTarget.prototype.removeEventListener =
	function (type, callback) {
		if (!(type in this.listeners)) {
			return
		}
		const stack = this.listeners[type]
		for (let i = 0, l = stack.length; i < l; i++) {
			if (stack[i] === callback) {
				stack.splice(i, 1)
				return
			}
		}
	}

EventTarget.prototype.dispatchEvent =
	function (event) {
		if (!(event.type in this.listeners)) {
			return true
		}
		const stack = this.listeners[event.type].slice()
		for (let i = 0, l = stack.length; i < l; i++) {
			stack[i].call(this, event)
		}
		return !event.defaultPrevented
	}
