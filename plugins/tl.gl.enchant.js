enchant.gl.tl = {};

(function() {
	var orig = enchant.gl.Sprite3D.prototype.initialize;
	enchant.gl.Sprite3D.prototype.initialize = function() {
		orig.apply(this, arguments);
		var tl = this.tl = new enchant.gl.tl.Timeline(this);
		this.addEventListener("enterframe", function() {
			tl.dispatchEvent(new enchant.Event("enterframe"));
		});
	};
})();

enchant.gl.tl.Tween = enchant.Class.create(enchant.tl.Action, {
	initialize : function(params) {
		var origin = {};
		var target = {};
		enchant.tl.Action.call(this, params);

		if (this.easing == null) {
			// linear
			this.easing = function(t, b, c, d) {
				return c * t / d + b;
			};
		}

		var tween = this;
		this.addEventListener(enchant.Event.ACTION_START, function() {
			// トゥイーンの対象とならないプロパティ
			var excepted = [ "frame", "time", "callback", "onactiontick",
					"onactionstart", "onactionend" ];
			for ( var prop in params) {
				if (params.hasOwnProperty(prop)) {
					// 値の代わりに関数が入っていた場合評価した結果を用いる
					var target_val;
					if (typeof params[prop] == "function") {
						target_val = params[prop].call(tween.node);
					} else
						target_val = params[prop];

					if (excepted.indexOf(prop) == -1) {
						origin[prop] = tween.node[prop];
						target[prop] = target_val;
					}

					if (prop === "quat") {
						origin[prop] = tween.node.getQuat();
						target[prop] = target_val;
					}
				}
			}
		});

		this.addEventListener(enchant.Event.ACTION_TICK, function(evt) {
			var ratio = tween.easing(tween.frame, 0, 1, tween.time);
			for ( var prop in target) {
				if (target.hasOwnProperty(prop)) {
					if (prop === "quat") {
						var val = origin[prop].slerp(target[prop], ratio);
						tween.node.rotationSet(val);
					} else {
						if (typeof this[prop] === "undefined") {
							continue;
						}
						var val = target[prop] * ratio + origin[prop]
								* (1 - ratio);
						tween.node[prop] = val;
					}
				}
			}
		});
	}
});

enchant.gl.tl.Timeline = enchant.Class.create(enchant.tl.Timeline, {
	initialize : function(node) {
		enchant.tl.Timeline.call(this, node);
	},
	tween : function(params) {
		return this.add(new enchant.gl.tl.Tween(params));
	},
	moveTo : function(x, y, z, time, easing) {
		return this.tween({
			x : x,
			y : y,
			z : z,
			time : time,
			easing : easing
		});
	},
	moveX : function(x, time, easing) {
		return this.tween({
			x : x,
			time : time,
			easing : easing
		});
	},
	moveY : function(y, time, easing) {
		return this.tween({
			y : y,
			time : time,
			easing : easing
		});
	},
	moveZ : function(z, time, easing) {
		return this.tween({
			z : z,
			time : time,
			easing : easing
		});
	},
	moveBy : function(x, y, z, time, easing) {
		return this.tween({
			x : function() {
				return this.x + x
			},
			y : function() {
				return this.y + y
			},
			z : function() {
				return this.z + z
			},
			time : time,
			easing : easing
		});
	},
	scaleTo : function(scale, time, easing) {
		return this.tween({
			scaleX : scale,
			scaleY : scale,
			scaleZ : scale,
			time : time,
			easing : easing
		});
	},
	scaleXYZTo : function(scaleX, scaleY, scaleZ, time, easing) {
		return this.tween({
			scaleX : scaleX,
			scaleY : scaleY,
			scaleZ : scaleZ,
			time : time,
			easing : easing
		});
	},
	scaleBy : function(scale, time, easing) {
		return this.tween({
			scaleX : function() {
				return this.scaleX * scale
			},
			scaleY : function() {
				return this.scaleY * scale
			},
			scaleZ : function() {
				return this.scaleZ * scale
			},
			time : time,
			easing : easing
		})
	},
	scaleXYZBy : function(scaleX, scaleY, scaleZ, time, easing) {
		return this.tween({
			scaleX : function() {
				return this.scaleX * scaleX
			},
			scaleY : function() {
				return this.scaleY * scaleY
			},
			scaleZ : function() {
				return this.scaleZ * scaleZ
			},
			time : time,
			easing : easing
		})
	},
	rotateTo : function(quat, time, easing) {
		return this.tween({
			quat : quat,
			time : time,
			easing : easing
		});
	},
	rotateBy : function(quat, time, easing) {
		return this.tween({
			quat : this.node.getQuat().multiply(quat),
			time : time,
			easing : easing
		});
	},
	rotatePitchTo : function(angle, time, easing) {
		return this.rotateTo(new Quat(1, 0, 0, angle), time, easing);
	},
	rotateYawTo : function(angle, time, easing) {
		return this.rotateTo(new Quat(0, 1, 0, angle), time, easing);
	},
	rotateRollTo : function(angle, time, easing) {
		return this.rotateTo(new Quat(0, 0, 1, angle), time, easing);
	},
	rotatePitchBy : function(angle, time, easing) {
		return this.rotateBy(new Quat(1, 0, 0, angle), time, easing);
	},
	rotateYawBy : function(angle, time, easing) {
		return this.rotateBy(new Quat(0, 1, 0, angle), time, easing);
	},
	rotateRollBy : function(angle, time, easing) {
		return this.rotateBy(new Quat(0, 0, 1, angle), time, easing);
	}
});
