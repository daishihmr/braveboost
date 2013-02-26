/** Sprite3Dが可視範囲にいるか. */
enchant.gl.Sprite3D.prototype.inScreen = function() {
	// return -VIEWPORT_H <= this.z && this.z <= VIEWPORT_H && -VIEWPORT <=
	// this.y
	// && this.y <= VIEWPORT;
	var sc = this.screenCoord();
	return (0 <= sc.x && sc.x < GAME_WIDTH && 0 <= sc.y && sc.y < GAME_HEIGHT);
};
/** Sprite3Dが存在範囲にいるか. */
enchant.gl.Sprite3D.prototype.inWorld = function() {
	return -(VIEWPORT_H + 4) < this.z && this.z < (VIEWPORT_H + 4)
			&& -(VIEWPORT + 4) < this.y && this.y < (VIEWPORT + 4);
};

/**
 * 自動でスクロールするステージ.
 * 
 * 原点(0, 0, 0)がチェックポイントを順に通過していくようにステージ自体が移動・旋回します.<br>
 * チェックポイント間では、ステージは必ずZ軸マイナス方向へ移動します.<br>
 * チェックポイントに到達すると、次のチェックポイントの方向へ旋回します.<br>
 * 旋回はY軸に関してのみ行います。XZ平面における傾きは発生しません.<br>
 * 
 * <h3>ハンドル可能なイベント</h3>
 * <ul>
 * <li>Stage.Event.START スクロール開始時 </li>
 * <li>Stage.Event.ARRIVE チェックポイント到着時</li>
 * <li>Stage.Event.FINISH 最後のチェックポイントに到着時</li>
 * </ul>
 */
var Stage = enchant.Class.create(enchant.gl.Sprite3D, {
	/**
	 * コンストラクタ.
	 * 
	 * @param {!enchant.gl.Sprite3D}
	 *            stageModel ステージのモデルデータ
	 * @param {!Array.
	 *            <Array.<number>>} checkPoints チェックポイントの配列
	 * @param {!number}
	 *            speed スクロール移動速度
	 * @param {!number}
	 *            rotSpeed スクロール旋回速度
	 * @param {?boolean}
	 *            debug trueの場合チェックポイントを表示する
	 */
	initialize : function(stageModel, checkPoints, speed, rotSpeed, debug) {
		enchant.gl.Sprite3D.call(this);
		this.stage = stageModel;
		this.stage._checkPoints = [];
		this.addChild(this.stage);
		for ( var i = 0, end = checkPoints.length; i < end; i++) {
			if (!debug) {
				var p = new Sprite3D();
			} else {
				var p = new Cube(0.01);
				p.mesh.texture.ambient = [ 1, 0, 0, 1 ];
			}
			p.x = checkPoints[i][0];
			p.y = checkPoints[i][1];
			p.z = checkPoints[i][2];
			this.stage.addChild(p);
			this.stage._checkPoints.push(p);
		}

		this.speed = speed;
		this.rotSpeed = rotSpeed;
	},
	/**
	 * スクロールを開始する.
	 */
	start : function(startPoint) {
		if (!startPoint) {
			startPoint = 0;
		}
		this.moving = true;
		this.turning = false;

		this.lastPoint = startPoint;
		this.finished = false;

		this.stage.rotationSet(new Quat(0, 1, 0, 0));

		this.stage.scene.refreshMatrix();
		var sp = this.stage._checkPoints[this.lastPoint];
		var np = this.stage._checkPoints[this.lastPoint + 1];
		var start = sp.globalCoord();
		var next = np.globalCoord();

		var vec = vec3.create([ next[0] - start[0], next[1] - start[1],
				next[2] - start[2] ]);
		this.yaw = -Math.atan2(vec[0], vec[2]);

		this.stage.rotateYaw(this.yaw);

		this.stage.scene.refreshMatrix();
		var pos = this.stage._checkPoints[this.lastPoint].globalCoord();
		this.translate(-pos[0], -pos[1], -pos[2]);

		this.addEventListener("enterframe", this._enterframeListener);

		this.dispatchEvent(new Event(Stage.Event.START));
	},
	/**
	 * @private
	 */
	_enterframeListener : function() {
		// 終了判定
		if (this.lastPoint == this.stage._checkPoints.length - 1) {
			this.finished = true;
			this.removeEventListener("enterframe", this._enterframeListener);
			this.dispatchEvent(new Event(Stage.Event.FINISH));
			return;
		}

		if (this.moving) {
			// 移動

			var np = this.stage._checkPoints[this.lastPoint + 1];
			var next = np.globalCoord();
			var dist = vec3.length(next);
			if (dist > this.speed) {
				var v = vec3.normalize(next, []);
				vec3.scale(v, -this.speed);
				this.translate(v[0], v[1], v[2]);
			} else {
				this.translate(-next[0], -next[1], -next[2]);
				// this.moving = false;
				this.turning = true;
				this.lastPoint += 1;

				var event = new Event(Stage.Event.ARRIVE);
				event.x = np.x;
				event.y = np.y;
				event.z = np.z;
				event.index = this.lastPoint;
				this.dispatchEvent(event);
			}
		}

		if (this.turning) {
			// 旋回

			var lp = this.stage._checkPoints[this.lastPoint];
			var np = this.stage._checkPoints[this.lastPoint + 1];
			if (!np) {
				return;
			}
			var last = lp.globalCoord();
			var next = np.globalCoord();

			var vec = vec3.create([ next[0] - last[0], next[1] - last[1],
					next[2] - last[2] ]);
			var yaw = Math.atan2(vec[0], vec[2]);
			if (yaw < -this.rotSpeed) {
				yaw = this.rotSpeed;
			} else if (yaw > this.rotSpeed) {
				yaw = -this.rotSpeed;
			} else {
				yaw *= -1;
				this.moving = true;
				this.turning = false;
			}
			this.yaw += yaw;

			var m = mat4.identity(mat4.create());
			mat4.translate(m, [ lp.x, lp.y, lp.z ]);
			mat4.rotateY(m, yaw);
			mat4.translate(m, [ -lp.x, -lp.y, -lp.z ]);

			mat4.multiply(this.stage.modelMat, m);
		}
	},
	/**
	 * 現在の向きを返す.
	 * 
	 * @returns {number} Y軸の回転角度
	 */
	getRotationY : function() {
		return this.yaw;
	}
});

