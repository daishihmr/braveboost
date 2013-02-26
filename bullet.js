/**
 * 自機バルカン弾を初期化してプールする.
 */
function setupBullets(count) {
	if (count == undefined) {
		count = 30;
	}
	var bullet = (function() {
		var result = new Sprite3D();
		var body = new Cube();
		body.scale(0.04, 0.04, 0.8)
		body.mesh.texture.ambient = [ 1.0, 1.0, 1.0, 1.0 ];
		result.addChild(body);
		return result;
	})();
	for ( var i = 0; i < count; i++) {
		var b = bullet.clone();
		b.bounding = new AABB();
		b.bounding.scale = 0.1;

		b.init = function() {
			var m = MyGame.myship;
			var gunPos = m.rollAngle + m.vulcanRL * Math.PI / 2;
			this.x = m.x + Math.sin(gunPos) * -0.06;
			this.y = m.y + Math.cos(gunPos) * -0.06;
			this.z = m.z + 0.3;
			this.rotationSet(new Quat(1, 0, 0, 0));
			this.rotatePitch(random(m.accuracy) - (m.accuracy / 2));
		};

		b.addEventListener("enterframe", function(e) {
			if (this.active == false) {
				return;
			}

			this.forward(MyGame.myship.bulletSpeed);
			if (!this.inScreen()) {
				this.remove();
				MyGame.bullets.dispose(this);
				return;
			}

			// 衝突判定
			var self = this;
			MyGame.enemyList.forEach(function(enemy) {
				if (self.active) {
					if (enemy.intersect(self)) {
						enemy.damage(1);
						self.remove();
						MyGame.bullets.dispose(self);
					}
				}
			});
		});
		MyGame.bullets.pool(b);
	}
}

/**
 * 自機ボムを初期化してプールする.
 */
function setupBombs(count) {
	var m = MyGame.myship;
	var expPool = MyGame.bombExps;
	var bombPool = MyGame.bombs;

	if (count == undefined) {
		count = 30;
	}
	var bomb = new Sphere(0.1);
	for ( var i = 0; i < count; i++) {
		// 爆風
		var exp = new Sprite3D();
		exp.init = function(x, y, z, radius) {
			this.bounding.threshold = 0.0001;
			this.bounding.radius = radius;
			this.age = 0;
			this.x = x;
			this.y = y;
			this.z = z;
			MyGame.explodeBomb(this, radius * 4.0);
		};
		exp.addEventListener("enterframe", function() {
			// 敵との衝突判定
			var self = this;
			MyGame.enemyList.forEach(function(enemy) {
				if (self.active) {
					if (enemy.intersect(self)) {
						enemy.damage(0.3);
					}
				}
			});

			// 敵弾との衝突判定
			[ MyGame.enemyBullets, MyGame.enemyBulletsG, MyGame.enemyBulletsB,
					MyGame.enemyBulletsY ].forEach(function(pool) {
				pool.forEach(function(eb) {
					if (self.active) {
						if (eb.defendable && eb.intersect(self)) {
							eb.remove();
							pool.dispose(eb);
						}
					}
				});
			});

			if (this.age >= 24) {
				this.remove();
				expPool.dispose(this);
				return;
			}
		});
		MyGame.game.addEventListener("restart", function() {
			if (exp.active) {
				exp.remove();
				expPool.dispose(exp);
			}
		});
		m.addEventListener("kill", function() {
			exp.bounding.threshold = -1;
		});
		expPool.pool(exp);

		// 爆弾
		var b = bomb.clone();
		b.bounding.radius = 0.2; // 近接信管反応距離
		b.init = function(direction, radius) {
			this.age = 0;
			this.x = m.x;
			this.y = m.y;
			this.z = m.z;
			this.radius = radius; // 爆風の半径
			this.time = 20; // 時限信管起爆時間
			this.rotationSet(new Quat(1, 0, 0, direction));
		};
		b.explode = function() {
			var self = this;
			expPool.get(function(e) {
				e.init(self.x, self.y, self.z, self.radius);
				self.parentNode.addChild(e);
			});
			this.remove();
			bombPool.dispose(this);
			playSound("explode_bomb.mp3");
		};
		b.addEventListener("enterframe", function() {
			this.forward(0.2);

			this.time--;
			if (this.time <= 0) {
				this.explode();
				return;
			}

			// 画面外に消える
			if (!this.inScreen()) {
				this.explode();
				return;
			}

			// 敵との衝突判定
			var self = this;
			MyGame.enemyList.forEach(function(enemy) {
				if (self.active && enemy.active) {
					if (enemy.intersect(self)) {
						self.explode();
					}
				}
			});
			// 敵弾との衝突判定
			[ MyGame.enemyBullets, MyGame.enemyBulletsG, MyGame.enemyBulletsB,
					MyGame.enemyBulletsY ].forEach(function(pool) {
				pool.forEach(function(eb) {
					if (self.active && eb.active) {
						if (eb.intersect(self)) {
							self.explode();
						}
					}
				});
			});
		});
		m.addEventListener("kill", function() {
			b.remove();
			bombPool.dispose(b);
		});
		MyGame.game.addEventListener("restart", function() {
			if (b.active) {
				b.remove();
				bombPool.dispose(b);
			}
		});
		bombPool.pool(b);
	}
}

