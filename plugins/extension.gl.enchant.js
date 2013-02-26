/** 名前空間. */
enchant.gl.extension = {};

/**
 * 3Dワールド座標を2Dスクリーン座標に変換.
 */
enchant.gl.extension.screenCoord = function(x, y, z) {
	function mul(m1, m2) {
		return mat4.multiply(m1, m2, mat4.create());
	}

	var game = enchant.Game.instance;
	var camera = game.currentScene3D.getCamera();

	// プロジェクション行列
	var pm = mat4.perspective(20, game.width / game.height, 1.0, 1000.0);

	// ビュー行列
	var vm = mat4.lookAt([ camera._x, camera._y, camera._z ], [
			camera._centerX, camera._centerY, camera._centerZ ], [
			camera._upVectorX, camera._upVectorY, camera._upVectorZ ]);

	var v = [ x, y, z, 1 ];
	var sc = mat4.multiplyVec4(mul(pm, vm), [ x, y, z, 1 ]);

	var scX = (1 - (-sc[0] / sc[3])) * (game.width / 2);
	var scY = (1 - (sc[1] / sc[3])) * (game.height / 2);

	return {
		x : scX,
		y : scY
	};
};

/**
 * 回転行列をクォータニオンに変換.
 */
enchant.gl.extension.mat4ToQuat = function(m, q) {
	if (!q) {
		q = quat4.create();
	}

	var s;
	var tr = m[0] + m[5] + m[10] + 1.0;
	if (tr >= 1.0) {
		s = 0.5 / Math.sqrt(tr);
		q[0] = -(m[6] - m[9]) * s;
		q[1] = -(m[8] - m[2]) * s;
		q[2] = -(m[1] - m[4]) * s;
		q[3] = 0.25 / s;
		// console.log(1);
	} else {
		var max;
		if (m[5] > m[10]) {
			max = m[5];
		} else {
			max = m[10];
		}

		if (max < m[0]) {
			s = Math.sqrt(m[0] - (m[5] + m[10]) + 1.0);
			var x = s * 0.5;
			s = 0.5 / s;
			q[0] = -x;
			q[1] = -(m[1] + m[4]) * s;
			q[2] = -(m[8] + m[2]) * s;
			q[3] = (m[6] - m[9]) * s;
			// console.log(2);
		} else if (max == m[5]) {
			s = Math.sqrt(m[5] - (m[10] + m[0]) + 1.0);
			var y = s * 0.5;
			s = 0.5 / s;
			q[0] = -(m[1] + m[4]) * s;
			q[1] = -y;
			q[2] = -(m[6] + m[9]) * s;
			q[3] = (m[8] - m[2]) * s;
			// console.log(3);
		} else {
			s = Math.sqrt(m[10] - (m[0] + m[5]) + 1.0);
			var z = s * 0.5;
			s = 0.5 / s;
			q[0] = -(m[8] + m[2]) * s;
			q[1] = -(m[6] + m[9]) * s;
			q[2] = -z;
			q[3] = (m[1] - m[4]) * s;
			// console.log(4);
		}
	}

	return q;
}

// #################################################################
// #
// # Scene3Dの拡張
// #
// #################################################################

/**
 * 行列を再計算する.
 */
enchant.gl.Scene3D.prototype.refreshMatrix = function() {
	for ( var i = 0, l = this.childNodes.length; i < l; i++) {
		this.childNodes[i].refreshMatrix(this, mat4.identity(mat4.create()));
	}
};

/**
 * シーンからシェーダーに渡すためのUniform変数を抽出する.
 */
enchant.gl.Scene3D.prototype.getUniforms = function() {
	var result = {
		uUseCamera : 1.0,
		uUseDirectionalLight : 1.0
	};
	if (this.directionalLight) {
		result.uLightDirection = [ this.directionalLight.directionX,
				this.directionalLight.directionY,
				this.directionalLight.directionZ ];
		result.uLightColor = this.directionalLight.color;
	}
	if (this.projMat) {
		result.uProjMat = this.projMat;
	} else if (this._camera && this._camera._projMat) {
		result.uProjMat = this._camera._projMat;
	}
	if (this.cameraMat) {
		result.uCameraMat = this.cameraMat;
	} else if (this._camera && this._camera.mat) {
		result.uCameraMat = this._camera.mat;
	}
	if (this._camera) {
		result.uLookVec = [ this._camera._centerX - this._camera._x,
				this._camera._centerY - this._camera._y,
				this._camera._centerZ - this._camera._z ];
	}

	return result;
};

