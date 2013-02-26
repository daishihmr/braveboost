function setupEnemies() {
	var game = MyGame.game;
	var gainsBurst = function(gains) {
		// 放射弾
		if (MyGame.level === 0) {
			var r = 4;
		} else if (MyGame.level === 1) {
			var r = 8;
		} else {
			var r = 16;
		}
		for ( var i = 0; i < r; i++) {
			var t = (Math.PI * 2) / r * (i + 0.5);
			EnemyUtil.directionalShot(gains, t);
		}
	};

	var es = enchant.Easing;
	MyGame.enemyData = {
		midoriF : {
			name : "ミドリさんF",
			model : game.assets["model/enemy1.l3p.js"],
			init : function(x, y, z) {
				this.age = 0;
				this.hp = 0.1;
				this.x = x;
				this.y = y;
				this.z = z;
				this.rotationSet(new Quat(0, 0, 0, 0));

				if (MyGame.level > 1) {
					this.clearEventListener("kill");
					this.addEventListener("kill", function() {
						EnemyUtil.shot(this);
					});
				}
			},
			act : function() {
				var ca = Math.PI * 0.25;
				var cb = Math.PI * -1.24;
				var cc = Math.PI * 0.50;
				if (this.y < 0) {
					ca *= -1;
					cb *= -1;
					cc *= -1;
				}

				this.forward(-0.12);
				if (this.age === 10) {
					this.tl.//
					rotatePitchTo(ca, 10, es.BACK_EASEIN).//
					delay(10).//
					rotatePitchTo(cb, 60).//
					delay(15).//
					rotatePitchTo(cc, 10).//
					rotatePitchBy(0, 10, es.BACK_EASEIN).//
					delay(1);
				}

				if (this.age % 15 === 0 && random(6) < MyGame.level) {
					EnemyUtil.shot(this);
				}
			}
		},
		midoriF2 : {
			name : "ミドリさんF2",
			model : game.assets["model/enemy1.l3p.js"],
			init : function(x, y, z) {
				this.age = 0;
				this.hp = 0.1;
				this.x = x;
				this.y = y;
				this.z = z;
				this.rotationSet(new Quat(0, 0, 0, 0));

				if (MyGame.level > 1) {
					this.clearEventListener("kill");
					this.addEventListener("kill", function() {
						EnemyUtil.shot(this);
					});
				}
			},
			act : function() {
				var ca = Math.PI * -0.25;
				var cb = Math.PI * 1.00;
				var cc = Math.PI * -0.50;
				if (this.y < 0) {
					ca *= -1;
					cb *= -1;
					cc *= -1;
				}

				this.forward(-0.12);
				if (this.age === 10) {
					this.tl.//
					rotatePitchTo(ca, 10, es.BACK_EASEIN).//
					delay(10).//
					rotatePitchTo(cb, 60).//
					delay(15).//
					rotatePitchTo(cc, 10).//
					rotatePitchBy(0, 10, es.BACK_EASEIN).//
					delay(1);
				}

				if (this.age % 15 === 0 && random(6) < MyGame.level) {
					EnemyUtil.shot(this);
				}
			}
		},
		midoriGD : {
			name : "ミドリさんGD",
			model : game.assets["model/enemy1.l3p.js"],
			init : function(x, y, z) {
				this.age = 0;
				this.hp = 0.1;
				this.x = x;
				this.y = y;
				this.z = z;
				this.rotationSet(new Quat(0, 0, 0, 0));

				if (MyGame.level > 1) {
					this.clearEventListener("kill");
					this.addEventListener("kill", function() {
						EnemyUtil.shot(this);
					});
				}
			},
			act : function() {
				var ca = Math.PI * -0.50;
				var cb = Math.PI * 0.00;
				var cc = Math.PI * 0.75;
				if (this.y < 0) {
					ca *= -1;
					cb *= -1;
					cc *= -1;
				}

				this.forward(-0.12);
				if (this.age === 10) {
					this.tl.//
					rotatePitchTo(ca, 20, es.BACK_EASEIN).//
					delay(2).//
					rotatePitchTo(cb, 5, es.BACK_EASEIN).//
					delay(10).//
					rotatePitchTo(cc, 20, es.BACK_EASEIN).//
					delay(50).//
					rotatePitchBy(0, 20, es.BACK_EASEIN).//
					delay(1);
				}

				if (this.age % 15 === 0 && random(6) < MyGame.level) {
					EnemyUtil.shot(this);
				}
			}
		},
		midoriGA : {
			name : "ミドリさんGA",
			model : game.assets["model/enemy1.l3p.js"],
			init : function(x, y, z) {
				this.age = 0;
				this.hp = 0.1;
				this.x = x;
				this.y = y;
				this.z = z;
				this.rotationSet(new Quat(0, 0, 0, 0));

				if (MyGame.level > 1) {
					this.clearEventListener("kill");
					this.addEventListener("kill", function() {
						EnemyUtil.shot(this);
					});
				}
			},
			act : function() {
				var ca = Math.PI * 0.50;
				var cb = Math.PI * -0.10;
				var cc = Math.PI * 0.10;
				if (this.y < 0) {
					ca *= -1;
					cb *= -1;
					cc *= -1;
				}

				this.forward(-0.12);
				if (this.age === 5) {
					this.tl.//
					rotatePitchTo(ca, 5).//
					delay(20).//
					rotatePitchTo(cb, 20, es.BACK_EASEINOUT).//
					delay(10).//
					rotatePitchTo(cc, 20, es.BACK_EASEINOUT).//
					delay(10).//
					rotatePitchTo(0, 5, es.BACK_EASEINOUT).//
					delay(1);
				}

				if (this.age % 15 === 0 && random(6) < MyGame.level) {
					EnemyUtil.shot(this);
				}
			}
		},
		midoriHM : {
			name : "ミドリさんHM",
			model : game.assets["model/enemy1.l3p.js"],
			init : function(x, y, z, initialPitch) {
				this.age = 0;
				this.hp = 0.1;
				this.x = x;
				this.y = y;
				this.z = z;
				this.initialPitch = initialPitch;
			},
			act : function() {
				this.forward(-0.12);

				if (this.age === 0) {
					this.rotationSet(new Quat(1, 0, 0, 0));
				} else if (this.age === 5) {
					this.tl.rotatePitchTo(this.initialPitch, 5);
				} else if (this.age === 30 || this.age === 50) {
					var ysa = MyGame.myship.y - this.y;
					if (ysa < -0.2) {
						this.tl.rotatePitchTo(Math.PI * 0.25, 5);
					} else if (0.2 < ysa) {
						this.tl.rotatePitchTo(-Math.PI * 0.25, 5);
					} else {
						this.tl.rotatePitchTo(0, 5);
					}
				}
			}
		},
		sinner : {
			name : "サイン派",
			model : game.assets["model/sin-wave.l3p.js"],
			init : function(x, y, z) {
				this.age = 0;
				this.hp = 0.1;
				this.x = x;
				this.y = this.initY = y;
				this.z = z;
				this.bounding.radius = 0.4;
				this.rotationSet(new Quat(0, 0, 0, 0));
			},
			act : function() {
				this.z += -0.05;
				this.y = this.initY + Math.sin(this.age * 0.05) * 2.0;
				this.rotateRoll(0.2);
			}
		},
		sinner2 : {
			name : "サイン派改",
			model : game.assets["model/sin-wave-kai.l3p.js"],
			init : function(x, y, z) {
				this.age = 0;
				this.hp = 3;
				this.x = x;
				this.y = this.initY = y;
				this.z = z;
				this.bounding.radius = 0.4;
				this.score = 500;
				this.rotationSet(new Quat(0, 0, 0, 0));
			},
			act : function() {
				this.z += -0.05;
				this.y = this.initY + Math.sin(this.age * 0.05) * 2.0;
				this.rotateRoll(0.2);

				if (this.age % 40 === 0) {
					EnemyUtil.shot(this);
					if (MyGame.level >= 2) {
						EnemyUtil.shot(this, null, {
							speed : 0.10,
							color : "blue"
						});
					}
				}
			}
		},
		tank : {
			name : "たんく君",
			model : game.assets["model/tank.l3p.js"],
			init : function(x, y, z, upper) {
				this.x = x;
				this.y = y;
				this.z = z;
				this.age = 0;
				this.hp = 7;
				this.explosionType = 1;
				this.explosionSize = 3.0;
				this.upper = upper;
				this.t = Math.PI;
				this.bounding.radius = 0.8;
				this.showBounding();
				this.rotationSet(new Quat(0, 0, 0, 0));
				if (upper) {
					this.rotationSet(new Quat(0, 0, 1, Math.PI));
				}
			},
			act : function() {
				this.z += -0.02;

				if (~~(this.age / 30) % 4 == 1) {
					// 移動フェイズ
					var speed;
					if (this.age < 400) {
						speed = 0.08;
					} else {
						speed = 0.02;
					}

					if (this.z < MyGame.myship.z) {
						this.z += speed;
					} else {
						this.z -= speed;
					}

					this.x = 0;
				} else {
					// 攻撃フェイズ
					if (this.inScreen() && this.age % 10 == 0
							&& random(5) < MyGame.level) {
						var self = this;
						// ミサイル発射
						MyGame.enemyPools["missile"].get(function(e) {
							var y = self.upper ? -1 : 1;
							if (self.t < Math.PI / 2) {
								e.init(0, self.y + 0.8 * y, self.z + 0.5, [ 0,
										1 * y, 1 ]);
							} else {
								e.init(0, self.y + 0.8 * y, self.z - 0.5, [ 0,
										1 * y, -1 ]);
							}
							self.parentNode.addChild(e);
							MyGame.enemyList.add(e);
						});
					}
				}

				// 自機の方を向く
				if (this.z < MyGame.myship.z) {
					this.t -= 0.1;
					if (this.t < 0) {
						this.t = 0;
					}
				} else {
					this.t += 0.1;
					if (this.t > Math.PI) {
						this.t = Math.PI;
					}
				}
				this.body.rotationSet(new Quat(0, 1, 0, this.t));
			}
		},
		missile : {
			name : "ミサイル",
			model : game.assets["model/missile.l3p.js"],
			init : function(x, y, z, vec, max, speed) {
				this.age = 0;
				this.x = x;
				this.y = y;
				this.z = z;
				this.hp = 0.1;
				this.explosionSize = 1.0;
				this.bounding.radius = 0.2;
				this.showBounding();
				this.vec = vec3.create(vec);
				if (max) {
					this.max = max;
				} else {
					this.max = 1.2;
				}
				if (speed) {
					this.speed = speed;
				} else {
					this.speed = 0.12;
				}
				if (MyGame.level === 0) {
					this.speed *= 0.75;
				}

				vec3.normalize(this.vec);
				this.rotationSet(new Quat(1, 0, 0, Math.atan2(this.vec[1],
						this.vec[2])));

				this.history = [];
				for ( var i = 0; i < 5; i++) {
					this.history[i] = null;
				}
			},
			act : function() {
				var MAX = this.max;
				var SPEED = this.speed;
				if (this.age % 4 === 0) {
					var sx = MyGame.myship.x - this.x;
					var sy = MyGame.myship.y - this.y;
					var sz = MyGame.myship.z - this.z;
					var s = vec3.create([ sx, sy, sz ]);
					vec3.scale(s, 0.2 / vec3.length(s));
					vec3.add(this.vec, s);
					var len;
					if ((len = vec3.length(this.vec)) > MAX) {
						vec3.scale(this.vec, MAX * random(1, 0.5) / len);
					}
					this.rotationSet(new Quat(1, 0, 0, Math.atan2(this.vec[1],
							this.vec[2])));
				}

				this.x += this.vec[0] * SPEED;
				this.y += this.vec[1] * SPEED;
				this.z += this.vec[2] * SPEED;

				if ((MyGame.level === 0 && this.age === 75)
						|| (MyGame.level !== 0 && this.age === 150)) {
					this.remove();
					MyGame.explode(this, this.explosionSize);
				}

				// 軌跡
				this.history.unshift([ this.x, this.y, this.z ]);
				this.history.pop();

				var self = this;
				MyGame.drawEffect(function(l) {
					var ctx = l.image.context;
					ctx.fillStyle = (function() {
						var x = self.screenCoord().x;
						var y = self.screenCoord().y;
						var g = ctx.createRadialGradient(x, y, 0, x, y, 50);
						g.addColorStop(0.0, "rgba(255,255,255,0.5)");
						g.addColorStop(1.0, "rgba(255,255,255,0.0)");
						return g;
					})();
					for ( var i = 1, end = self.history.length; i < end; i++) {
						var h = self.history[i];
						if (!h) {
							continue;
						}
						var sc = screenCoord(h[0], h[1], h[2]);
						ctx.fillRect(sc.x - 2, sc.y - 2, 4, 4);
					}
				});
			}
		},
		geins : {
			name : "人型機動兵器けいんず君ピース",
			model : game.assets["model/robo_baz.l3p.js"],
			init : function(x, y, z) {
				this.age = 0;
				this.x = x;
				this.y = y;
				this.z = z;
				this.explosionType = 1;
				this.explosionSize = 3.0;
				this.hp = 15;
				this.rotationSet(new Quat(1, 0, 0, 0));
				this.bounding.radius = 0.8;
				this.showBounding();

				this.clearEventListener("kill");
				this.addEventListener("kill", function() {
					gainsBurst(this);
				});
			},
			act : function() {
				if (this.age === 0) {
					this.tl.moveTo(this.x, this.y, 3, 20);
				} else if (~~(this.age / 30) % 4 == 1) {
					// 移動フェイズ
					if (this.age < 600) {
						this.forward(0.08);
					} else {
						this.forward(0.03);
					}
					this.x = 0;
				} else {
					// 攻撃フェイズ
					if (this.age % 10 == 0 && randomInt(5) < MyGame.level) {
						var m = mat4.create();
						mat4.identity(m);
						mat4.multiply(m, this.rotation);
						var v = mat4.multiplyVec3(m, [ -0.3, 0.3, 1.2 ]);
						EnemyUtil.shot(this, {
							x : 0,
							y : v[1],
							z : v[2]
						});
					}
				}
				this.lookAt(MyGame.myship);
			}
		},
		geins2 : {
			name : "人型機動兵器けいんず君サニー",
			model : game.assets["model/robo2.l3p.js"],
			init : function(x, y, z) {
				this.age = 0;
				this.x = x;
				this.y = y;
				this.z = z;
				this.explosionType = 1;
				this.explosionSize = 3.0;
				this.hp = 15;
				this.rotationSet(new Quat(1, 0, 0, 0));
				this.bounding.radius = 0.8;
				this.showBounding();
				this.fire = false;

				this.clearEventListener("kill");
				this.addEventListener("kill", function() {
					gainsBurst(this);
				});
			},
			act : function() {
				if (this.age === 0) {
					this.tl.moveTo(this.x, this.y, 1.5, 20);
				} else if (this.age % 30 === 0) {
					this.fire = false;
					var dy = Math.min(MyGame.myship.y - this.y - 0.2, 1.5);
					dy = Math.max(dy, -1.5);
					this.tl.moveBy(0, dy, 0, 15, enchant.Easing.QUAD_EASEINOUT)
							.then(function() {
								this.fire = true;
							});
				}

				if (this.fire && this.age % 3 === 0
						&& (-4 < this.z && this.z < 4)) {
					EnemyUtil.shot(this, null, {
						color : "blue",
						speed : 0.22,
						radius : 1.5,
						needle : true
					});
				}

				this.lookAt(MyGame.myship);
			}
		},
		geins3 : {
			name : "人型機動兵器けいんず君マーチ",
			model : game.assets["model/robo3.l3p.js"],
			init : function(x, y, z) {
				this.age = 0;
				this.x = x;
				this.y = y;
				this.z = z;
				this.explosionType = 1;
				this.explosionSize = 3.0;
				this.hp = 15;
				this.rotationSet(new Quat(1, 0, 0, 0));
				this.bounding.radius = 0.8;
				this.showBounding();

				this.clearEventListener("kill");
				this.addEventListener("kill", function() {
					gainsBurst(this);
				});

				// ミサイル発射
				this.fire = function() {
					if (!this.inScreen()) {
						return;
					}
					var self = this;
					MyGame.enemyPools["missile"].get(function(e) {
						e.init( //
						0, //
						self.y + //
						-self._rotation[9] * 0.7 + //
						self._rotation[4] * 0.5 + //
						self._rotation[1] * 0.5, //
						self.z + //
						-self._rotation[10] * 0.7 + //
						self._rotation[4] * 0.5 + //
						self._rotation[2] * 0.5, //
						[ //
						0, //
						self._rotation[5], //
						self._rotation[6] //
						]);
						self.parentNode.addChild(e);
						MyGame.enemyList.add(e);
					});
					MyGame.enemyPools["missile"].get(function(e) {
						e.init( //
						0, //
						self.y + //
						-self._rotation[9] * 0.7 + //
						self._rotation[4] * 0.5 + //
						self._rotation[1] * -0.5, //
						self.z + //
						-self._rotation[10] * 0.7 + //
						self._rotation[4] * 0.5 + //
						self._rotation[2] * -0.5, //
						[ //
						0, //
						self._rotation[5], //
						self._rotation[6] //
						]);
						self.parentNode.addChild(e);
						MyGame.enemyList.add(e);
					});
				};
			},
			act : function() {
				if (this.age === 0) {
					this.tl.moveTo(this.x, this.y, 3.5, 20);
				} else if (this.age % 50 === 0) {
					var tar = Math.max((MyGame.myship.y - 2), -4);
					var dy = Math.min(tar - this.y - 0.2, 1.5);
					dy = Math.max(dy, -1.5);
					this.tl.moveBy(0, dy, 0, 10, enchant.Easing.QUAD_EASEINOUT)
							.then(this.fire);
				}

				this.lookAt(MyGame.myship);
			}
		},
		geins4 : {
			name : "人型機動兵器けいんず君ビューティ",
			model : game.assets["model/robo4.l3p.js"],
			init : function(x, y, z) {
				this.age = 0;
				this.x = x;
				this.y = y;
				this.z = z;
				this.explosionType = 1;
				this.explosionSize = 3.0;
				this.hp = 15;
				this.rotationSet(new Quat(1, 0, 0, 0));
				this.bounding.radius = 0.8;
				this.showBounding();
				this.running = false;

				this.clearEventListener("kill");
				this.addEventListener("kill", function() {
					gainsBurst(this);
				});
			},
			act : function() {
				if (this.age === 0) {
					this.tl.moveTo(this.x, this.y, 3, 20);
				} else if (this.age % 50 === 5) {
					this.running = true;
					var dist = 3;
					this.tl.moveBy(0, this._rotation[9] * dist,
							this._rotation[10] * dist, 30,
							enchant.Easing.BACK_EASEIN).then(function() {
						this.running = false;
					});
				}

				if (!this.running) {
					this.lookAt(MyGame.myship);
				}
			}
		},
		geins5 : {
			name : "人型機動兵器けいんず君ハッピー",
			model : game.assets["model/robo5.l3p.js"],
			init : function(x, y, z) {
				this.age = 0;
				this.x = x;
				this.y = y;
				this.z = z;
				this.explosionType = 1;
				this.explosionSize = 3.0;
				this.hp = 30;
				this.rotationSet(new Quat(1, 0, 0, 0));
				this.bounding.radius = 0.8;
				this.showBounding();
				this.running = false;

				this.rotationSet(new Quat(0, 1, 0, Math.PI));

				this.clearEventListener("kill");
				this.addEventListener("kill", function() {
					gainsBurst(this);
				});
			},
			act : function() {
				if (this.age === 0) {
					this.tl.moveTo(this.x, this.y, 1, 50);
				} else if (this.age % 30 === 5) {
					var dy = Math.min(MyGame.myship.y - this.y - 0.2, 1.5);
					dy = Math.max(dy, -1.5);
					this.tl.moveBy(0, dy, 0, 15, enchant.Easing.QUAD_EASEINOUT);
				}
			}
		},
		box : {
			name : "障害物(箱)",
			model : (function() {
				var r = game.assets["model/box1.l3p.js"].clone();
				return r;
			})(),
			init : function(x, y, z) {
				this.age = 0;
				this.x = this.initX = x;
				this.y = this.initY = y;
				this.z = this.initZ = z;
				this.initBgX = game.background.x;
				this.initBgY = game.background.y;
				this.initBgZ = game.background.z;
				this.hp = 5000;
				this.rotationSet(new Quat(0, 0, 0, 0));
				this.bounding = new AABB();
				this.damage = function() {
					// no op
				};

				// inWorldメソッド.最初は常にtrueを返すが、一度世界の中に入ったら通常の動作に戻る.
				this.origInWorld = this.inWorld;
				this.inWorld = function() {
					if (this.origInWorld()) {
						this.inWorld = this.origInWorld;
					}
					return true;
				};
			},
			act : function() {
				this.x = this.initX + (game.background.x - this.initBgX);
				this.y = this.initY + (game.background.y - this.initBgY);
				this.z = this.initZ + (game.background.z - this.initBgZ);

				// 敵弾との衝突判定
				var self = this;
				function hit(pool) {
					pool.forEach(function(b) {
						if (b.active) {
							if (self.intersect(b)) {
								b.remove();
								pool.dispose(b);
							}
						}
					});
				}
				hit(MyGame.enemyBullets);
				hit(MyGame.enemyBulletsG);
				hit(MyGame.enemyBulletsB);
				hit(MyGame.enemyBulletsY);

				// ミサイルとの衝突判定
				MyGame.enemyPools["missile"].forEach(function(m) {
					if (m.active) {
						if (self.intersect(m)) {
							m.remove();
							MyGame.enemyPools["missile"].dispose(m);
							MyGame.explode(m, m.explosionSize);
						}
					}
				});
			}
		},
		box2 : {
			name : "障害物(箱)2",
			model : (function() {
				var r = game.assets["model/box2.l3p.js"].clone();
				return r;
			})(),
			init : function(x, y, z) {
				this.age = 0;
				this.x = this.initX = x;
				this.y = this.initY = y;
				this.z = this.initZ = z;
				this.initBgX = game.background.x;
				this.initBgY = game.background.y;
				this.initBgZ = game.background.z;
				this.hp = 5000;
				this.rotationSet(new Quat(0, 0, 0, 0));
				this.bounding = new AABB();
				this.damage = function() {
					// no op
				};

				// inWorldメソッド.最初は常にtrueを返すが、一度世界の中に入ったら通常の動作に戻る.
				this.origInWorld = this.inWorld;
				this.inWorld = function() {
					if (this.origInWorld()) {
						this.inWorld = this.origInWorld;
					}
					return true;
				};
			},
			act : function() {
				this.x = this.initX + (game.background.x - this.initBgX);
				this.y = this.initY + (game.background.y - this.initBgY);
				this.z = this.initZ + (game.background.z - this.initBgZ);

				// 敵弾との衝突判定
				var self = this;
				function hit(pool) {
					pool.forEach(function(b) {
						if (b.active) {
							if (self.intersect(b)) {
								b.remove();
								pool.dispose(b);
							}
						}
					});
				}
				hit(MyGame.enemyBullets);
				hit(MyGame.enemyBulletsG);
				hit(MyGame.enemyBulletsB);
				hit(MyGame.enemyBulletsY);

				// ミサイルとの衝突判定
				MyGame.enemyPools["missile"].forEach(function(m) {
					if (m.active) {
						if (self.intersect(m)) {
							m.remove();
							MyGame.enemyPools["missile"].dispose(m);
							MyGame.explode(m, m.explosionSize);
						}
					}
				});
			}
		},
		box3 : {
			name : "障害物(箱)3",
			model : (function() {
				var r = game.assets["model/box3.l3p.js"].clone();
				return r;
			})(),
			init : function(x, y, z) {
				this.age = 0;
				this.x = this.initX = x;
				this.y = this.initY = y;
				this.z = this.initZ = z;
				this.initBgX = game.background.x;
				this.initBgY = game.background.y;
				this.initBgZ = game.background.z;
				this.hp = 5000;
				this.rotationSet(new Quat(0, 0, 0, 0));
				this.bounding = new AABB();
				this.damage = function() {
					// no op
				};

				// inWorldメソッド.最初は常にtrueを返すが、一度世界の中に入ったら通常の動作に戻る.
				this.origInWorld = this.inWorld;
				this.inWorld = function() {
					if (this.origInWorld()) {
						this.inWorld = this.origInWorld;
					}
					return true;
				};
			},
			act : function() {
				this.x = this.initX + (game.background.x - this.initBgX);
				this.y = this.initY + (game.background.y - this.initBgY);
				this.z = this.initZ + (game.background.z - this.initBgZ);

				// 敵弾との衝突判定
				var self = this;
				function hit(pool) {
					pool.forEach(function(b) {
						if (b.active) {
							if (self.intersect(b)) {
								b.remove();
								pool.dispose(b);
							}
						}
					});
				}
				hit(MyGame.enemyBullets);
				hit(MyGame.enemyBulletsG);
				hit(MyGame.enemyBulletsB);
				hit(MyGame.enemyBulletsY);

				// ミサイルとの衝突判定
				MyGame.enemyPools["missile"].forEach(function(m) {
					if (m.active) {
						if (self.intersect(m)) {
							m.remove();
							MyGame.enemyPools["missile"].dispose(m);
							MyGame.explode(m, m.explosionSize);
						}
					}
				});
			}
		},
		cannon : {
			name : "砲台くん",
			model : game.assets["model/kotti-min-na.l3p.js"],
			init : function(x, y, z, reverse) {
				this.age = 0;
				this.x = this.initX = x;
				this.y = this.initY = y;
				this.z = this.initZ = z;
				this.initBgX = game.background.x;
				this.initBgY = game.background.y;
				this.initBgZ = game.background.z;
				this.hp = 5;
				this.rotationSet(new Quat(0, 0, 0, 0));
				this.reverse = !!reverse;
				this.explosionType = 1;
				this.explosionSize = 3.0;

				if (this.reverse) {
					this.rotatePitch(Math.PI);
				}

				// inWorldメソッド.最初は常にtrueを返すが、一度世界の中に入ったら通常の動作に戻る.
				this.origInWorld = this.inWorld;
				this.inWorld = function() {
					if (this.origInWorld()) {
						this.inWorld = this.origInWorld;
					}
					return true;
				};
			},
			act : function() {
				this.x = this.initX + (game.background.x - this.initBgX);
				this.y = this.initY + (game.background.y - this.initBgY);
				this.z = this.initZ + (game.background.z - this.initBgZ);

				var self = this;

				// ミサイル発射
				for ( var i = 0; i < 2; i++) {
					if (this.inScreen() && this.age % 60 === 0) {
						MyGame.enemyPools["missile"].get(function(e) {
							e.init(self.x, self.y, self.z - 0.2 + 0.4 * i, [ 0,
									(self.reverse ? -1 : 1), 0 ]);
							self.parentNode.addChild(e);
							MyGame.enemyList.add(e);
						});
					}
				}
			}
		},
		cannonMini : {
			name : "砲台くんミニ",
			model : game.assets["model/houdai_ue.l3p.js"],
			init : function(x, y, z) {
				this.age = 0;
				this.x = this.initX = x;
				this.y = this.initY = y;
				this.z = this.initZ = z;
				this.initBgX = game.background.x;
				this.initBgY = game.background.y;
				this.initBgZ = game.background.z;
				this.hp = 2;
				this.rotationSet(new Quat(0, 0, 0, 0));
				this.explosionType = 1;
				this.explosionSize = 1.0;

				if (!this.dai) {
					this.dai = game.assets["model/houdai_sita.l3p.js"].clone();
				}
				this.clearEventListener("remove");
				this.addEventListener("remove", function() {
					if (this.dai && this.dai.parentNode) {
						this.dai.remove();
					}
				});

				// inWorldメソッド.最初は常にtrueを返すが、一度世界の中に入ったら通常の動作に戻る.
				this.origInWorld = this.inWorld;
				this.inWorld = function() {
					if (this.origInWorld()) {
						this.inWorld = this.origInWorld;
					}
					return true;
				};
			},
			act : function() {
				if (this.age === 0) {
					this.parentNode.addChild(this.dai);
				}
				this.x = this.dai.x = this.initX
						+ (game.background.x - this.initBgX);
				this.y = this.dai.y = this.initY
						+ (game.background.y - this.initBgY);
				this.z = this.dai.z = this.initZ
						+ (game.background.z - this.initBgZ);

				this.lookAt(MyGame.myship);

				if (this.age % 30 === 0 && random(5) < MyGame.level + 1) {
					EnemyUtil.shot(this);
				}
			}
		},
		cannonMiniR : {
			name : "逆さ砲台くんミニ",
			model : game.assets["model/houdai-r_ue.l3p.js"],
			init : function(x, y, z) {
				this.age = 0;
				this.x = this.initX = x;
				this.y = this.initY = y;
				this.z = this.initZ = z;
				this.initBgX = game.background.x;
				this.initBgY = game.background.y;
				this.initBgZ = game.background.z;
				this.hp = 2;
				this.rotationSet(new Quat(0, 0, 0, 0));
				this.explosionType = 1;
				this.explosionSize = 1.0;

				if (!this.dai) {
					this.dai = game.assets["model/houdai-r_sita.l3p.js"]
							.clone();
				}
				this.clearEventListener("remove");
				this.addEventListener("remove", function() {
					if (this.dai && this.dai.parentNode) {
						this.dai.remove();
					}
				});

				// inWorldメソッド.最初は常にtrueを返すが、一度世界の中に入ったら通常の動作に戻る.
				this.origInWorld = this.inWorld;
				this.inWorld = function() {
					if (this.origInWorld()) {
						this.inWorld = this.origInWorld;
					}
					return true;
				};
			},
			act : function() {
				if (this.age === 0) {
					this.parentNode.addChild(this.dai);
				}
				this.x = this.dai.x = this.initX
						+ (game.background.x - this.initBgX);
				this.y = this.dai.y = this.initY
						+ (game.background.y - this.initBgY);
				this.z = this.dai.z = this.initZ
						+ (game.background.z - this.initBgZ);

				this.lookAt(MyGame.myship);

				if (this.age % 30 === 0 && random(5) < MyGame.level + 1) {
					EnemyUtil.shot(this);
				}
			}
		},
		itemCapsule : {
			name : "アイテムカプセル",
			model : game.assets["model/capsule.l3p.js"],
			init : function(x, y, z, itemType) {
				this.x = x;
				this.y = y;
				this.z = z;
				this.itemType = itemType;
				this.age = 0;
				this.hp = 0.1;

				this.clearEventListener("kill");
				this.addEventListener("kill", function() {
					MyGame.generateItem(this.itemType, this);
				});
			},
			act : function() {
				this.y += Math.sin(this.age * 0.1) * 0.05;
				this.z += -0.03;
				var l = this.body.childNodes[0];
				var a = l.mesh.texture.ambient
				var r = Math.sin(this.age * 0.1);
				l.mesh.texture.ambient = [ r, 0, 0, 1 ];
			}
		}
	};

	// 全敵データ30個ずつプール
	for ( var type in MyGame.enemyData) {
		if (MyGame.enemyData.hasOwnProperty(type)) {
			MyGame.enemyPools[type] = [];
			for ( var i = 0; i < 30; i++) {
				MyGame.enemyPools[type].pool(new Enemy(MyGame.enemyData, type));
			}
		}
	}

	// sinnerは50機追加
	for ( var i = 0; i < 50; i++) {
		MyGame.enemyPools["sinner"].pool(new Enemy(MyGame.enemyData, "sinner"));
	}

	// 箱は500個追加
	for ( var i = 0; i < 500; i++) {
		MyGame.enemyPools["box"].pool(new Enemy(MyGame.enemyData, "box"));
	}

	// ボスは１個だけプール
	MyGame.enemyData["boss"] = createStage3BossSpec();
	MyGame.enemyPools["boss"] = [];
	MyGame.enemyPools["boss"].pool(new Enemy(MyGame.enemyData, "boss"));
}