Stage.Event = {};
Stage.Event.START = "stage.start";
Stage.Event.ARRIVE = "stage.arrive";
Stage.Event.FINISH = "stage.finish";

/**
 * モデルデータ内のマーカーからチェックポイントを抽出する.
 * 
 * @static
 * @param stageModel
 *            モデルデータ
 * @param debug
 *            falseの場合、マーカーを非表示にする
 * @returns {Array.<Array.<number>>} チェックポイントの配列
 */
Stage.scanCheckPoints = function(stageModel, debug) {
	var pattern = /cp_(\d+(\.\d+)?)/;
	var _points = [];
	stageModel.applyRecursive(function(node) {
		if (node.mesh && node.name) {
			var m = node.name.match(pattern);
			if (m && m.length > 0) {
				_points[_points.length] = {
					index : Number(m[1]),
					point : [ node.mesh.vertices[0], node.mesh.vertices[1],
							node.mesh.vertices[2] ]
				};
				node.visible = !!debug;
			}
		}
	});

	_points.sort(function(a, b) {
		return a.index - b.index;
	});

	var result = [];
	for ( var i = 0, end = _points.length; i < end; i++) {
		if (_points[i]) {
			result[result.length] = _points[i].point;
		}
	}
	return result;
};

/**
 * マーカー.
 */