// #################################################################
// #
// # Sprite3Dの拡張
// #
// #################################################################

/**
 * イベントツリーから削除する.
 */
enchant.gl.Sprite3D.prototype.remove = function() {
	if (this.parentNode) {
		this.parentNode.removeChild(this);
	}
};

/**
 * ノードツリーをたどって末端まで、関数を適用する.
 */
enchant.gl.Sprite3D.prototype.applyRecursive = function(f) {
	f(this);
	if (this.childNodes) {
		for ( var i = 0, end = this.childNodes.length; i < end; i++) {
			this.childNodes[i].applyRecursive(f);
		}
	}
};

/**
 * 可視属性.
 */
enchant.gl.Sprite3D.prototype.visible = true;
enchant.gl.Sprite3D.prototype._origDraw = enchant.gl.Sprite3D.prototype._draw;
enchant.gl.Sprite3D.prototype._draw = function() {
	if (this.visible) {
		this._origDraw.apply(this, arguments);
	}
};

/**
 * ワールド座標を返す.
 */
enchant.gl.Sprite3D.prototype.globalCoord = function() {
	function mul(m1, m2) {
		return mat4.multiply(m1, m2, mat4.create());
	}
	function baseMatrix(s3d) {
		if (s3d.parentNode instanceof enchant.gl.Sprite3D) {
			return mul(baseMatrix(s3d.parentNode), s3d.modelMat);
		} else {
			return s3d.modelMat;
		}
	}

	var game = enchant.Game.instance;

	// キャッシュチェック
	if (this.globalCoordCache && this.globalCoordCache.frame === game.frame) {
		return this.globalCoordCache.coord;
	} else {
		this.globalCoordCache = {
			frame : game.frame
		}
	}

	var m = baseMatrix(this)

	this.globalCoordCache.coord = [ m[12], m[13], m[14] ];
	return this.globalCoordCache.coord;
};

/**
 * 現在の姿勢をクォータニオンで取得する.
 */
enchant.gl.Sprite3D.prototype.getQuat = function() {
	var quat = new Quat();
	quat._quat = enchant.gl.extension.mat4ToQuat(this._rotation);
	return quat;
};

/**
 * スクリーン上の座標を返す.
 */
enchant.gl.Sprite3D.prototype.screenCoord = function() {
	var game = enchant.Game.instance;

	// キャッシュチェック
	if (this.screenCoordCache && this.screenCoordCache.frame === game.frame) {
		return this.screenCoordCache.coord;
	} else {
		this.screenCoordCache = {
			frame : game.frame
		}
	}

	var scene = game.currentScene3D;
	if (!scene) {
		return null;
	}

	var g = this.globalCoord();
	this.screenCoordCache.coord = enchant.gl.extension.screenCoord(g[0], g[1],
			g[2]);
	return this.screenCoordCache.coord;
};

/**
 * boudingを可視化.
 * 
 * BSとAABBに対応.
 */
enchant.gl.Sprite3D.prototype.showBounding = function() {
	return; // debug時はコメントアウトする
	if (!this.bounding) {
		return;
	}
	var self = this;
	this._visibleBounding = (function() {
		var b;
		if (self.bounding.type == "BS") {
			b = new Sphere(self.bounding.radius);
		} else if (self.bounding.type == "AABB") {
			b = new Cube(self.bounding.scale);
		}
		b.mesh.texture.ambient = [ 1, 1, 1, 1.0 ];
		b.mesh.texture.diffuse = [ 0, 0, 0, 1.0 ];
		b.mesh.texture.specular = [ 0, 0, 0, 1.0 ];
		b.mesh.setBaseColor([ 0.0, 1.0, 0.0, 0.5 ]);
		b.addEventListener("prerender", function() {
			gl.enable(gl.BLEND);
			gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
			gl.disable(gl.DEPTH_TEST);
			gl.blendEquation(gl.FUNC_ADD);
		});
		b.addEventListener("render", function() {
			gl.enable(gl.DEPTH_TEST);
			gl.disable(gl.BLEND);
		});
		return b;
	})();
	this.addChild(this._visibleBounding);
};
/**
 * boudingを不可視化.
 */