/**
 * 敵通常弾を初期化してプールする.
 */
function setupEnemyBullets() {
	function poolBullets(pool, count, image) {
		for ( var i = 0; i < count; i++) {
			var eb = new Sprite3D();
			(function() {
				var bb = new PlaneYZ(0.15);
				bb.mesh.texture.src = MyGame.game.assets[image];
				bb.program = MyGame.effectShader;
				bb._render = function() {
					gl.enable(gl.BLEND);
					gl.blendEquation(gl.FUNC_ADD);
					gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
					gl.disable(gl.DEPTH_TEST);

					this.program.setUniforms(this.scene.getUniforms());
					Sprite3D.prototype._render.apply(this);

					gl.enable(gl.DEPTH_TEST);
					gl.disable(gl.BLEND);
				};
				eb.addChild(bb);
			})();
			eb.bounding.radius = 0.06;
			eb.addEventListener("enterframe", function(e) {
				if (this.active) {
					if (MyGame.level === 0) {
						this.forward(this.speed * 0.75);
					} else if (MyGame.level === 1) {
						this.forward(this.speed);
					} else {
						// 2周目は弾の速さ1.25倍
						this.forward(this.speed * 1.25);
					}

					var self = this;
					if (!this.inWorld()) {
						this.remove();
						pool.dispose(this);
						return;
					}
					if (MyGame.myship.parentNode
							&& this.intersect(MyGame.myship)) {
						MyGame.myship.damage();
						this.remove();
						pool.dispose(this);
						return;
					}

					// 加速
					this.speed += this.accel;
				}
			});
			pool.pool(eb);
		}
	}

	poolBullets(MyGame.enemyBullets, 100, "images/bullet_red.png");
	poolBullets(MyGame.enemyBulletsG, 100, "images/bullet_green.png");
	poolBullets(MyGame.enemyBulletsB, 100, "images/bullet_blue.png");
	poolBullets(MyGame.enemyBulletsY, 100, "images/bullet_yellow.png");
}

var Laser = {};

/**
 * 自機からレーザーを照射する.
 */
Laser.laserOn = function() {
	var myship = MyGame.myship;
	myship.isLaseOn = true;

	if (!myship.laser) {
		// 等間隔に攻撃判定のある空Sprite3Dを並べる
		myship.laser = [];
		for ( var i = 0, end = VIEWPORT_H * 2; i < end; i += 0.5) {
			var l = new Sprite3D();
			l.index = i;
			l.active = false;
			l.bounding.radius = 0.1;
			l.addEventListener("enterframe", function() {
				if (this.active) {
					var lv = myship.subweaponLevel;
					this.bounding.radius = (lv * 2 + 3) * 0.05;
					this.x = myship.x;
					this.y = myship.y;
					this.z = myship.z + 0.7 + this.index;

					var self = this;
					MyGame.enemyList.forEach(function(enemy) {
						if (enemy.inScreen() && !enemy.laserMuteki
								&& enemy.intersect(self)) {
							enemy.damage((lv + 1) * 0.30);

							// 一度食らわせた敵はレーザーに対して無敵化する
							// レーザー無敵化フラグは毎フレーム開始時にoffにすること
							enemy.laserMuteki = true;
						}
					});
				}
			});
			l.showBounding();
			myship.laser.push(l);
		}
	}

	for ( var i = 0, end = myship.laser.length; i < end; i++) {
		if (!myship.laser[i].active) {
			if (i === 0) {
				playSound("laser.mp3");
			}
			myship.laser[i].active = true;
			myship.parentNode.addChild(myship.laser[i]);
		}
	}

}
/**
 * レーザー照射を解除する.
 */
Laser.laserOff = function() {
	var myship = MyGame.myship;
	myship.isLaseOn = false;
	if (!myship.laser) {
		return;
	}
	for ( var i = 0, end = myship.laser.length; i < end; i++) {
		if (myship.laser[i].active) {
			myship.laser[i].active = false;
			myship.laser[i].remove();
		}
	}
}
