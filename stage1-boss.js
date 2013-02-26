function createStage1BossSpec() {
	var game = MyGame.game;
	var fireMissile = function(self) {
		self.animate("missile", 5, function() {
			self.animate("", 10);
		});
		MyGame.enemyPools[9].get(function(e) {
			e.init(0, self.y + 0.5, self.z + 1.0, [ 0, 1, -1 ]);
			self.scene.mainLayer.addChild(e);
			MyGame.enemyList.add(e);
		});
		if (MyGame.level > 0) {
			MyGame.enemyPools[9].get(function(e) {
				e.init(0, self.y + 0.6, self.z + 1.4, [ 0, 1, 0 ]);
				self.scene.mainLayer.addChild(e);
				MyGame.enemyList.add(e);
			});
			MyGame.enemyPools[9].get(function(e) {
				e.init(0, self.y + 0.7, self.z + 1.8, [ 0, 1, 1 ]);
				self.scene.mainLayer.addChild(e);
				MyGame.enemyList.add(e);
			});
		}
		if (MyGame.level > 1 || self.age >= 1800) {
			MyGame.enemyPools[9].get(function(e) {
				e.init(0, self.y - 0.5, self.z + 1.0, [ 0, -1, -1 ]);
				self.scene.mainLayer.addChild(e);
				MyGame.enemyList.add(e);
			});
			MyGame.enemyPools[9].get(function(e) {
				e.init(0, self.y - 0.6, self.z + 1.4, [ 0, -1, 0 ]);
				self.scene.mainLayer.addChild(e);
				MyGame.enemyList.add(e);
			});
			MyGame.enemyPools[9].get(function(e) {
				e.init(0, self.y - 0.7, self.z + 1.8, [ 0, -1, 1 ]);
				self.scene.mainLayer.addChild(e);
				MyGame.enemyList.add(e);
			});
		}
	}

	// Phase0。
	// 上下に動きながらバルカン連射。
	// 随伴機が死んでいたら新たに召喚。
	// 随伴機からは放射状に弾を発射。
	var phase0 = function(phaseAge, phaseTime) {
		var self = this;

		if (phaseAge === 0) {
			this.animate("", 10);
			this.tl.moveTo(0, 0, 3, 30, enchant.Easing.QUAD_EASEINOUT);

			// 随伴機を２機召喚
			// 1機目
			if (MyGame.level > 1) {
				if (!this.supports[0]) {
					MyGame.enemyPools[8].get(function(e) {
						e.init(0, -4, 5);
						self.parentNode.addChild(e);
						MyGame.enemyList.add(e);
						self.supports[0] = e;
						e.addEventListener("remove", function() {
							self.supports[0] = null;
							this
									.removeEventListener("remove",
											arguments.callee);
						});
					});
				}
			}
			// 2機目
			if (!this.supports[1]) {
				MyGame.enemyPools[8].get(function(e) {
					e.init(0, 4, 5);
					self.parentNode.addChild(e);
					MyGame.enemyList.add(e);
					self.supports[1] = e;
					e.addEventListener("remove", function() {
						self.supports[1] = null;
						this.removeEventListener("remove", arguments.callee);
					});
				});
			}
		} else if (phaseAge % 40 === 0) {
			this.tl.moveTo(0, MyGame.myship.y, 3, 15,
					enchant.Easing.QUAD_EASEINOUT) //
			.then(function() {
				if (MyGame.level === 1 && this.age < 1800) {
					this.animate("shot", 10, function() {
						self.vullcanTrigger = true;
					});
				} else {
					this.animate("shot", 5, function() {
						self.vullcanTrigger = true;
					});
				}
			}) //
			.delay(20) //
			.then(function() {
				this.vullcanTrigger = false;
				if (MyGame.level < 2 && this.age < 1800) {
					// 2周目は構えを解かない
					this.animate("", 5);
				}
			}) //
			.delay(5);
		}

		// 撃ち方やめ
		if (phaseAge === phaseTime - 1) {
			this.vullcanTrigger = false;
		}

		// バルカン発射
		if (this.age % 2 === 0 && this.vullcanTrigger) {
			EnemyUtil.directionalShot(this, random(Math.PI, 0.25), {
				x : 0.0,
				y : 0.2,
				z : -1.5
			}, {
				speed : 0.25,
				color : "blue",
				radius : 2.0,
				needle : true
			});
		}
		// 随伴機から放射弾
		if (phaseAge % 10 === 0) {
			var t = Math.cos(this.age * 0.03) + 0.9;
			if (this.supports[0]) {
				EnemyUtil.directionalShot(this.supports[0], Math.PI - t, null,
						{
							speed : 0.06
						});
			}
			if (this.supports[1]) {
				EnemyUtil.directionalShot(this.supports[1], Math.PI + t, null,
						{
							speed : 0.06
						});
			}
		}
	};

	var phase1 = function(phaseAge) {
		if (phaseAge === 0) {
			this.animate("", 10);

			// 随伴機を前へ飛ばす
			if (this.supports[0]) {
				this.supports[0].goAhead = true;
			}
			if (this.supports[1]) {
				this.supports[1].goAhead = true;
			}
		}

		if (this.age % 80 === 0) {
			this.tl//
			.moveTo(0, -2, 1.5, 30, enchant.Easing.QUAD_EASEINOUT) //
			.then(function() {
				fireMissile(this);
			}).delay(20) //
			.moveBy(0, 3, 0, 30, enchant.Easing.QUAD_EASEINOUT) //
			.then(function() {
				fireMissile(this);
			}).delay(20);
		}
	};

	var phase2 = function(phaseAge) {
		if (phaseAge % 100 === 0) {
			this.animate("", 20);
			this.tl// 
			.moveTo(0, this.y, 3, 30, enchant.Easing.QUAD_EASEINOUT) //
			.then(function() {
				this.animate("attack1", 10);
			}) //
			.delay(10) //
			.then(
					function() {
						if (MyGame.level === 0) {
							var time = 30;
						} else if (MyGame.level === 1) {
							var time = 20;
						} else if (MyGame.level > 1 || this.age >= 1800) {
							var time = 15;
						}
						this.animate("attack1", time - 5, function() {
							this.animate("attack2", 5);
						});
						this.tl.moveTo(0, MyGame.myship.y, MyGame.myship.z,
								time, enchant.Easing.EXPO_EASEIN) //
						.delay(10) //
						.then(function() {
							this.animate("", 10);
						});
					});
		}
	};

	var bossExplosion = function() {
		var boss = this;
		MyGame.performance = true;
		this.tl.clear();
		this.unitRoot.cancelAnimation();

		boss.animate("death", 300);
		boss.addEventListener("enterframe", function() {
			if (game.frame % 10 === 0) {
				MyGame.explode({
					x : boss.x + random(0, 2),
					y : boss.y - 1 + random(0, 2),
					z : boss.z + random(0, 2)
				}, random(2, 0.5));
			}
		});
		MyGame.camPos.tl.moveTo(this.x - 10, this.y + 10, this.z - 10, 240,
				enchant.Easing.QUAD_EASEIN);
		MyGame.camTar.tl.moveTo(this.x, this.y, this.z, 60,
				enchant.Easing.QUAD_EASEIN).//
		then(
				function() {
					var em = 0;
					boss.addEventListener("enterframe", function() {
						boss.applyRecursive(function(node) {
							if (node.mesh && node.mesh.texture)
								node.mesh.texture.emission = [ em, em,
										em * 0.25, 1.0 ];
						});
						MyGame.drawEffect(function(l) {
							var ctx = l.image.context;
							var cw = game.width / 2;
							var ch = game.height / 2;
							var g = ctx.createRadialGradient(cw, ch, 0, cw, ch,
									200);
							g.addColorStop(0, "rgba(255,255,255," + em + ")");
							g.addColorStop(1, "rgba(255,255,0,0.0)");
							ctx.fillStyle = g;
							ctx.fillRect(0, 0, game.width, game.height);
						});
						em += 1.0 / 120;
					});
					MyGame.gatherLarge(this, 10);
				}).delay(20).//
		then(function() {
			MyGame.gatherLarge(this, 5);
		}).delay(20).//
		then(function() {
			MyGame.gatherLarge(this, 5);
		}).delay(90).//
		then(function() {
			playSound("explode_super.mp3");
			superExplosion();
		}).delay(30).//
		then(function() {
			boss.remove();
		}).//
		delay(80).then(function() {
			game.stageClear(2, MyGame.level);
		});

	};

	var data = {
		name : "赤坂さん",
		model : (function() {
			var bossModel = new Sprite3D();
			var inner = new Sprite3D();
			inner.addChild(game.assets["model/boss1.l3c.js"]);
			inner.z = 0.2;
			inner.y = -0.9;
			bossModel.addChild(inner);
			var size = 2.5;
			bossModel.scale(size, size, size);
			return bossModel;
		})(),
		init : function(x, y, z) {
			var self = this;

			this.age = 0;
			this.x = x;
			this.y = y;
			this.z = z;
			this.hp = 200;
			this.score = 2000;
			this.bounding.radius = 0.8;
			this.showBounding();
			this.explosionType = -1;
			this.killed = false;
			this.kill = function() {
				if (this.killed) {
					return;
				}
				this.killed = true;
				MyGame.bossBattleTime = game.frame - MyGame.bossBattleStart;

				this.bounding.threshold = -1;

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
				game.incrScore(this.score * megaRate);

				this.lightOff();
				this.dispatchEvent(new Event("kill")); // killイベント発生
			};

			this.rotationSet(new Quat(0, 1, 0, Math.PI));

			this.unitRoot = this.body.childNodes[0].childNodes[0];
			this.animate = function() {
				this.unitRoot.animate.apply(this.unitRoot, arguments);
			};

			this.supports = [ null, null ];

			this.vullcanTrigger = false;

			this.clearEventListener("kill");
			this
					.addEventListener(
							"kill",
							function() {
								// 残っている敵を破壊
								// 敵を消去
								MyGame.enemyList.forEach(function(e) {
									if (e !== self) {
										e.damage(e.hp * 2);
									}
								});

								// 敵の弾を消去
								for ( var i = 0, end = MyGame.enemyBullets.length; i < end; i++) {
									MyGame.enemyBullets[i].remove();
								}
								MyGame.enemyBullets.disposeAll();
								for ( var i = 0, end = MyGame.enemyBulletsB.length; i < end; i++) {
									MyGame.enemyBulletsB[i].remove();
								}
								MyGame.enemyBulletsB.disposeAll();
							});
			this.addEventListener("kill", bossExplosion);

			// 常にtrue
			this.inWorld = function() {
				return true;
			}
			this.inScreen = function() {
				return true;
			}

			MyGame.bossBattleStart = game.frame;
		},
		act : function() {
			var self = this;

			if (this.hp <= 0) {
				return;
			}

			// 1フェイズの時間
			var phaseTime = 200;
			// フェイズは3段階
			var phase = ~~(this.age / phaseTime) % 3;
			// 現在フェイズが始まってからの時間
			var phaseAge = this.age % phaseTime;
			if (phaseAge === 0) {
				this.tl.clear();
			}

			switch (phase) {
			case 0:
				phase0.call(this, phaseAge, phaseTime);
				break;
			case 1:
				phase1.call(this, phaseAge);
				break;
			case 2:
				phase2.call(this, phaseAge);
				break;
			}
		}
	};

	return data;
}
