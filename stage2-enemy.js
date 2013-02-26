function setupEnemies() {
	var game = MyGame.game;
	MyGame.enemyData = {
		stinger : {
			name : "スティンガーくん。顔は怖いが温厚な性格をしている。胸の赤い球が弱点。",
			model : (function() {
				var model = new Sprite3D();
				var inner = new Sprite3D();
				inner.addChild(game.assets["model/devil_fish.l3c.js"]);
				inner.rotateYaw(Math.PI);
				inner.scaleX = 2;
				inner.scaleY = 2;
				inner.scaleZ = 2;
				model.addChild(inner);
				return model;
			})(),
			init : function(x, y, z) {
				this.age = 0;
				this.x = x;
				this.y = y;
				this.z = z;
				this.scaleY = 1;
				this.rotationSet(new Quat(0, 0, 0, 0));

				this.hp = 30;
				this.score = 600;
				this.bounding.radius = 0.5;
				this.killed = false;
				this.explosionType = 2;

				this.unitRoot = this.body.childNodes[0].childNodes[0];
				this.unitRoot.setPose("");
				this.animate = function() {
					this.unitRoot.animate.apply(this.unitRoot, arguments);
				};

				// killをoverride
				this.kill = function() {
					if (this.killed) {
						return;
					}

					this.killed = true;
					MyGame.chishibuki(this, this.explosionSize);
					playSound("explode.mp3");

					this.dispatchEvent(new Event("kill")); // killイベント発生
					this.lightOff();
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
					game.score += this.score * megaRate;

					this.animate("Pose4", 60);
					this.tl.clear();
					this.tl.//
					moveBy(0, 1, 0, 60, enchant.Easing.CUBIC_EASEINOUT).//
					then(function() {
						this._imawa = true;
					});

					this._imawa = false;
					this.addEventListener("enterframe", function() {
						if (this._imawa) {
							// 放射弾
							if (MyGame.level === 0) {
								var r = 4;
							} else if (MyGame.level === 1) {
								var r = 11;
							} else {
								var r = 20;
							}
							for ( var i = 0; i < r; i++) {
								var t = Math.PI * 2 / r * i;
								EnemyUtil.directionalShot(this, t);
								var t2 = Math.PI * 2 / r * (i + 0.5);
								EnemyUtil.directionalShot(this, t2, null, {
									speed : 0.09
								});
							}

							MyGame.chishibuki(this, 5.0);
							playSound("explode_large.mp3");

							this.remove();

							this.removeEventListener("enterframe",
									arguments.callee);
						}
					});
				}
			},
			act : function() {
				if (this.hp <= 0) {
					return;
				}

				this.forward(-0.03);
				this.x = 0;
				this.scaleY += Math.sin(this.age * 0.1) * 0.015;

				if (this.age < 150 || 150 + 110 < this.age) {
					if (this.age % 60 === 0) {
						this.animate("Pose1", 30);
					} else if (this.age % 30 === 0) {
						this.animate("Pose2", 30);
					}
				} else if (this.age === 150) {
					this.animate("Pose3", 55, function() {
						this.animate("", 55);
					});
					this.tl.rotateTo(new Quat(0, 1, 0, -Math.PI), 110,
							enchant.Easing.CUBIC_EASEINOUT);
				}
			}
		},
		r9a : {
			name : "矢頭さん",
			model : game.assets["model/nage.l3p.js"],
			init : function(x, y, z) {
				var self = this;

				this.age = 0;
				this.x = x;
				this.y = this.initialY = y;
				this.z = z;
				this.scaleY = 1;
				this.hp = 10;
				this.score = 200;
				this.battle = false;
				this.explosionType = 2;

				// 念のため
				if (this.force) {
					console.warn("forceが残ってたよ");
					this.force.parent = null;
					this.force.remove();
				}

				MyGame.enemyPools["standardforce"].get(function(e) {
					e.init(self);
					MyGame.enemyList.add(e);
					self.force = e;
				});

				this.clearEventListener("kill");
				this.addEventListener("kill", function() {
					if (this.force && this.force.parent === this
							&& this.force.hp > 0) {
						this.force.damage(1000);
					}
				});

				this.clearEventListener("remove");
				this.addEventListener("remove", function() {
					if (this.force && this.force.parent === this) {
						this.force.parent = null;
						this.force.remove();
						this.force = null;
					}
				});
			},
			act : function() {
				this.scaleY += Math.sin(this.age * 0.1) * 0.015;

				if (this.age === 0) {
					this.parentNode.addChild(this.force);
					this.tl.moveTo(0, 0, 3, 30, enchant.Easing.QUAD_EASEOUT)
							.then(function() {
								this.battle = true;
							});
				} else if (this.age === 1200) {
					this.battle = false;
					this.tl.clear();
					this.tl.moveBy(0, 0, -12, 60, enchant.Easing.QUAD_EASEIN);
				}

				// フォース合体
				if (this.intersect(this.force) && this.force.mode !== "connect") {
					this.force.mode = "connect";
				}

				if (!this.battle) {
					return;
				}

				// 避ける動き
				if (this.age % 17 === 0
						&& Math.abs(MyGame.myship.y - this.y) < 0.6) {
					this.tl.clear();
					if (this.y > 0) {
						this.tl.moveBy(0, -random(3, 2.5), 0, 15,
								enchant.Easing.QUAD_EASEOUT).and()
								.rotateRollTo(-1.5, 10).rotateRollTo(0, 10);
					} else {
						this.tl.moveBy(0, random(3, 2.5), 0, 15,
								enchant.Easing.QUAD_EASEOUT).and()
								.rotateRollTo(1.5, 10).rotateRollTo(0, 10);
					}
				} else {
					if (this.age % 90 === 0) {
						this.tl
								.moveTo(0, 0, 3, 15,
										enchant.Easing.QUAD_EASEOUT);
					}
				}

				// フォースコントロール
				if (this.age % 500 === 120) {
					this.force.mode = "shoot";
				} else if (this.age % 500 === 390) {
					this.force.mode = "back";
				}
			}
		},
		standardforce : {
			name : "スタンダードフォース君",
			model : game.assets["model/force2.l3p.js"],
			init : function(parent) {
				this.parent = parent;
				this.mode = "connect";
				this.x = parent.x;
				this.y = parent.y;
				this.z = parent.z - 1;
				this.targetX = 0;
				this.targetY = 0;
				this.targetZ = 0;
				this.speed = 0.05;
				this.hp = 30; // 硬い
				this.explosionType = 2;

				this.inWorld = function() {
					return true;
				};
			},
			act : function() {
				// 各モード時の動き
				if (this.mode === "connect") {
					this.x = this.parent.x;
					this.y = this.parent.y;
					this.z = this.parent.z - 1;
					this.rotateRoll(0.2);
				} else if (this.mode === "shoot") {
					if (this.z > -4) {
						this.z += -0.25;
					} else {
						this.mode = "flow";
					}
				} else if (this.mode === "flow") {
					this.targetX = 0;
					this.targetY = this.parent.y;
					if (MyGame.level === 0) {
						this.targetZ = -3;
					} else if (MyGame.level === 1) {
						this.targetZ = -2;
					} else {
						this.targetZ = -1;
					}
					this.rotateRoll(0.2);
				} else if (this.mode === "back") {
					this.targetX = this.parent.x;
					this.targetY = this.parent.y;
					this.targetZ = this.parent.z;
					this.rotateRoll(-0.2);
				}

				if (this.mode === "flow" || this.mode === "back") {
					if (this.x < this.targetX) {
						this.x += this.speed;
					} else if (this.x > this.targetX) {
						this.x -= this.speed;
					}
					if (Math.abs(this.y - this.targetY) < this.speed) {
						this.y = this.targetY;
					} else {
						if (this.y < this.targetY) {
							this.y += this.speed;
						} else if (this.y > this.targetY) {
							this.y -= this.speed;
						}
					}
					if (Math.abs(this.z - this.targetZ) < this.speed) {
						this.z = this.targetZ;
					} else {
						if (this.z < this.targetZ) {
							this.z += this.speed;
						} else if (this.z > this.targetZ) {
							this.z -= this.speed;
						}
					}

					// 弾を発射
					if (this.age % 30 === 0) {
						if (MyGame.level === 1) {
							EnemyUtil.directionalShot(this, -Math.PI * 0.75);
							EnemyUtil.directionalShot(this, -Math.PI * 1.25);
						} else if (MyGame.level > 1) {
							EnemyUtil.directionalShot(this, -Math.PI * 0.50);
							EnemyUtil.directionalShot(this, -Math.PI * 0.75);
							EnemyUtil.directionalShot(this, -Math.PI * 1.25);
							EnemyUtil.directionalShot(this, -Math.PI * 1.50);
						}
					}
				}

				var theta = (this.age) * 0.2;
				this.scaleY = Math.sin(theta) * 0.3 + 1.0;
				this.scaleZ = Math.cos(theta) * 0.3 + 1.0;
			}
		},
		kurage : {
			name : "ただよい君",
			model : (function() {
				var g = (function() {
					var sur = new Surface(64, 64);
					var ctx = sur.context;
					ctx.fillStyle = "rgba(0, 128, 0, 1)";
					ctx.fillRect(0, 0, 64, 64);
					return sur.toDataURL();
				})();
				var r = (function() {
					var sur = new Surface(64, 64);
					var ctx = sur.context;
					ctx.fillStyle = "rgba(255, 0, 0, 1)";
					ctx.fillRect(0, 0, 64, 64);
					return sur.toDataURL();
				})();
				var s = new Sprite3D();
				for ( var i = 0; i < 15; i++) {
					var c = new Sphere(0.15);
					c.mesh.texture.src = random(2) < 1 ? g : r;
					c.x = random(0, 0.3);
					c.y = random(0, 0.3);
					c.z = random(0, 0.3);
					s.addChild(c);
				}
				return s;
			})(),
			init : function(x, y, z) {
				this.age = 0;
				this.x = x;
				this.y = y;
				this.z = z;
				this.turn = new Quat(random(1), random(1), random(1),
						random(0.1) + 0.01);
				this.hp = 3;
				this.expansionPhase = random(100);
				this.explosionType = 2;
				this.tl.clear();

				this.clearEventListener("kill");
				this.addEventListener("kill", function() {
					if (MyGame.level === 0) {
						EnemyUtil.shotNway(this, null, 2, 0.5, {
							color : "blue",
							speed : 0.1
						});
					} else if (MyGame.level === 1) {
						EnemyUtil.shotNway(this, null, 2, 0.3, {
							color : "blue",
							speed : 0.1
						});
					} else {
						EnemyUtil.shotNway(this, null, 4, 0.5, {
							color : "blue",
							speed : 0.1
						});
					}
				});
			},
			act : function() {
				if (this.age === 600) {
					this.targetX = 0;
					this.targetY = this.y;
					this.targetZ = -6;
					this.tl.moveTo(this.targetX, this.targetY, this.targetZ,
							100, enchant.Easing.QUAD_EASEINOUT);
				} else if (this.age < 600 && this.age % 120 === 0) {
					this.targetX = 0;
					this.targetY = random(0, 8);
					this.targetZ = random(0, 8);
					this.tl.moveTo(this.targetX, this.targetY, this.targetZ,
							119, enchant.Easing.QUAD_EASEINOUT);
				}

				var theta = (this.age + this.expansionPhase) * 0.1;
				this.scaleX = Math.sin(theta) * 0.2 + 1.0;
				this.scaleY = Math.sin(theta) * 0.2 + 1.0;
				this.scaleZ = Math.cos(theta) * 0.2 + 1.0;

				this.rotationApply(this.turn);
			}
		},
		puyo : {
			name : "ぷよ",
			model : game.assets["model/puyo.l3p.js"],
			init : function(x, y, z) {
				this.age = 0;
				this.x = x;
				this.y = y + random(0, 1);
				this.z = z;
				this.hp = 1;
				this.bounding.radius = 0.4;
				this.explosionType = 2;
				this.explosionSize = 0.8;
				this.clearEventListener("kill");
				this.addEventListener("kill", function() {
					if (MyGame.level === 2) {
						EnemyUtil.shot(this);
					}
				});
			},
			act : function() {
				if (this.age % 30 === 0) {
					this.tl.moveBy(0, random(0, 0.6), -(random(1.5) + 0.5), 25,
							enchant.Easing.QUAD_EASEOUT);
				}

				var theta = (this.age * 0.5) * 0.2;
				this.scaleY = Math.sin(theta) * 0.2 + 1.0;

				if (this.z > MyGame.myship.z) {
					if (this.age % 30 === 0) {
						if (random(8) < MyGame.level) {
							EnemyUtil.shot(this, null, {
								speed : 0.22,
								color : "green",
								needle : true
							});
						}
					}
				}
			}
		},
		puyoBack : {
			name : "ぷよ(後から)",
			model : (function() {
				var s = game.assets["model/puyo.l3p.js"].clone();
				s.rotateYaw(Math.PI);
				return s;
			})(),
			init : function(x, y, z) {
				this.age = 0;
				this.x = x;
				this.y = y + random(0, 1);
				this.z = z;
				this.hp = 2;
				this.bounding.radius = 0.4;
				this.explosionType = 2;
				this.explosionSize = 0.8;
				this.clearEventListener("kill");
				this.addEventListener("kill", function() {
					if (MyGame.level === 2) {
						EnemyUtil.shot(this);
					}
				});
			},
			act : function() {
				if (this.age % 30 === 0) {
					this.tl.moveBy(0, random(0, 0.6), (random(1.5) + 0.5), 25,
							enchant.Easing.QUAD_EASEOUT);
				}

				var theta = (this.age * 0.5) * 0.2;
				this.scaleY = Math.sin(theta) * 0.2 + 1.0;

				if (this.z < MyGame.myship.z) {
					if (this.age % 30 === 0) {
						if (random(15) < MyGame.level) {
							EnemyUtil.shot(this, null, {
								speed : 0.22,
								color : "green",
								needle : true
							});
						}
					}
				}
			}
		},
		munimuni : {
			name : "無二無二",
			model : game.assets["model/munimuni.l3p.js"],
			init : function(x, y, z) {
				this.age = 0;
				this.x = x;
				this.y = y;
				this.z = z;
				this.hp = 10;
				this.score = 200;
				this.explosionType = 2;
				this.explosionSize = 2.0;
			},
			act : function() {
				this.forward(-0.015 + Math.sin(this.age * 0.1) * 0.01);
				this.scaleZ = 1.0 + Math.sin(this.age * 0.1) * 0.2;
				if (this.age % 30 > 25 && this.age % 2 === 0) {
					EnemyUtil.directionalShot(this, Math.PI * 0.75
							+ Math.sin(this.age * 0.4) * 0.3, {
						x : 0,
						y : 0.4,
						z : -0.4
					});
				}
			}

		},
		munimuni2 : {
			name : "無二無二(上)",
			model : (function() {
				var s = game.assets["model/munimuni.l3p.js"].clone();
				s.rotateRoll(Math.PI);
				return s;
			})(),
			init : function(x, y, z) {
				this.age = 0;
				this.x = x;
				this.y = y;
				this.z = z;
				this.hp = 10;
				this.score = 200;
				this.explosionType = 2;
				this.explosionSize = 2.0;
			},
			act : function() {
				this.forward(-0.015 + Math.sin(this.age * 0.1) * 0.01);
				this.scaleZ = 1.0 + Math.sin(this.age * 0.1) * 0.2;
				if (this.age % 30 < 6 && this.age % 2 === 0) {
					EnemyUtil.directionalShot(this, Math.PI * -0.75
							+ -Math.sin(this.age * 0.4) * 0.3, {
						x : 0,
						y : -0.4,
						z : -0.4
					});
				}
			}
		},
		ebichan : {
			name : "エビちゃん",
			model : game.assets["model/ebichan.l3p.js"],
			init : function(x, y, z) {
				this.age = 0;
				this.x = x;
				this.y = this.initialY = y;
				this.z = z;
				this.hp = 5;
				this.explosionType = 2;
			},
			act : function() {
				this.y = this.initialY + Math.sin(this.age * 0.05) * 2;
				this.z += -0.04;

				if (this.age % 40 === 0) {
					if (random(5) < MyGame.level) {
						EnemyUtil.shot(this);
					}
				}
			}
		},
		itemCapsule : { // 3
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
		ika : {
			name : "イカ",
			model : game.assets["model/ika.l3p.js"],
			init : function(x, y, z) {
				this.age = 0;
				this.x = x;
				this.y = y;
				this.z = z;
				this.scaleX = 1;
				this.scaleY = 1;
				this.scaleZ = 1;
				this.rotationSet(new Quat(0, 0, 0, 0));
				this.explosionType = 2;
				this.hp = 3;
			},
			act : function() {
				var theta = (this.age * 0.5) * 0.2;
				this.scaleX = Math.cos(theta) * 0.3 + 1.0;
				this.scaleY = Math.sin(theta) * 0.3 + 1.0;
				this.scaleZ = Math.cos(theta) * 0.3 + 1.0;

				if (this.age % 60 === 0) {
					this.tl.moveBy(0, random(2) + 0.5, 0, 50,
							enchant.Easing.QUAD_EASEOUT);
				}

				if (this.age % 60 === 50) {
					if (random(4) < MyGame.level) {
						EnemyUtil.shot(this);
					}
				}

				if (this.y > 4) {
					// 放射弾
					if (MyGame.level === 0) {
						var r = 4;
					} else if (MyGame.level === 1) {
						var r = 6;
					} else {
						var r = 12;
					}
					for ( var i = 0; i < r; i++) {
						var t = Math.PI * 2 / r * i;
						EnemyUtil.directionalShot(this, t);
					}

					this.damage(1000);
				}
			}
		},
		bigmouth : {
			name : "でかい口",
			model : (function() {
				var model = new Sprite3D();
				var inner = new Sprite3D();
				inner.addChild(game.assets["model/bigmouth.l3c.js"]);
				inner.rotateYaw(Math.PI);
				model.addChild(inner);
				model.scaleX = model.scaleY = model.scaleZ = 20.0;
				model.rotateYaw(Math.PI);
				return model;
			})(),
			init : function(x, y, z) {
				this.age = 0;
				this.x = x;
				this.y = y;
				this.z = z;
				this.scaleX = 1;
				this.scaleY = 1;
				this.scaleZ = 1;
				this.bounding.radius = 3.0;
				this.rotationSet(new Quat(0, 0, 0, 0));
				this.explosionType = 2;
				this.explosionSize = 10;

				this.hp = 10;
				this.score = 500;
				this.end = false;

				this.unitRoot = this.body.childNodes[0].childNodes[0];
				this.unitRoot.setPose("");
				this.animate = function() {
					this.unitRoot.animate.apply(this.unitRoot, arguments);
				};

				this.inWorld = function() {
					return true;
				};
			},
			act : function() {
				if (this.age === 0) {
					this.animate("Pose1", 60);

					this.tl//
					.moveBy(0, 5, 0, 60, enchant.Easing.QUAD_EASEIN)
					//
					.delay(10)//
					.moveBy(0, -10, 0, 40, enchant.Easing.QUAD_EASEIN).then(
							function() {
								this.end = true;
							});
				}

				if (this.end) {
					this.remove();
				}
			}
		},
		ka : {
			name : "蚊",
			model : game.assets["model/ka.l3p.js"],
			init : function(x, y, z) {
				this.age = 0;
				this.x = x;
				this.y = y;
				this.z = z;
				this.scaleY = 0;
				this.hp = 10;
				this.score = 200;
				this.rotationSet(new Quat(0, 0, 0, 0));
				this.explosionType = 2;
				this.explosionSize = 2;
			},
			act : function() {
				if (this.age === 0) {
					this.tl.moveTo(0, 2, 3, 20, enchant.Easing.QUAD_EASEIN)//
					.and()//
					.rotateRollTo(Math.PI * 1.9, 20);
				}

				var theta = (this.age * 0.5) * 0.2;
				this.scaleY = Math.sin(theta) * 0.2 + 1.0;

				var interval = 30;
				if (MyGame.level > 1) {
					interval = 15;
				}

				if (this.age % 60 === 0) {
					this.tl.//
					rotateYawTo(-1, interval).and().moveBy(0, -2, 0, interval).//
					rotateYawTo(0, interval).and().moveBy(0, 2, 0, interval);
				}

				if (this.age % (interval * 2) === 0) {
					EnemyUtil.shotNway(this, null, 4, 0.4, {
						color : "green"
					});
				} else if (this.age % interval === 0) {
					EnemyUtil.shotNway(this, null, 5, 0.4, {
						color : "blue"
					});
				}

				if (this.age > 240) {
					this.z -= 0.2;
				}
			}
		},
		jumpFish : {
			name : "跳ねる魚",
			model : new Cube(),
			init : function(x, y, z) {
				this.age = 0;
				this.x = x;
				this.y = y;
				this.z = z;
			},
			act : function() {
			}
		},
		kame : {
			name : "亀",
			model : game.assets["model/kame.l3p.js"],
			init : function(x, y, z) {
				this.age = 0;
				this.x = x;
				this.y = y;
				this.z = z;
				this.hp = 5;
				this.rotationSet(new Quat(0, 1, 0, 0));
				this.rotationApply(new Quat(0, 0, 1, -0.3));
				this.explosionType = 2;
				this.bounding.radius = 0.3;
			},
			act : function() {
				var theta = (this.age * 0.5) * 0.2;
				this.scaleZ = Math.sin(theta) * 0.1 + 1.0;

				var SPEED = 0.04;
				this.z += -SPEED;
				if (this.age % 60 === 0) {
					if (MyGame.level === 1) {
						for ( var i = 0, end = 3; i < end; i++) {
							EnemyUtil.parabolaShot(this, -0.06 + i * 0.06
									- SPEED);
						}
					} else if (MyGame.level > 1) {
						for ( var i = 0, end = 5; i < end; i++) {
							EnemyUtil.parabolaShot(this, -0.06 + i * 0.03
									- SPEED);
						}
					}
				}
			}
		},
		kameBack : {
			name : "亀(後ろから)",
			model : game.assets["model/kame.l3p.js"],
			init : function(x, y, z) {
				this.age = 0;
				this.x = x;
				this.y = y;
				this.z = z;
				this.hp = 5;
				this.rotationSet(new Quat(0, 1, 0, Math.PI));
				this.rotationApply(new Quat(0, 0, 1, 0.3));
				this.explosionType = 2;
			},
			act : function() {
				var theta = (this.age * 0.5) * 0.2;
				this.scaleZ = Math.sin(theta) * 0.1 + 1.0;

				var SPEED = 0.02;
				this.z += SPEED;
				if (this.age % 60 === 0) {
					if (MyGame.level === 1) {
						for ( var i = 0, end = 3; i < end; i++) {
							EnemyUtil
									.parabolaShot(this, -0.1 + i * 0.1 + SPEED);
						}
					} else if (MyGame.level > 1) {
						for ( var i = 0, end = 5; i < end; i++) {
							EnemyUtil.parabolaShot(this, -0.1 + i * 0.05
									+ SPEED);
						}
					}
				}
			}
		},
		floatingUni : {
			name : "フローティングうに",
			model : game.assets["model/uni.l3p.js"],
			init : function() {
				this.age = 0;
				this.x = 0;
				this.y = -6;
				this.z = 2;
				this.hp = 40;
				this.explosionType = 2;
				this.explosionSize = 6;
				this.big = false;
				this.scaleX = this.scaleY = this.scaleZ = 1.0;
				this.bounding.radius = 1.8;
				this.addEventListener("enterframe", function() {
					this.bounding.radius = 1.8 * this.scaleX;
				});
				this.start = false;

				this.baseY = game.background.y;
			},
			act : function() {
				if (this.age === 0) {
					this.tl.moveTo(0, -3.0, 2, 120,
							enchant.Easing.ELASTIC_EASEOUT).then(function() {
						this.start = true;
					});
				} else if (this.age % 80 === 0) {
					this.tl.//
					delay(1).//
					scaleTo(2.0, 30, enchant.Easing.ELASTIC_EASEINOUT).//
					then(function() {
						this.big = true;
					}). //
					delay(30). //
					then(function() {
						this.big = false;
					}). //
					scaleTo(1.0, 30, enchant.Easing.ELASTIC_EASEINOUT);
				}

				if (this.start) {
					var theta = (this.age * 0.5) * 0.2;
					this.y = -3.0 + Math.sin(theta) * 0.2
							+ (game.background.y - this.baseY);

					this.z += -0.002;
				}

				if (this.age % 2 === 0 && this.big) {
					// 放射弾
					if (MyGame.level === 0) {
						var r = 6;
					} else {
						var r = 8;
					}
					for ( var i = 0; i < r; i++) {
						var t = Math.PI * 2 / r * i + this.age * 0.02;
						EnemyUtil.directionalShot(this, t, null, {
							color : "blue",
							needle : true
						});
					}
				}

				this.rotateYaw(0.01);
			}
		},
		missile : {
			name : "ミサイル",
			model : game.assets["model/missile2.l3p.js"],
			init : function(x, y, z, vec, max, speed) {
				this.age = 0;
				this.x = x;
				this.y = y;
				this.z = z;
				this.hp = 0.1;
				this.explosionType = 2;
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
					MyGame.chishibuki(this, this.explosionSize);
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
		greenBall : {
			name : "グリーンボール",
			model : (function() {
				var m = new Sphere(0.4);
				m.mesh.setBaseColor([ 0.0, 1.0, 0.5, 1.0 ]);
				return m;
			})(),
			init : function(enemy, initialZ, initialY, rangeY, gun, gd) {
				this.age = 0;
				this.x = enemy.x + gun.x;
				this.y = enemy.y + gun.y;
				this.z = enemy.z + gun.z;
				this.hp = 0.1;
				this.score = 0;

				if (gd < 0) {
					initialY *= -1;
				}
				this.vec = vec3
						.create([ 0, random(initialY, rangeY), initialZ ]);
				this.G = vec3.create([ 0, -0.005, 0 ]);
				if (gd < 0) {
					this.G[1] *= -1;
				}
			},
			act : function() {
				this.x += this.vec[0];
				this.y += this.vec[1];
				this.z += this.vec[2];
				this.vec = vec3.add(this.vec, this.G);
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

	// グリーンボールを40個追加プール
	for ( var i = 0; i < 40; i++) {
		MyGame.enemyPools["greenBall"].pool(new Enemy(MyGame.enemyData,
				"greenBall"));
	}

	// ボスは１個だけプール
	MyGame.enemyData["boss"] = createStage2BossSpec();
	MyGame.enemyPools["boss"] = [];
	MyGame.enemyPools["boss"].pool(new Enemy(MyGame.enemyData, "boss"));
}
