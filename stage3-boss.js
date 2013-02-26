function createStage3BossSpec() {
	// 定数
	var EIO = enchant.Easing.QUAD_EASEINOUT;
	var EI = enchant.Easing.QUAD_EASEIN;
	var EO = enchant.Easing.QUAD_EASEOUT;
	var game = MyGame.game;
	var m = MyGame.myship;
	// フェイズの時間
	var PHASE_TIME = [];
	// フェイズ0用
	var P0 = {
		head : { // 頭部3way砲
			guns : [ {
				x : 0,
				y : -0.08,
				z : -0
			}, {
				x : 0,
				y : 0.08,
				z : -0
			} ],
			bullet : {
				needle : true,
				color : "blue"
			}
		},
		mouth : { // 口部1way砲
			gun : {
				x : 0,
				y : 0,
				z : -0.8
			},
			bullet : {
				needle : true,
				speed : 0.18,
				radius : 2.0,
				color : "red"
			}
		},
		chest : { // 胸部2way砲x3
			guns : [ {
				x : 0,
				y : -1.0,
				z : 1.0
			}, {
				x : 0,
				y : -1.0,
				z : 2.0
			}, {
				x : 0,
				y : -1.0,
				z : 3.0
			} ],
			bullet : {
				needle : true,
				color : "yellow",
				speed : 0.25
			}
		},
		back : { // 背部2way砲x3
			guns : [ {
				x : 0,
				y : 0.8,
				z : 1.0
			}, {
				x : 0,
				y : 0.8,
				z : 2.0
			}, {
				x : 0,
				y : 0.8,
				z : 3.0
			} ],
			bullet : {
				needle : true,
				color : "yellow",
				speed : 0.25
			}
		}
	};
	// フェイズ1用
	var P1 = {
		guns : [ { // ４本の脚
			x : 0,
			y : 3.4,
			z : -1.2
		}, {
			x : 0,
			y : 4.4,
			z : 1.2
		}, {
			x : 0,
			y : -3.4,
			z : -1.2
		}, {
			x : 0,
			y : -4.4,
			z : 1.2
		} ],
		bullets : [ {
			radius : 2.5,
			color : "blue",
			speed : 0.0,
			accel : 0.001,
			defendable : false
		}, {
			radius : 3.0,
			color : "yellow",
			speed : 0.2,
			accel : -0.004,
			defendable : false
		} ]
	};
	// フェイズ2用
	var P2 = {
		chest : { // 胸部2way砲x3
			guns : [ {
				x : 0,
				y : -0.5,
				z : 1.0
			}, {
				x : 0,
				y : -1.5,
				z : 1.3
			}, {
				x : 0,
				y : -2.5,
				z : 1.6
			} ],
			bullet : {
				needle : true,
				color : "yellow",
				speed : 0.20
			}
		}
	};

	// 自機が衝突するミスになる領域.攻撃を当ててもボスにダメージは入らない.
	var damageZones = [];
	var DamageZone = Class.create(Sprite3D, {
		initialize : function(parent, x, y, z, radius) {
			Sprite3D.call(this);
			this.parent = parent;
			this.x = parent.x + x;
			this.y = parent.y + y;
			this.z = parent.z + z;
			this.bounding.radius = radius;
			this.addEventListener("enterframe", function() {
				this.x = parent.x + x;
				this.y = parent.y + y;
				this.z = parent.z + z;
				if (this.intersect(m)) {
					m.damage();
				}
			});
			var self = this;
			game.addEventListener("restart", function() {
				self.remove();
			});
			damageZones.push(this);
			MyGame.scene.mainLayer.addChild(this);

			// TODO debug
			// this.addChild(new Sphere(radius));
		}
	});
	DamageZone.clear = function() {
		damageZones.forEach(function(dz) {
			dz.remove();
		});
		damageZones = [];
	};

	// ミドリさんHM生成
	var genMidori = function(y, z, initialPitch) {
		MyGame.enemyPools["midoriHM"].get(function(e) {
			e.init(0, y, z, initialPitch);
			MyGame.scene.mainLayer.addChild(e);
			MyGame.enemyList.add(e);
		});
	};

	var phaseFunc = [];

	// フェイズ0.上下に移動しながら激しく攻撃.
	PHASE_TIME[0] = 1000;
	phaseFunc[0] = function() {
		var self = this;

		// 攻撃判定
		DamageZone.clear();
		// 胸
		new DamageZone(this, 0, 0, 2, 1.0);
		// 腹
		new DamageZone(this, 0, 0, 4, 1.3);

		// 上下に移動
		if (this.phaseAge === 0) {
			this.fire = false;
			this.tl.//
			moveTo(0, 3, 3, 200, EIO).//
			moveTo(0, 0, 0, 200, EIO).//
			moveTo(0, -3, 3, 200, EIO).//
			loop();
		} else if (this.phaseAge === 30) {
			this.fire = true;
		}
		// 脚をワシャワシャ
		if (this.phaseAge % 40 === 0) {
			this.animate("Pose4_2", 20);
		} else if (this.age % 20 === 0) {
			this.animate("Pose3_2", 20);
		}

		if (this.fire) { // 攻撃
			// 額から3way弾x2
			if (this.phaseAge % 1 === 0) {
				if (this.counter1 < 3) {
					P0.head.bullet.speed = 0.18 - this.counter1 * 0.03;
					EnemyUtil.directionalShot(this, Math.PI + 0.0,
							P0.head.guns[0], P0.head.bullet);
					EnemyUtil.directionalShot(this, Math.PI - 0.5,
							P0.head.guns[0], P0.head.bullet);
					EnemyUtil.directionalShot(this, Math.PI + 0.5,
							P0.head.guns[0], P0.head.bullet);
					EnemyUtil.directionalShot(this, Math.PI + 0.0,
							P0.head.guns[1], P0.head.bullet);
					EnemyUtil.directionalShot(this, Math.PI - 0.5,
							P0.head.guns[1], P0.head.bullet);
					EnemyUtil.directionalShot(this, Math.PI + 0.5,
							P0.head.guns[1], P0.head.bullet);
				} else if (this.counter1 == 34) {
					this.counter1 = -1;
				}
				this.counter1 += 1;
			}
			// 口から自機狙い弾
			if (m.z < this.z && this.phaseAge % 4 === 0) {
				if (this.counter2 < 3) {
					EnemyUtil.shot(this, P0.mouth.gun, P0.mouth.bullet);
				} else if (this.counter2 == 20) {
					this.counter2 = -1;
				}
				this.counter2 += 1;
			}
			// 背中と腹から上へ2way弾
			if (this.phaseAge % 4 === 0) {
				if (this.counter3 < 5) {
					P0.back.guns.forEach(function(gun) {
						EnemyUtil.directionalShot(self, Math.PI * 3 / 8, gun,
								P0.back.bullet);
						EnemyUtil.directionalShot(self, Math.PI * 5 / 8, gun,
								P0.back.bullet);
					});
					P0.chest.guns.forEach(function(gun) {
						EnemyUtil.directionalShot(self, Math.PI * -3 / 8, gun,
								P0.chest.bullet);
						EnemyUtil.directionalShot(self, Math.PI * -5 / 8, gun,
								P0.chest.bullet);
					});
				} else if (this.counter3 == 15) {
					this.counter3 = -1;
				}
				this.counter3 += 1;
			}
		} // 攻撃ここまで
	}; // フェイズ0ここまで

	// フェイズ1.前足・中足から大型弾を撃ちまくる.
	PHASE_TIME[1] = 500;
	phaseFunc[1] = function() {
		var self = this;
		if (this.phaseAge === 0) { // フェイズ開始
			this.fire = false;
			DamageZone.clear();
			this.tl.//
			moveTo(0, 0, 5, 60, EIO).//
			delay(10).then(function() {
				this.animate("Pose1_2", 25);
			}).//
			moveTo(0, 0, 0, 30, EI).then(function() {
				this.animate("Pose1_3", 25, function() {
					// 攻撃判定
					// 爪
					new DamageZone(self, 0, 1.2, -2.8, 0.2);
					new DamageZone(self, 0, 1.4, -2.2, 0.2);
					new DamageZone(self, 0, 1.5, -1.6, 0.2);
					new DamageZone(self, 0, -1.2, -2.8, 0.2);
					new DamageZone(self, 0, -1.4, -2.2, 0.2);
					new DamageZone(self, 0, -1.5, -1.6, 0.2);

					// 胸
					new DamageZone(self, 0, 0, 2, 2.2);
					// 腹
					new DamageZone(self, 0, 0, 4, 2.0);

					// 攻撃開始
					self.fire = true;
				});
			}).then(function() {
				this.tl.//
				moveTo(0, 1, 2.5, 200, EIO).//
				moveTo(0, 0, -0.5, 200, EIO).//
				moveTo(0, -1, 2.5, 200, EIO).//
				moveTo(0, 0, -0.5, 200, EIO).//
				loop();
			});
		} // フェイズ開始ここまで

		if (this.fire) { // 攻撃
			if (this.phaseAge % 25 === 0) {
				var idx = (this.phaseAge / 25) % P1.guns.length;
				var rnd = randomInt(2);
				var gatherEffect = [ MyGame.gatherBlueFixed, MyGame.gatherFixed ];
				gatherEffect[rnd](self, {
					x : 0,
					y : P1.guns[idx].y,
					z : P1.guns[idx].z
				}, 1.5, {
					step : 2,
					callback : function() {
						MyGame.shockwave({
							x : 0,
							y : self.y + P1.guns[idx].y,
							z : self.z + P1.guns[idx].z
						}, 2.0);
						EnemyUtil.shot(self, P1.guns[idx], P1.bullets[rnd]);
					}
				});
			}
		} // 攻撃ここまで
	}; // フェイズ1ここまで

	// フェイズ2.体を起こして攻撃.
	PHASE_TIME[0] = 1200;
	phaseFunc[2] = function() {
		var self = this;
		if (this.phaseAge === 0) { // フェイズ開始
			this.fire = false;
			DamageZone.clear();

			this.tl.moveTo(0, 3, 4, 200, EIO).//
			then(function() {
				this.animate("Pose2_2", 30, function() {
					// 攻撃判定

					// 動き
					self.tl.//
					moveTo(0, 5, 2, 100, EO).//
					moveTo(0, 2, 1, 100, EI).//
					moveTo(0, -1, 2, 100, EO).//
					moveTo(0, 2, 0, 100, EI).//
					moveTo(0, 6, 1, 100, EO).//
					moveTo(0, 2, 0, 100, EI).//
					moveTo(0, -1, 0, 100, EO).//
					moveTo(0, 2, 1, 100, EI).//
					loop();

					// 攻撃開始
					self.fire = true;
				});
			});
		} // フェイズ開始ここまで

		if (this.fire) { // 攻撃
			// 胸から2way弾x3
			if (this.phaseAge % 4 === 0) {
				if (this.counter3 < 5) {
					P2.chest.guns.forEach(function(gun) {
						EnemyUtil.directionalShot(self, Math.PI + 2 / 8, gun,
								P2.chest.bullet);
						EnemyUtil.directionalShot(self, Math.PI + 6 / 8, gun,
								P2.chest.bullet);
					});
				} else if (this.counter3 == 20) {
					this.counter3 = -1;
				}
				this.counter3 += 1;
			}

			// ミドリ発進
			if (this.phaseAge % 8 === 0) {
				if (this.counter4 < 5) {
					genMidori(this.y - 3.5, this.z + 1.3, Math.PI * 0.25);
				} else if (this.counter4 < 10) {
					genMidori(this.y - 4.0, this.z + 1.3, 0);
				} else if (this.counter4 < 15) {
					genMidori(this.y - 4.5, this.z + 1.0, -Math.PI * 0.25);
				} else {
					this.counter4 = -1;
				}
				this.counter4 += 1;
			}
		} // 攻撃ここまで
	}; // フェイズ2ここまで

	// フェイズ3.極太レーザー.
	PHASE_TIME[3] = 10;
	phaseFunc[3] = function() {
		var self = this;
		if (this.phaseAge === 0) { // フェイズ開始
		} // フェイズ開始ここまで
	}; // フェイズ3ここまで

	// フェイズ4.
	PHASE_TIME[4] = 10;
	phaseFunc[4] = function() {
		var self = this;
		if (this.phaseAge === 0) { // フェイズ開始
		} // フェイズ開始ここまで
	}; // フェイズ4ここまで

	// フェイズ5.
	PHASE_TIME[5] = 10;
	phaseFunc[5] = function() {
		var self = this;
		if (this.phaseAge === 0) { // フェイズ開始
		} // フェイズ開始ここまで
	}; // フェイズ5ここまで

	// 撃破時
	var destroy = function() {
		var self = this;
		MyGame.performance = true;
		this.tl.clear().unloop();
		this.unitRoot.cancelAnimation();

		this.addEventListener("enterframe", function() {
			if (game.frame % 10 === 0) {
				MyGame.explode({
					x : this.x + random(0, 4),
					y : this.y - 1 + random(0, 4),
					z : this.z + random(0, 4)
				}, random(2, 0.5));
			}
		});
		MyGame.camPos.tl.moveTo(this.x - 15, this.y, this.z - 10, 300, EIO);
		MyGame.camTar.tl.moveTo(this.x, this.y, this.z, 60, EIO).//
		then(
				function() {
					var em = 0;
					self.addEventListener("enterframe", function() {
						self.applyRecursive(function(node) {
							if (node.mesh && node.mesh.texture)
								node.mesh.texture.emission = [ em, em,
										em * 0.25, 1.0 ];
						});
						MyGame.drawEffect(function(l) {
							var ctx = l.image.context;
							var cx = game.width / 2;
							var cy = game.height / 2;
							var g = ctx.createRadialGradient(cx, cy, 0, cx, cy,
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
			self.remove();
		}).//
		delay(80).then(function() {
			game.stageClear(1, MyGame.level + 1);
		});
	};

	var data = {
		name : "",
		model : (function() {
			var result = new Sprite3D();
			result.addChild(game.assets["model/boss3.l3c.js"]);
			result.scaleX = result.scaleY = result.scaleZ = 1.5;
			return result;
		})(),
		init : function(x, y, z) {
			this.inScreen = function() {
				return true;
			};
			this.inWorld = function() {
				return true;
			};

			this.x = x;
			this.y = y;
			this.z = z;
			this.hp = 500;
			this.phase = 0;
			this.bounding.radius = 0.5;
			this.rotationSet(new Quat(0, 1, 0, Math.PI));
			this.unitRoot = this.body.childNodes[0];
			this.animate = function() {
				this.unitRoot.animate.apply(this.unitRoot, arguments);
			};

			// 戦闘開始フラグ
			this._started = false;
			this.startBattle = function() {
				this.age = 0;
				this.phaseAge = 0;
				this._started = true;
				MyGame.bossBattleStart = game.frame;
			}

			// 頭部3way砲
			this.counter1 = 0;
			// 口部1way砲
			this.counter2 = 0;
			// 胸部&背部2way砲x3
			this.counter3 = 0;
			// ミドリ
			this.counter4 = 0;

			// ポーズ初期化
			this.body.childNodes[0].setPose("_initialPose");

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

			this.clearEventListener("kill");
			this.addEventListener("kill", function() {
				// 衝突判定削除
				DamageZone.clear();
				this.bounding.threshold = -1000;
				// 敵を消去
				MyGame.enemyList.forEach(function(e) {
					if (e !== self) {
						e.damage(1000);
					}
				});
				// 敵弾を消去
				[ MyGame.enemyBullets, MyGame.enemyBulletsG,
						MyGame.enemyBulletsB, MyGame.enemyBulletsY ]
						.forEach(function(pool) {
							pool.forEach(function(b) {
								b.remove();
							})
						});
			});
			this.addEventListener("kill", destroy);

			if (!this.hpLabel) {
				this.hpLabel = new Label();
				this.hpLabel._style.color = "#ffffff";
				this.hpLabel.y = 50;
				MyGame.game.rootScene.addChild(this.hpLabel);
			}
		},
		act : function() {
			if (!this._started || this.hp <= 0) {
				return;
			}

			if (PHASE_TIME[this.phase] === this.phaseAge) {
				this.phase = (this.phase + 1) % phaseFunc.length
				this.phaseAge = 0;
				this.tl.clear().unloop();
			}
			phaseFunc[this.phase].call(this);
			this.phaseAge += 1;

			this.hpLabel.text = ~~(this.hp);
		}
	};

	return data;
}