enchant.gl.Sprite3D.prototype.hideBounding = function() {
	if (this._visibleBounding) {
		this._visibleBounding.remove();
		this._visibleBounding = null;
	}
};

/**
 * 行列を再計算する.
 */
enchant.gl.Sprite3D.prototype.refreshMatrix = function(scene, baseMatrix) {
	this.globalCoordCache = null;
	this.screenCoordCache = null;

	this._transform(baseMatrix);
	if (this.childNodes.length) {
		for ( var i = 0, l = this.childNodes.length; i < l; i++) {
			this.childNodes[i].refreshMatrix(scene, this.tmpMat);
		}
	}
};

/**
 * ターゲットの方を向く.
 */
enchant.gl.Sprite3D.prototype.lookAt = function(target) {
	var x = Math.atan2(target.y - this.y, target.z - this.z);
	if (-Math.PI * 0.5 <= x && x < Math.PI * 0.5) {
		this.rotationSet(new Quat(0, 1, 0, x));
		this.rotationApply(new Quat(1, 0, 0, x));
	} else if (x < -Math.PI * 0.5 || Math.PI * 0.5 < x) {
		this.rotationSet(new Quat(0, 1, 0, x));
		this.rotationApply(new Quat(1, 0, 0, Math.PI - x));
	}
};

/**
 * 明るく表示する.
 */
enchant.gl.Sprite3D.prototype.lightOn = function() {
	if (!this.lightOnFlg) {
		this.applyRecursive(function(s) {
			if (s.mesh) {
				if (!s.prl) {
					s.prl = function() {
						this.mesh.texture.emission = [ 0.5, 0.5, 0.5, 1.0 ];
					};
				}
				if (!s.rl) {
					s.rl = function() {
						this.mesh.texture.emission = [ 0.0, 0.0, 0.0, 1.0 ];
					};
				}
				s.addEventListener("prerender", s.prl);
				s.addEventListener("render", s.rl);
			}
		});

		this.lightOnFlg = true;
	}
};

/**
 * 明るく表示を解除.
 */
enchant.gl.Sprite3D.prototype.lightOff = function() {
	if (this.lightOnFlg) {
		this.applyRecursive(function(s) {
			if (s.mesh) {
				s.removeEventListener("prerender", s.prl);
				s.removeEventListener("render", s.rl);
			}
		});
	}
	this.lightOnFlg = false;
};

// #################################################################
// #
// # Quatの拡張
// #
// #################################################################

enchant.gl.Quat.prototype.multiply = function(another) {
	var q = new Quat(0, 0, 0, 0);
	quat4.multiply(this._quat, another._quat, q._quat);
	return q;
};

// 衝突が発生しないBounding
enchant.gl.collision.NONE = enchant.Class.create(enchant.gl.collision.Bounding,
		{
			initialize : function() {
				enchant.gl.collision.Bounding.call(this);
				this.type = 'NONE';
			},
			toBounding : function(another) {
				return point2OBB(another, this);
			},
			toBS : function(another) {
				return BS2OBB(another, this);
			},
			toAABB : function(another) {
				return AABB2OBB(another, this);
			},
			toOBB : function(another) {
				return OBB2OBB(this, another);
			}
		});

// #################################################################
// #
// # primitiveの追加
// #
// #################################################################

enchant.gl.primitive.PlaneXZAnimation = enchant.Class.create(
		enchant.gl.primitive.PlaneXZ, {
			initialize : function(divide, scale) {
				enchant.gl.primitive.PlaneXZ.call(this, scale);
				if (typeof divide != 'undefined') {
					this.divide = divide;
				} else {
					this.divide = 4;
				}
				this.frame = 0;
			},
			frame : {
				get : function() {
					return this._frame;
				},
				set : function(frame) {
					this._frame = frame;
					var left = (frame % this.divide) / this.divide;
					var top = 1 - ((frame / this.divide) | 0) / this.divide;
					var right = left + (1 / this.divide);
					var bottom = top - (1 / this.divide);
					this.mesh.texCoords = [ right, top, left, top, left,
							bottom, right, bottom, right, top, left, top, left,
							bottom, right, bottom ];
				}
			}
		});
