function createStage2BossSpec() {
	var game = MyGame.game;
	var data = {
		name : "イソギンスマター",
		model : (function() { // boss2は頭と体の２段構成
			var s = new Sprite3D();
			var h = game.assets["model/boss2_head.l3p.js"].clone();
			h.y = 0.2;
			s.addChild(h);
			s.addChild(game.assets["model/boss2_body.l3p.js"].clone());
			return s;
		})(),
		init : function(x, y, z) {
			var self = this;
			this.age = 0;
			this.x = x;
			this.y = game.background.y - 22.5;
			this.z = z;
			this.scaleX = this.scaleY = this.scaleZ = 5.0;
			this.hp = 250;
			this.score = 2000;
			this.bounding.radius = 0.8;
			this.explosionType = 2;
			this.phase1Count = 1;

			this.inWorld = function() {
				return true;
			};
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

			MyGame.bossBattleStart = game.frame;

			this.clearEventListener("kill");
			this
					.addEventListener(
							"kill",
							function() {
								var self = this;

								// 弾を消す
								for ( var i = 0, end = MyGame.enemyBullets.length; i < end; i++) {
									MyGame.enemyBullets[i].remove();
								}
								MyGame.enemyBullets.disposeAll();
								for ( var i = 0, end = MyGame.enemyBulletsB.length; i < end; i++) {
									MyGame.enemyBulletsB[i].remove();
								}
								MyGame.enemyBulletsB.disposeAll();

								// 敵を消す
								MyGame.enemyList.forEach(function(e) {
									if (self != e) {
										e.remove();
									}
								});

								// 自機に追随するカメラの動きを抑制
								MyGame.performance = true;

								// カメラをボスに向ける
								MyGame.camPos.tl.moveTo(this.x - 10,
										this.y + 2, this.z, 60,
										enchant.Easing.QUAD_EASEIN).delay(15)
										.moveTo(this.x - 20, this.y + 9,
												this.z, 120);

								MyGame.camTar.tl
										.moveTo(this.x, this.y + 1.5, this.z,
												60, enchant.Easing.QUAD_EASEIN)
										.//
										delay(15)
										.then(
												function() {
													var em = 0;
													self
															.addEventListener(
																	'enterframe',
																	function() {
																		// 小爆発
																		if (game.frame % 20 === 0) {
																			MyGame
																					.explode(
																							{
																								x : self.x
																										+ random(
																												0,
																												2),
																								y : self.y
																										+ 1
																										+ random(
																												0,
																												3),
																								z : self.z
																										+ random(
																												0,
																												4)
																							},
																							random(
																									2,
																									0.5));
																		}
																		// 明るくしていく
																		self
																				.applyRecursive(function(
																						node) {
																					if (node.mesh
																							&& node.mesh.texture) {
																						node.mesh.texture.emission = [
																								em,
																								em,
																								em * 0.25,
																								1.0 ];
																					}
																				});
																		// フレア
																		MyGame
																				.drawEffect(function(
																						l) {
																					var ctx = l.image.context;
																					var cw = game.width / 2;
																					var ch = game.height / 2;
																					var g = ctx
																							.createRadialGradient(
																									cw,
																									ch,
																									0,
																									cw,
																									ch,
																									200);
																					g
																							.addColorStop(
																									0,
																									"rgba(255,255,255,"
																											+ em
																											+ ")");
																					g
																							.addColorStop(
																									1,
																									"rgba(255,255,0,0.0)");
																					ctx.fillStyle = g;
																					ctx
																							.fillRect(
																									0,
																									0,
																									game.width,
																									game.height);
																				});
																		em += 1.0 / 120;
																		if (em > 1.5) {
																			self
																					.applyRecursive(function(
																							node) {
																						if (node.mesh
																								&& node.mesh.texture) {
																							node.mesh.texture.emission = [
																									0,
																									0,
																									0,
																									1.0 ];
																						}
																					});
																			self
																					.addEventListener(
																							"enterframe",
																							function() {
																								this.scaleX = this.scaleZ = Math
																										.sin(this.age * 0.2) * 0.4 + 5.0;
																								this.scaleY = Math
																										.cos(this.age * 0.1) * 0.01 + 5.0;
																								if (game.frame % 10 === 0) {
																									MyGame
																											.chishibuki(
																													{
																														x : self.x
																																+ random(
																																		0,
																																		2),
																														y : self.y
																																+ 2
																																+ random(
																																		0,
																																		1),
																														z : self.z
																																+ random(
																																		0,
																																		4)
																													},
																													random(
																															4,
																															0.5));
																									MyGame
																											.explode(
																													{
																														x : self.x
																																+ random(
																																		0,
																																		2),
																														y : self.y
																																+ random(
																																		0,
																																		3),
																														z : self.z
																																+ random(
																																		0,
																																		4)
																													},
																													random(
																															2,
																															0.5));
																								}
																							});
																			this
																					.removeEventListener(
																							"enterframe",
																							arguments.callee);
																		}
																	});
												}).delay(120).then(function() {
											superExplosion();
										}).delay(30).//
										then(function() {
											self.body.childNodes[0].remove();
										}).//
										delay(80).then(function() {
											game.stageClear(3, MyGame.level);
										});
							});
		},
		act : function() {
			var self = this;

			// Y軸は水底に固定
			this.y = game.background.y - 22.5;

			if (this.hp <= 0) {
				return;
			}

			// 体の動作
			var theta = (this.age * 0.2) * 0.2;

			var head = this.body.childNodes[0];
			head.rotateYaw(Math.PI * 0.005);
			head.scaleY = Math.sin(theta) * 0.10 + 1.0;

			var body = this.body.childNodes[1];
			body.scaleX = Math.sin(theta) * 0.20 + 1.0;

			var phaseTime = 250;
			var phase = ~~(this.age / phaseTime) % 3;
			var phaseAge = this.age % phaseTime;
			if (this.age % phaseTime === 0) {
				this.phase1Count *= -1;
				console.log(this.phase1Count);
			}

			switch (phase) {
			case 0:
				phase0.call(this, phaseAge);
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

	// 連続エネルギー波で追い詰めてくるぞ
	var phase0 = function(phaseAge) {
		if (phaseAge % 5 === 0 && phaseAge % 30 !== 0 && phaseAge % 30 !== 5) {
			EnemyUtil.shot(this, null, {
				speed : 0.1
			});
		}
	};

	// 拡散弾を口から吐き出す
	var phase1 = function(phaseAge) {
		if (phaseAge % 6 === 0) {
			for ( var i = 0; i < 4; i++) {
				var gun = {
					x : 0,
					y : 2.0 + Math.sin(this.age * 0.1) * 1.5,
					z : 0
				};
				var self = this;
				MyGame.enemyPools["greenBall"].get(function(e) {
					var z = (-0.15 + i * 0.1 - random(0.004)) * 0.8;
					var y = 0.1;
					var ry = 0.075;
					e.init(self, z, y, ry, gun, self.phase1Count);
					self.parentNode.addChild(e);
					MyGame.enemyList.add(e);
				});
			}
		}
	};

	// 魚人型ミサイル発射
	var phase2 = function(phaseAge) {
		var self = this;
		if (phaseAge === 0) {
			for ( var i = 0; i < 6; i++) {

				MyGame.enemyPools["kurage"].get(function(e) {
					e.init(0, self.y + 2.0, self.z);
					self.parentNode.addChild(e);
					MyGame.enemyList.add(e);
				});
			}
		}
		if (phaseAge % 50 === 0) {
			MyGame.enemyPools["missile"].get(function(e) {
				var r = ~~(random(3));
				e.init(0, self.y + 2.0, self.z + (r - 1.0), [ 0, 1, r ]);
				self.scene.mainLayer.addChild(e);
				MyGame.enemyList.add(e);
				self.addEventListener("kill", function() {
					if (e.parentNode) {
						e.remove();
					}
					this.removeEventListener("kill", arguments.callee);
				});
			});
		}
	}

	return data;
}
