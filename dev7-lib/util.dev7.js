/**
 * 配列を拡張.
 */
Array.prototype.contains = function(obj) {
	return this.indexOf(obj) != -1;
};
Array.prototype.pool = function(obj) {
	obj.active = false;
	obj._pool = this;
	obj.dispose = function() {
		obj._pool.dispose(obj);
	};
	this[this.length] = obj;
};
Array.prototype.get = function(f) {
	for ( var i = 0, end = this.length; i < end; i++) {
		if (this[i].active === false) {
			this[i].active = true;
			if (typeof (f) === "function") {
				f.apply(this[i], [ this[i] ]);
			}
			return this[i];
		}
	}
	console.trace("リソースが足りないかもです");
	return null;
};
Array.prototype.dispose = function(obj) {
	obj.active = false;
};
Array.prototype.disposeAll = function() {
	for ( var i = 0, end = this.length; i < end; i++) {
		this[i].active = false;
	}
};

/**
 * 連結リスト.
 */
function LinkedList() {
	var dummy = {
		_prev : null,
		_next : null,
		body : "dummy"
	}
	this._first = dummy;
	this._last = dummy;
};
LinkedList.prototype.add = function(obj) {
	if (this._prev) {
		return;
	}
	obj._prev = this._last;
	obj._next = null;
	this._last._next = obj;
	this._last = obj;
};
LinkedList.prototype.remove = function(obj) {
	if (this._last === obj) {
		this._last = obj._prev;
	}
	obj._prev._next = obj._next;
	if (obj._next) {
		obj._next._prev = obj._prev;
	}
};
LinkedList.prototype.contains = function(obj) {
	var m = this._first;
	while ((m = m._next)) {
		if (m === obj) {
			return true;
		}
	}
	return false;
};
LinkedList.prototype.toArray = function() {
	var result = [];
	var m = this._first;
	while ((m = m._next)) {
		result[result.length] = m;
	}
	return result;
}
LinkedList.prototype.forEach = function(f) {
	var m = this._first;
	while ((m = m._next)) {
		f(m);
	}
};
LinkedList.prototype.map = function(f) {
	var result = [];
	var m = this._first;
	while ((m = m._next)) {
		result[result.length] = f(m);
	}
	return result;
};
LinkedList.prototype.filter = function(f) {
	var result = [];
	var m = this._first;
	while ((m = m._next)) {
		if (f(m)) {
			result[result.length] = m;
		}
	}
	return result;
};
LinkedList.prototype.clear = function() {
	this._first._next = null;
};

/**
 * 乱数を返す.
 * 
 * 1. random(range) ... 0以上range未満の範囲から乱数を返す. <br>
 * 2. random(center, range) ... centerを中心にrangeの幅の範囲から乱数を返す.<br>
 */
function random() {
	if (arguments.length === 0) {
		return Math.random()
	} else if (arguments.length === 1) {
		return Math.random() * arguments[0];
	} else {
		return arguments[0] + Math.random() * arguments[1] - arguments[1] * 0.5;
	}
}
function randomInt() {
	return ~~random.apply(null, arguments);
}

String.prototype.startsWith = function(prefix) {
	return this.indexOf(prefix) === 0;
};
