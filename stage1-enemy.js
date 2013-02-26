function setupEnemies() {
	var game = MyGame.game;
	MyGame.enemyData = {
		0 : { // 0
			name : "ミドリさん",
			model : game.assets["model/enemy1.l3p.js"],
			init : function(x, y, z) {
				this.age = 0;
				this.x = x;
				this.y = y;
				this.z = z;
				this.hp = 0.1;
				this.rotationSet(new Quat(1, 0, 0, 0));
				this.bounding.radius = 0.4;
				this.showBounding();
			},
			act : function() {
				this.forward(-0.12);

				if (this.age === 35) {
					if (this.y > 0) {
						this.tl.rotatePitchBy(Math.PI * 0.75, 30);
					} else {
						this.tl.rotatePitchBy(-Math.PI * 0.75, 30);
					}
				} else if (this.age === 90) {
					if (this.y > 0) {
						this.tl.rotatePitchBy(-Math.PI * 0.25, 10);
					} else {
						this.tl.rotatePitchBy(Math.PI * 0.25, 10);
					}
				}

				// 弾を撃つ
				if (MyGame.level > 1) {
					if (this.age % 40 == 0 && random() < 0.4) {
						EnemyUtil.shot(this);
					}
				}
			}
		},
		1 : { // 1
			name : "ヒットアンドにげろん",
			model : game.assets["model/enemy2.l3p.js"],
			init : function(x, y, z) {
				this.age = 0;
				this.x = x;
				this.y = y;
				this.z = z;
				this.initX = x;
				this.initY = y;
				this.initZ = z;
				this.hp = 0.1;
				this.rotationSet(new Quat(0, 1, 0, 0));
				this.bounding.radius = 0.4;
				this.showBounding();
			},
			act : function() {
				if (0 <= this.age && this.age < 30) {
					var i = this.age - 0;
					var ratio = enchant.Easing.QUAD_EASEOUT(i, 0, 1, 30);
					this.z = 1 * ratio + this.initZ * (1 - ratio);
					this.rotationSet(new Quat(0, 0, 1, (30 - i) / 10));
				} else if (30 <= this.age && this.age < 39) {
					if (this.age % 3 == 0) {
						if (MyGame.level < 2) {
							EnemyUtil.shot(this, null, {
								needle : true,
								color : "blue"
							});
						} else {
							EnemyUtil.shot3way(this, null, {
								needle : true,
								color : "blue"
							});
						}
					}
				} else if (39 <= this.age && this.age < 110) {
					var i = this.age - 39;
					var ratio = enchant.Easing.QUAD_EASEOUT(i, 0, 1, 80);
					this.y = (this.initY + 3) * ratio + this.initY
							* (1 - ratio);
					this.z = 6 * ratio + 1 * (1 - ratio);
					this.rotationApply(new Quat(1, -1, 0, Math.PI / 60));
				} else {
					this.remove();
					MyGame.enemyPools[this.type].dispose(this);
					MyGame.enemyList.remove(this);
				}
			}
		},
		2 : { // 2
			name : "たんく君",
			model : game.assets["model/tank.l3p.js"],
			init : function(x, y, z) {
				this.x = x;
				this.y = y;
				this.z = z;
				this.age = 0;
				this.hp = 10;
				this.explosionType = 1;
				this.explosionSize = 3.0;
				this.t = Math.PI;
				this.bounding.radius = 0.8;
				this.showBounding();
			},
			act : function() {
				this.z += -0.03 * 0.7;

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
							&& randomInt(10) < MyGame.level + 1) {
						var self = this;
						// ミサイル発射
						MyGame.enemyPools[9].get(function(e) {
							if (self.t < Math.PI / 2) {
								e.init(0, self.y + 0.8, self.z + 0.5,
										[ 0, 1, 1 ]);
							} else {
								e.init(0, self.y + 0.8, self.z - 0.5, [ 0, 1,
										-1 ]);
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
		3 : { // 3
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
		},
		4 : { // 4
			name : "駆逐艦ドネルケバブ",
			model : game.assets["model/enemy_ship2.l3p.js"],
			init : function(x, y, z) {
				this.age = 0;
				this.x = x;
				this.y = y;
				this.initY = y;
				this.z = z;
				this.hp = 60;
				this.score = 600;
				this.explosionType = 1;
				this.bounding = new AABB();
				this.bounding.scale = 0.8;
				this.showBounding();
				// 前
				this.front = new Sprite3D();
				this.front.bounding = new AABB();
				this.front.bounding.scale = 0.6;
				this.front.x = x;
				this.front.y = y;
				this.front.z = z + -1.3;
				this.front.showBounding();
				// 後
				this.rear = new Sprite3D();
				this.rear.bounding = new AABB();
				this.rear.bounding.scale = 0.8;
				this.rear.x = x;
				this.rear.y = y;
				this.rear.z = z + 1.5;
				this.rear.showBounding();
				this.intersect = function(another) {
					return this.bounding.intersect(another)
							|| this.front.intersect(another)
							|| this.rear.intersect(another);
				};

				// 砲塔
				if (MyGame.level === 0) {
					var POSITIONS = [ //
					[ -0.70, -2.05 ], // 
					[ -0.70, -1.20 ], // 
					[ -1.00, 0.00 ], // 
					[ -1.00, 0.80 ], // 
					[ 0.70, -2.05 ], //
					[ 0.70, -1.20 ], //
					[ 1.00, 0.00 ], // 
					[ 1.00, 0.80 ] // 
					];
				} else {
					var POSITIONS = [ //
					[ -0.70, -2.05 ], // 
					[ -0.70, -1.65 ], //
					[ -0.70, -1.20 ], // 
					[ -1.00, 0.00 ], // 
					[ -1.00, 0.40 ], // 
					[ -1.00, 0.80 ], // 
					[ 0.70, -2.05 ], //
					[ 0.70, -1.65 ], //
					[ 0.70, -1.20 ], //
					[ 1.00, 0.00 ], // 
					[ 1.00, 0.40 ], // 
					[ 1.00, 0.80 ] // 
					];
				}

				var ship = this;
				var guns = [];
				for ( var i = 0, end = POSITIONS.length; i < end; i++) {
					var y = POSITIONS[i][0];
					var z = POSITIONS[i][1];
					var bottom = y < 0;
					MyGame.enemyPools["gun"].get(function(e) {
						e.init(0, y, z, ship, bottom);
						guns[i] = e;
					});
				}

				// 撃破時の演出
				this.clearEventListener("kill");
				this.addEventListener("kill", function() {
					// 残っている砲塔を破壊
					for ( var i = 0, end = guns.length; i < end; i++) {
						if (guns[i] && guns[i].parent == this
								&& guns[i].parentNode && guns[i].hp > 0) {
							guns[i].damage(guns[i].hp);
						}
					}

					// とりあえず中爆発
					for ( var i = 0; i < 3; i++) {
						MyGame.explode({
							x : 0,
							y : ship.y + random(0, 2),
							z : ship.z + random(0, 2)
						}, 3.0);
					}

					var s = game.assets["model/enemy_ship2.l3p.js"].clone();
					s.x = ship.x;
					s.y = ship.y;
					s.z = ship.z;
					ship.parentNode.addChild(s);

					// 自機が死んだ時にsをremoveする処理
					game.addEventListener("restart", function() {
						s.remove();
						game.removeEventListener("restart", arguments.callee);
					});

					var t = 210;
					s.tl.rotateBy(new Quat(0.5, 0.3, 1.0, 1), t).and().moveBy(
							20, -5, 0, t, enchant.Easing.QUAD_EASEIN).then(
							function() {
								s.remove();
								MyGame.quake(20);
								MyGame.explodeLarge(s, 8.0);
								for ( var i = 0; i < 8; i++) {
									var t = random(Math.PI * 2);
									var r = random(2.0, 0.25);
									MyGame.explodeLarge({
										x : s.x,
										y : s.y + Math.cos(t) * r * 0.5,
										z : s.z + Math.sin(t) * r
									}, 8.0);
								}
								playSound("explode_super.mp3");
							});
					s.addEventListener("enterframe", function() {
						if (this.age % 5 === 0) {
							MyGame.explode({
								x : this.x,
								y : this.y + random(0, 1),
								z : this.z + random(0, 3)
							}, 1.0);
						}
					})
				});

				this.clearEventListener("remove");
				this.addEventListener("remove", function() {
					this.front.remove();
					this.rear.remove();
					for ( var i = 0, end = guns.length; i < end; i++) {
						if (guns[i] && guns[i].parent == this
								&& guns[i].parentNode) {
							guns[i].remove();
						}
					}
				});

				this.guns = guns;
			},
			act : function() {
				if (this.age === 0) {
					for ( var i = 0, end = this.guns.length; i < end; i++) {
						var gun = this.guns[i];
						MyGame.enemyList.add(gun);
						this.parentNode.addChild(gun);
					}
				}

				var before = {};
				before.x = this.x;
				before.y = this.y;
				before.z = this.z;

				if (this.age < 250) {
					this.z += -0.03;
				} else if (this.age < 400) {
					this.z += 0.02;
					if (this.initY > 0) {
						this.y += -0.02;
					} else {
						this.y += 0.02;
					}
				} else if (600 < this.age) {
					this.z += -0.03;
					if (this.initY > 0) {
						this.y += 0.02;
					} else {
						this.y += -0.02;
					}
				} else {
					this.z += -0.03;
				}

				this.front.x += this.x - before.x;
				this.front.y += this.y - before.y;
				this.front.z += this.z - before.z;
				this.rear.x += this.x - before.x;
				this.rear.y += this.y - before.y;
				this.rear.z += this.z - before.z;
			}
		},
		gun : {
			name : "ドネルケバブ砲塔",
			model : game.assets["model/gun.l3p.js"],
			init : function(x, y, z, parent, bottom) {
				this.posX = x;
				this.posY = y;
				this.posZ = z;
				this.rotationSet(new Quat(0, 0, 1, Math.PI));
				this.parent = parent;
				this.bottom = bottom;
				this.age = 0;
				this.hp = 6;
				this.bounding.radius = 0.4;
				this.showBounding();
				this.explosionType = 1;
				this.explosionSize = 1.0;

				this.inWorld = function() {
					return parent.inWorld();
				};

				this.x = this.parent.x + this.posX;
				this.y = this.parent.y + this.posY;
				this.z = this.parent.z + this.posZ;

				this.clearEventListener("remove");
				this.addEventListener("remove", function() {
					this.parent = null;
				});
			},
			act : function() {
				this.x = this.parent.x + this.posX;
				this.y = this.parent.y + this.posY;
				this.z = this.parent.z + this.posZ;
				if ((this.bottom && MyGame.myship.y < this.y + 1)
						|| (!this.bottom && MyGame.myship.y > this.y - 1)) {
					if (this.age % (60 - (MyGame.level * 10)) === 0) {
						var t = Math.atan2(MyGame.myship.y - this.y,
								MyGame.myship.z - this.z);
						EnemyUtil.shot(this, {
							x : 0,
							y : Math.sin(t) * 0.5,
							z : Math.cos(t) * 0.5
						});
					}
					this.lookAt(MyGame.myship);
				}
			}
		},
		5 : { // 5
			name : "ミドリさん(蛇行)",
			model : game.assets["model/enemy1.l3p.js"],
			init : function(x, y, z) {
				this.age = 0;
				this.x = x;
				this.y = y;
				this.z = z;
				this.hp = 0.1;
				this.rotationSet(new Quat(1, 0, 0, 0));
				this.bounding.radius = 0.4;
				this.showBounding();
			},
			act : function() {
				this.forward(-0.12);
				this.rotationSet(new Quat(1, 0, 0,
						Math.cos(this.age * 0.1) * 1.4));

				// 弾を撃つ
				if (MyGame.level > 1) {
					if (this.age % 40 == 0 && random() < 0.4) {
						EnemyUtil.shot(this);
					}
				}
			}
		},
		6 : { // 6
			name : "人型機動兵器げいんず君",
			model : game.assets["model/robo_baz.l3p.js"],
			init : function(x, y, z) {
				this.age = 0;
				this.x = x;
				this.y = y;
				this.z = z;
				this.hp = 10;
				this.rotationSet(new Quat(1, 0, 0, 0));
				this.bounding.radius = 0.8;
				this.showBounding();
				this.explosionType = 1;
				this.explosionSize = 3.0;

				this.clearEventListener("kill");
				this.addEventListener("kill", function() {
					EnemyUtil.shot(this);
				});
			},
			act : function() {
				this.z += -0.03 * 0.7;
				if (~~(this.age / 30) % 4 == 1) {
					// 移動フェイズ
					if (this.age < 600) {
						this.forward(0.08);
					} else {
						this.forward(0.03);
					}
					this.x = 0;
				} else {
					// 攻撃フェイズ
					if (this.age % 10 == 0 && randomInt(10) < MyGame.level + 2) {
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
		7 : { // 7
			name : "ミドリさん(うしろから)",
			model : game.assets["model/enemy1.l3p.js"],
			init : function(x, y, z) {
				this.age = 0;
				this.x = x;
				this.y = y;
				this.z = z;
				this.hp = 0.1;
				this.rotationSet(new Quat(0, 1, 0, Math.PI));
				this.bounding.radius = 0.4;
				this.showBounding();
			},
			act : function() {
				this.forward(-0.12);
				if (50 <= this.age && this.age < 80) {
					if (this.y > 0) {
						this.rotatePitch(Math.PI * 0.75 / 30);
					} else {
						this.rotatePitch(-Math.PI * 0.75 / 30);
					}
				} else if (115 <= this.age && this.age < 125) {
					if (this.y > 0) {
						this.rotatePitch(-Math.PI * 0.25 / 10);
					} else {
						this.rotatePitch(Math.PI * 0.25 / 10);
					}
				}

				// 弾を撃つ
				if (MyGame.level > 1) {
					if (this.age % 40 == 0 && random() < 0.4) {
						EnemyUtil.shot(this);
					}
				}
			}
		},
		8 : { // 8
			name : "ヒットアンドにげろん(赤坂さん随伴)",
			model : game.assets["model/enemy2.l3p.js"],
			init : function(x, y, z) {
				this.age = 0;
				this.x = x;
				this.y = y;
				this.z = z;
				this.hp = 10;
				this.rotationSet(new Quat(0, 1, 0, 0));
				this.bounding.radius = 0.4;
				this.showBounding();
				this.goAhead = false;
			},
			act : function() {
				if (this.z > 2 || this.goAhead) {
					this.z -= 0.2;
				}
				this.rotateRoll(0.5);
			}
		},
		9 : { // 9
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
		11 : {// 11
			name : "コウノトリ",
			model : game.assets["model/enemy3.l3p.js"],
			init : function(y) {
				this.tl.clear();
				this.age = 0;
				this.x = 20;
				this.y = y;
				this.z = 20;
				this.hp = 0.1;
				this.rotationSet(new Quat(0, 0, 0, 0));
				this.origInWorld = this.inWorld;
				this.inWorld = function() {
					return true;
				};
				this.clearEventListener("kill");
				if (MyGame.level > 1) {
					this.addEventListener("kill", function() {
						EnemyUtil.shot(this);
					});
				}
			},
			act : function() {
				if (this.age === 0) {
					var self = this;
					var fireMissile = function() {
						MyGame.enemyPools[9].get(function(e) {
							e.init(0, self.y - 0.5, self.z, [ 0, 0, -1 ]);
							self.parentNode.addChild(e);
							MyGame.enemyList.add(e);
						});
					};
					this.tl //
					.moveTo(20, this.y, 3, 120) //
					.delay(5) //
					.rotateRollTo(-1, 30, enchant.Easing.QUAD_EASEIN)//
					.and() //
					.moveTo(0, this.y, 3, 60) //
					.then(function() {
						this.x = 0;
					}) //
					.rotateRollTo(0, 10, enchant.Easing.QUAD_EASEOUT) //
					.delay(5) //
					.then(fireMissile).delay(15) //
					.then(fireMissile).delay(15) //
					.then(function() {
						this.inWorld = this.origInWorld;
					}) //
					.rotatePitchTo(0.5, 30, enchant.Easing.QUAD_EASEIN) //
					.and()
					//
					.moveTo(0, this.y, -10, 120, enchant.Easing.QUAD_EASEIN);
				}
			}
		},
		12 : { // 12
			name : "アジフライ",
			model : game.assets["model/enemy5.l3p.js"],
			init : function(x, y, z) {
				this.age = 0;
				this.x = x;
				this.y = y;
				this.z = z;
				this.hp = 3;
				this.clearEventListener("kill");
				if (MyGame.level > 1) {
					this.addEventListener("kill", function() {
						EnemyUtil.shot(this);
					});
				}
			},
			act : function() {
				if (this.age === 0) {
					this.tl.moveTo(0, 2, 3, 50, enchant.Easing.QUAD_EASEOUT) //
					.then(
							function() {
								this.tl.moveBy(0, 1, -3, 60,
										enchant.Easing.QUAD_EASEIN) //
								.moveBy(0, -1, 3, 60,
										enchant.Easing.QUAD_EASEIN) //
								.loop();
							});
				}

				if (this.age === 200) {
					this.tl.clear();
					this.tl.moveBy(0, 0, -10, 120, enchant.Easing.QUAD_EASEIN);
				}

				if (this.age % 20 === 0) {
					EnemyUtil.shot(this, {
						x : 0,
						y : -0.1,
						z : 0
					});
				}
			}
		},
		bossFly : {
			name : "ボス出現",
			model : game.assets["model/boss1_fly.l3p.js"],
			init : function(x, y, z) {
				this.x = x;
				this.y = y;
				this.z = z;
				// 常にtrue
				this.inWorld = function() {
					return true;
				}
				this.inScreen = function() {
					return true;
				}
			}
		}
	};

	// 全敵データ20個ずつプール
	for ( var type in MyGame.enemyData) {
		if (MyGame.enemyData.hasOwnProperty(type)) {
			MyGame.enemyPools[type] = [];
			for ( var i = 0; i < 20; i++) {
				MyGame.enemyPools[type].pool(new Enemy(MyGame.enemyData, type));
			}
		}
	}

	// ドネルケバブの砲塔は20個だと足りないので4個追加
	for ( var i = 0; i < 4; i++) {
		MyGame.enemyPools["gun"].pool(new Enemy(MyGame.enemyData, "gun"));
	}

	// ボスは１個だけプール
	MyGame.enemyData["boss"] = createStage1BossSpec();
	MyGame.enemyPools["boss"] = [];
	MyGame.enemyPools["boss"].pool(new Enemy(MyGame.enemyData, "boss"));
}