var Marker = enchant.Class.create(enchant.gl.Sprite3D, {
	initialize : function(name, x, y, z) {
		enchant.gl.Sprite3D.apply(this);
		this.name = name;
		var m = new Mesh();
		m.vertices = [ x, y, z, x, y, z, x, y, z ];
		m.normals = [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
		m.texCoords = [ 0, 0, 0, 0, 0, 0 ];
		m.indices = [ 0, 1, 2 ];
		m.setBaseColor("#000000");
		this.mesh = m;
		this.visible = false;
	}
});

/**
 * 敵クラス.
 */
var Enemy = enchant.Class.create(enchant.gl.Sprite3D, {
	/**
	 * コンストラクタ.
	 * 
	 * @param dataStore
	 *            {Object} 敵のデータベース
	 * @param type
	 *            {number} dataStoreのキー
	 */
	initialize : function(dataStore, type) {
		enchant.gl.Sprite3D.apply(this);
		this.name = dataStore[type].name;
		this.body = dataStore[type].model.clone();
		this.addChild(this.body);
		this.type = type;
		this.init = dataStore[type].init;
		if (!this.init) {
			this.init = function() {
			};
		}
		this.act = dataStore[type].act;
		if (!this.act) {
			this.act = function() {
			};
		}
		this.muteki = false;

		// デフォルト設定(一般的ザコ)
		this.hp = 1;
		this.score = 100;
		this.explosionType = 0;
		this.explosionSize = 2.0;
		this.bounding.radius = 0.5; // 当たり判定半径

		// enterframeイベントのリスナ
		this.addEventListener("enterframe", function(e) {
			if (this.active) {
				if (this.act) {
					this.act();
				}

				// 有効範囲外に出たら削除
				if (!this.inWorld()) {
					this.remove();
					return;
				}
			}
		});
	},
	/**
	 * ダメージを受ける.
	 */
	damage : function(dmg) {
		if (this.muteki) {
			return;
		}
		if (MyGame.level === 0) { // レベルEASYだとダメージ1.5倍
			dmg *= 1.5;
		} else if (MyGame.level === 2) { // レベルHARDだとダメージ0.75倍
			dmg *= 0.75;
		}
		this.hp -= dmg;
		if (this.hp <= 0) { // HPが0以下になったら撃破される
			this.kill();
		} else {
			// 明るく表示
			this.lightOn();
			// 1フレーム後、明るく表示したのをやめる
			this.lastDamagedAge = this.age;
			this.addEventListener("enterframe", function() {
				if (this.age == this.lastDamagedAge + 1) {
					this.lightOff();
					this.removeEventListener("enterframe", arguments.callee);
				}
			});
		}
	},
	/**
	 * 撃破される.
	 */
	kill : function() {
		this.dispatchEvent(new Event("kill")); // killイベント発生
		this.lightOff();

		if (this.score > 0) {
			// メガレート計算
			var megaRate = 1;
			if (this.intersect(MyGame.myship.x32)) {
				megaRate = 32;
				MyGame.effectX32(this);
			} else if (this.intersect(MyGame.myship.x16)) {
				megaRate = 16;
				MyGame.effectX16(this);
			} else if (this.intersect(MyGame.myship.x8)) {
				megaRate = 8;
				MyGame.effectX8(this);
			} else if (this.intersect(MyGame.myship.x4)) {
				megaRate = 4;
				MyGame.effectX4(this);
			}
			MyGame.game.incrScore(this.score * megaRate);
		}

		switch (this.explosionType) { // 爆発
		case -1: // 爆発を表示しない
			break;
		case 0: // 小爆発
			MyGame.explode(this, this.explosionSize);
			playSound("explode.mp3");
			break;
		case 1: // 大爆発
			MyGame.explodeLarge(this, this.explosionSize * 2);
			playSound("explode_large.mp3");
			break;
		case 2: // 血飛沫
			MyGame.chishibuki(this, this.explosionSize);
			playSound("explode.mp3");
			break;
		}

		this.remove();
	},
	remove : function() {
		this.dispatchEvent(new Event("remove")); // 削除イベント発生

		// super.remove
		enchant.gl.Sprite3D.prototype.remove.apply(this);

		this.tl.clear();
		MyGame.enemyPools[this.type].dispose(this);
		MyGame.enemyList.remove(this);
	}
});

/**
 * 敵キャラに関するユーティリティ.
 */
var EnemyUtil = {
	/** 銃口位置のデフォルト値 */
	_gun : function(g) {
		if (!g) {
			return {
				x : 0,
				y : 0,
				z : 0
			}
		} else {
			return g;
		}
	},
	/**
	 * ショットのオプション
	 */
	_option : function(o) {
		var result = o;
		if (!result) {
			result = {};
		}
		/** speed. 弾の速さ */
		if (!result.speed) {
			result.speed = 0.15;
		}
		/** accel. 加速度 */
		if (!result.accel) {
			result.accel = 0;
		}
		/** color. 色 */
		if (!result.color) {
			result.color = "red";
		}
		/** 見た目の大きさ */
		if (!result.radius) {
			result.radius = 1.0;
		}
		/** レーザーの太さ */
		if (!result.width) {
			result.width = 0.4;
		}
		/** 防御可能 */
		if (result.defendable === undefined) {
			result.defendable = true;
		}
		return result;
	},
	getPool : function(color) {
		if (color === "green") {
			return MyGame.enemyBulletsG;
		} else if (color === "blue") {
			return MyGame.enemyBulletsB;
		} else if (color === "yellow") {
			return MyGame.enemyBulletsY;
		} else {
			return MyGame.enemyBullets;
		}
	},
	/**
	 * 自機狙い弾を発射.
	 * 
	 * @param enemy
	 *            {Enemy} 弾を撃つ敵
	 * @param gun
	 *            {Object} 銃口位置
	 */
	shot : function(enemy, gun, option) {
		if (!enemy || !enemy.parentNode || !enemy.inScreen()) {
			return;
		}
		gun = this._gun(gun);
		option = this._option(option);
		var t = Math.atan2(MyGame.myship.y - (enemy.y + gun.y), MyGame.myship.z
				- (enemy.z + gun.z));
		this.getPool(option.color).get(function(b) {
			b.x = enemy.x + gun.x;
			b.y = enemy.y + gun.y;
			b.z = enemy.z + gun.z;
			b.speed = option.speed;
			b.accel = option.accel;
			b.defendable = option.defendable;
			b.scaleX = b.scaleY = b.scaleZ = option.radius;
			b.bounding.radius = 0.06 * option.radius;
			b.rotationSet(new Quat(0, 0, 0, 0));
			b.rotatePitch(t);
			if (!option.needle) {
				var m = b.childNodes[0];
				m.scaleX = m.scaleY = m.scaleZ = 1.0;
			} else {
				var m = b.childNodes[0];
				m.scaleX = 1.5;
				m.scaleY = 0.3;
				m.scaleZ = 1.5;
			}
			enemy.scene.bulletLayer.addChild(b);
		});
	},
	/**
	 * 自機狙いN-Way弾を発射.
	 * 
	 * @param enemy
	 *            {Enemy} 弾を撃つ敵
	 * @param gun
	 *            {Object} 銃口位置
	 */
	shotNway : function(enemy, gun, n, spc, option) {
		if (!enemy || !enemy.parentNode || !enemy.inScreen()) {
			return;
		}
		gun = this._gun(gun);
		option = this._option(option);
		var t = Math.atan2(MyGame.myship.y - (enemy.y + gun.y), MyGame.myship.z
				- (enemy.z + gun.z));
		var z = (n - 1) / 2 * -spc;
		for ( var i = 0; i < n; i++) {
			this.getPool(option.color).get(function(b) {
				b.x = enemy.x + gun.x;
				b.y = enemy.y + gun.y;
				b.z = enemy.z + gun.z;
				b.speed = option.speed;
				b.accel = option.accel;
				b.defendable = option.defendable;
				b.scaleX = b.scaleY = b.scaleZ = option.radius;
				b.bounding.radius = 0.06 * option.radius;
				b.rotationSet(new Quat(1, 0, 0, t + z));
				if (!option.needle) {
					var m = b.childNodes[0];
					m.scaleX = m.scaleY = m.scaleZ = 1.0;
				} else {
					var m = b.childNodes[0];
					m.scaleX = 1.5;
					m.scaleY = 0.3;
					m.scaleZ = 1.5;
				}
				enemy.scene.bulletLayer.addChild(b);
			});
			z += spc;
		}
	},
	/**
	 * 自機狙い3Way弾を発射.
	 * 
	 * @param enemy
	 *            {Enemy} 弾を撃つ敵
	 * @param gun
	 *            {Object} 銃口位置
	 */
	shot3way : function(enemy, gun, option) {
		this.shotNway(enemy, gun, 3, 0.4, option);
	},
	/**
	 * 射出方向を指定して通常弾を発射.
	 * 
	 * @param enemy
	 *            {Enemy} 弾を撃つ敵
	 * @param theta
	 *            {number} 発射方向(自機進行方向を0とし、反時計回り)
	 * @param gun
	 *            {Object} 銃口位置
	 */
	directionalShot : function(enemy, theta, gun, option) {
		if (!enemy || !enemy.parentNode || !enemy.inScreen()) {
			return;
		}
		gun = this._gun(gun);
		option = this._option(option);
		this.getPool(option.color).get(function(b) {
			b.x = enemy.x + gun.x;
			b.y = enemy.y + gun.y;
			b.z = enemy.z + gun.z;
			b.speed = option.speed;
			b.accel = option.accel;
			b.defendable = option.defendable;
			b.scaleX = b.scaleY = b.scaleZ = option.radius;
			b.bounding.radius = 0.06 * option.radius;
			b.rotationSet(new Quat(1, 0, 0, theta));
			if (!option.needle) {
				var m = b.childNodes[0];
				m.scaleX = m.scaleY = m.scaleZ = 1.0;
			} else {
				var m = b.childNodes[0];
				m.scaleX = 1.5;
				m.scaleY = 0.3;
				m.scaleZ = 1.5;
			}
			enemy.scene.bulletLayer.addChild(b);
		});
	},
	parabolaShot : function(enemy, initialZ, scale, initialY, rangeY, gun) {
		if (!enemy.inScreen()) {
			return null;
		}
		if (!scale) {
			scale = 0.1;
		}

		gun = this._gun(gun);

		var G = vec3.create([ 0, -0.005, 0 ]);
		var bullet = new Billboard(scale);
		bullet.bounding.radius = scale;
		bullet.mesh.texture.src = MyGame.game.assets["images/bullet_green.png"];
		bullet.frame = 0;
		bullet.x = enemy.x + gun.x;
		bullet.y = enemy.y + gun.y;
		bullet.z = enemy.z + gun.z;
		bullet.program = MyGame.effectShader;
		bullet._render = function() {
			gl.enable(gl.BLEND);
			gl.blendEquation(gl.FUNC_ADD);
			gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
			gl.disable(gl.DEPTH_TEST);

			this.program.setUniforms(this.scene.getUniforms());
			Sprite3D.prototype._render.apply(this);

			gl.enable(gl.DEPTH_TEST);
			gl.disable(gl.BLEND);
		};
		if (!initialY) {
			initialY = 0.1;
		}
		if (!rangeY) {
			rangeY = 0.05;
		}
		bullet.vec = vec3.create([ 0, random(initialY, rangeY), initialZ ]);
		bullet.addEventListener("enterframe", function() {
			if (MyGame.myship.parentNode && this.intersect(MyGame.myship)) {
				MyGame.myship.damage();
				this.remove();
				return;
			}
			this.x += this.vec[0];
			this.y += this.vec[1];
			this.z += this.vec[2];
			this.vec = vec3.add(this.vec, G);

			if (!this.inWorld()) {
				this.remove();
				return;
			}
		});
		MyGame.myship.addEventListener("restart", function() {
			if (bullet.parentNode) {
				bullet.remove();
			}
			this.removeEventListener("restart", arguments.callee);
		});
		enemy.scene.bulletLayer.addChild(bullet);
		return bullet;
	},

	laserOn : function(id, enemy, theta, gun, option) {
		gun = this._gun(gun);
		option = this._option(option);

		// 判定
		var initialPosition = {
			x : enemy.x,
			y : enemy.y,
			z : enemy.z
		};
		var p = {
			x : enemy.x + gun.x,
			y : enemy.y + gun.y,
			z : enemy.z + gun.z,
			inScreen : function() {
				return -VIEWPORT_H <= this.z && this.z <= VIEWPORT_H
						&& -VIEWPORT <= this.y && this.y <= VIEWPORT;
			}
		};
		var laserArray = [];
		var m = MyGame.myship;
		while (p.inScreen()) {
			p.y += Math.sin(theta) * option.width;
			p.z += Math.cos(theta) * option.width;
			var l = new Sprite3D();
			// var l = new Sphere(option.width);
			l.x = l.initialX = p.x;
			l.y = l.initialY = p.y;
			l.z = l.initialZ = p.z;
			l.bounding.radius = option.width;
			laserArray[laserArray.length] = l;
			l.addEventListener("enterframe", function() {
				this.x = this.initialX + (enemy.x - initialPosition.x);
				this.y = this.initialY + (enemy.y - initialPosition.y);
				this.z = this.initialZ + (enemy.z - initialPosition.z);

				if (this.intersect(m)) {
					m.damage();
				}
			});

			enemy.parentNode.addChild(l);
		}
		m.addEventListener("restart", function() {
			EnemyUtil.laserOff(id, enemy);
			this.removeEventListener("restart", arguments.callee);
		});

		// レーザーモデル
		var laserModel = (function() {
			var game = MyGame.game;
			var img = game.assets["images/laser_blue1.png"];
			var img2 = game.assets["images/laser_blue2.png"];
			var l1 = game.assets["model/laser_blue1.l3p.js"].clone();
			var l2 = game.assets["model/laser_blue2.l3p.js"].clone();
			var l3 = game.assets["model/laser_blue3.l3p.js"].clone();
			l1.applyRecursive(function(node) {
				if (node.mesh) {
					node.mesh.texture.src = img;
				}
			});
			l1.addEventListener("enterframe", function() {
				var s = 1.0 + random(0.5);
				this.scaleX = s;
				this.scaleY = s;
				this.scaleZ = s;
			});
			l2.applyRecursive(function(node) {
				if (node.mesh) {
					node.mesh.texture.src = img;
				}
			});
			l2.addEventListener("enterframe", function() {
				this.scaleZ = 1.0 + random();
			});
			l3.applyRecursive(function(node) {
				if (node.mesh) {
					node.mesh.texture.src = img2;
				}
			});
			l3.addEventListener("enterframe", function() {
				var s = 0.7 + random(0.2);
				this.scaleX = s;
				this.scaleY = s;
				this.scaleZ = 1.0 + random();
			});

			var laser = new Sprite3D();
			laser.addChild(l3);
			laser.addChild(l2);
			laser.addChild(l1);
			laser.applyRecursive(function(node) {
				node.program = MyGame.effectShader;
				node._render = function() {
					gl.disable(gl.DEPTH_TEST);
					gl.enable(gl.BLEND);
					gl.blendEquation(gl.FUNC_ADD);
					gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

					this.program.setUniforms(this.scene.getUniforms());
					Sprite3D.prototype._render.apply(this);

					gl.disable(gl.BLEND);
					gl.enable(gl.DEPTH_TEST);
				};
			});
			laser.z += 0.4;
			laser.addEventListener("enterframe", function() {
				this.x = enemy.x + gun.x;
				this.y = enemy.y + gun.y;
				this.z = enemy.z + 0.2 + gun.z;
			});
			return laser;
		})();

		laserModel.x = enemy.x + gun.x;
		laserModel.y = enemy.y + gun.y;
		laserModel.z = enemy.z + 0.2 + gun.z;
		laserModel.rotationSet(new Quat(1, 0, 0, theta));

		laserModel.scaleX = 0.1;
		laserModel.scaleY = 0.1;
		laserModel.scaleZ = 20;
		laserModel.tl.scaleXYZTo(option.width * 18, option.width * 18, 20, 3);

		enemy.scene.effectLayer.addChild(laserModel);

		if (!enemy._laser) {
			enemy._laser = [];
		}
		if (!enemy._laser[id]) {
			enemy._laser[id] = {};
		}
		enemy._laser[id]._laserArray = laserArray;
		enemy._laser[id]._laserModel = laserModel;
	},
	laserOff : function(id, enemy) {
		if (enemy._laser && enemy._laser[id]) {
			if (enemy._laser[id]._laserArray) {
				enemy._laser[id]._laserArray.forEach(function(l) {
					l.remove();
				});
				enemy._laser[id]._laserArray = [];
			}
			if (enemy._laser[id]._laserModel) {
				enemy._laser[id]._laserModel.tl.scaleXYZTo(0.1, 0.1, 20, 3)
						.then(function() {
							this.remove();
						});
				enemy._laser[id]._laserModel = null;
			}
		}
	}
};
