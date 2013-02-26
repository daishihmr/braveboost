/** 自機クラス */
var MyShip;

(function() {

	/** 自機クラス定義 */
	var _myshipSpec = {
		initialize : function() {
			enchant.gl.Sprite3D.apply(this);

			var game = MyGame.game;
			var self = this;

			this.addChild(game.assets["model/fighter.l3p.js"].clone());

			// バックファイア
			this.addChild((function() {
				var result = new Sprite3D();

				var r = game.assets["model/blue-fire.l3p.js"].clone();
				r.scale(0.4, 0.8, 0.5);
				r.x = 0.15;
				result.addChild(r);

				var l = game.assets["model/blue-fire.l3p.js"].clone();
				l.scale(0.4, 0.8, 0.5);
				l.x = -0.15;
				result.addChild(l);

				result.z = -0.3;
				result.size = 5.0;
				result.addEventListener("enterframe", function() {
					this.scaleZ = Math.sin(this.age * 2.0) * 2.0 + this.size;
				});

				self.backfire = result;
				return result;
			})());

			// オプション
			this
					.addChild((function() {
						var optionR = self.optionR = game.assets["model/option_r.l3p.js"]
								.clone();
						optionR.visible = false;
						optionR.addEventListener("enterframe", function() {
							this.rotateRoll(0.1);
						});
						return optionR;
					})());
			this
					.addChild((function() {
						var optionB = self.optionB = game.assets["model/option_b.l3p.js"]
								.clone();
						optionB.visible = false;
						optionB.addEventListener("enterframe", function() {
							this.rotateRoll(0.1);
						});
						return optionB;
					})());
			this
					.addChild((function() {
						var optionY = self.optionY = game.assets["model/option_y.l3p.js"]
								.clone();
						optionY.visible = false;
						optionY.addEventListener("enterframe", function() {
							this.rotateRoll(0.1);
						});
						return optionY;
					})());

			// 赤レーザー
			var redLaser = this.redLaser = (function() {
				var img = game.assets["images/laser1.png"];
				var img2 = game.assets["images/laser2.png"];
				var l1 = game.assets["model/laser1.l3p.js"].clone();
				var l2 = game.assets["model/laser2.l3p.js"].clone();
				var l3 = game.assets["model/laser3.l3p.js"].clone();
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
					this.x = self.x;
					this.y = self.y;
					this.z = self.z + 0.2;
				});
				return laser;
			})();
			redLaser.visible = false;

			// 当たり判定
			this.bounding.radius = 0.1;
			this.showBounding();

			// 武装関係初期化
			this.subweaponLevel = -1;
			this.subweaponEn = this.subweaponEnMax;

			// メガレート計測用
			// イベントツリーには入れない
			this.x4 = (function() {
				var x = new Sprite3D();
				x.bounding.radius = 2.5;
				return x;
			})();
			this.x8 = (function() {
				var x = new Sprite3D();
				x.bounding.radius = 2.0;
				return x;
			})();
			this.x16 = (function() {
				var x = new Sprite3D();
				if (MyGame.level > 0) {
					x.bounding.radius = 1.5;
				} else {
					x.bounding.radius = 0;
				}
				return x;
			})();
			this.x32 = (function() {
				var x = new Sprite3D();
				if (MyGame.level > 1) {
					x.bounding.radius = 0.75;
				} else {
					x.bounding.radius = 0;
				}
				return x;
			})();

			this.addEventListener("enterframe", this.eflCursorKeyInput);
			this.addEventListener("enterframe", this.eflWeapon);
			this.addEventListener("enterframe", this.eflOther);
		},

		/** ライフ */
		life : 3,

		/** スピード */
		speed : 1,

		/** バルカンレベル */
		vulcanLevel : -1,
		/** バルカンの弾速 */
		bulletSpeed : 0.9, // 0.7
		/** バルカンの熱 */
		heat : 0,
		/** バルカン発射時に発生する熱 */
		heatByShot : 4,
		/** バルカンのバラ撒き角度 */
		accuracy : 0.0,
		/** 次に撃つバルカンが左右どちらから発射されるか */
		vulcanRL : -1,

		/** 装備中のサブウェポン */
		subweapon : -1,
		/** サブウェポンレベル */
		subweaponLevel : -1,
		/** サブエネルギー */
		subweaponEn : 100,
		/** サブエネルギーの最大値 */
		subweaponEnMax : 100,
		/** ライトニングボルトの熱量 */
		lightningHeat : 0,
		/** ナパームボムの熱量 */
		napalmHeat : 0,

		/** 操作可能フラグ */
		controllable : false,
		/** 姿勢：ロール角度 */
		rollAngle : 0,
		/** 無敵フラグ */
		muteki : false,

		/** ダメージを受ける */
		damage : function() {
			var game = MyGame.game;
			if (!this.muteki && this.controllable) {
				this.dispatchEvent(new Event("kill"));

				if (this.redLaser.parentNode) {
					this.redLaser.remove();
				}

				// BGMを止める
				if (MyGame.currentBgm) {
					try {
						MyGame.currentBgm.stop();
					} catch (e) {
						console.error(e);
					}
				}

				MyGame.explodeBlue(this, 2.0);
				MyGame.shockwave(this, 3.0);
				playSound("miss.mp3");

				this.life -= 1;
				MyGame.quake(20);
				this.controllable = false;
				this.remove();

				var deathFrame = game.frame;
				game.addEventListener("enterframe", function() {
					if (game.frame >= deathFrame + 90) {
						if (MyGame.myship.life === 0) {
							if (confirm("CONTINUE？")) {
								MyGame.myship.life = 3;
								game.score = game.score % 100 + 1;
							}
						}
						if (MyGame.myship.life === 0) {
							// ゲームオーバー
							MyGame.performance = true;
							game.pause();
							var level;
							if (MyGame.level === 0) {
								level = "EASY";
							} else if (MyGame.level === 1) {
								level = "NORMAL";
							} else if (MyGame.level === 2) {
								level = "HARD";
							}
							var message = "スコア" + game.score + " ステージ"
									+ game.stage + "(" + level
									+ ") の途中でゲームオーバー (stageStep "
									+ game.stageStep + ")";
							game.end(game.score, message);
						} else {
							// リスタート
							MyGame.myship.powerdown();
							game.main(true);
						}
						game
								.removeEventListener("enterframe",
										arguments.callee);
					}
				});
			}
		},

		restart : function() {
			this.dispatchEvent(new Event("restart"));
			this.x = 0;
			this.y = 0;
			this.z = 0;
			this.rollAngle = 0;
			this.muteki = false;
			this.redLaser.tl.clear();
			this.redLaser.scaleX = 0.1;
			this.redLaser.scaleY = 0.1;
			this.redLaser.scaleZ = 20;
		},

		/** レベルリセット */
		powerdown : function() {
			this.subweapon = -1;
			this.subweaponLevel = -1;
			this.speed = 1;
			this.subweaponEnMax = 100;
			this.subweaponEn = this.subweaponEnMax;
			if (MyGame.level === 0) {
				this.powerup(1);
				this.powerup(3);
			}
		},

		/** パワーアップ */
		powerup : function(type) {
			switch (type) {
			case 3:
				this.speed = Math.min(this.speed + 1, 10);
				break;
			default:
				this.subweapon = type;
				this.subweaponLevel = Math.min(this.subweaponLevel + 1, 2)
				break;
			}
		},

		/**
		 * enterframe listener.
		 * 
		 * 移動関係
		 */
		eflCursorKeyInput : function(e) {
			var game = MyGame.game;
			if (this.controllable) {
				// 移動
				if (game.input.up && this.y < (VIEWPORT - 0.4)) {
					this.y += (this.speed + 6) * 0.02;
				}
				if (game.input.down && this.y > -(VIEWPORT - 0.4)) {
					this.y += -(this.speed + 6) * 0.02;
				}
				if (game.input.left && this.z > -(VIEWPORT_H - 0.1)) {
					this.z += -(this.speed + 6) * 0.02;
				}
				if (game.input.right && this.z < (VIEWPORT_H - 0.1)) {
					this.z += (this.speed + 6) * 0.02;
				}

				this.x4.x = this.x8.x = this.x16.x = this.x32.x = this.x;
				this.x4.y = this.x8.y = this.x16.y = this.x32.y = this.y;
				this.x4.z = this.x8.z = this.x16.z = this.x32.z = this.z;

				// 姿勢
				if (game.input.up) {
					if (this.rollAngle < Math.PI / 2) {
						this.rollAngle += 0.1;
					}
				} else if (game.input.down) {
					if (-Math.PI / 2 < this.rollAngle) {
						this.rollAngle += -0.1
					}
				} else {
					if (Math.abs(this.rollAngle) < 0.01) {
						this.rollAngle = 0;
					} else {
						this.rollAngle *= 0.8;
					}
				}
			}
			this.rotationSet(new Quat(0, 0, 1, this.rollAngle));
		},

		/**
		 * enterframe listener.
		 * 
		 * 武器関係.
		 */
		eflWeapon : function(e) {
			var game = MyGame.game;
			var self = this;

			if (this.muteki) {
				this.visible = this.age % 2 == 0;
			} else {
				this.visible = true;
			}

			if (!this.controllable) {
				game.input.up = false;
				game.input.down = false;
				game.input.left = false;
				game.input.right = false;
				game.input.a = false;
				game.input.b = false;
			}

			// バルカン
			if (game.input.a) {
				if (this.heat <= 0) {
					this.vulcanRL *= -1;
					MyGame.bullets.get(function(b) {
						b.init();
						self.parentNode.addChild(b);
						self.heat = self.heatByShot;
					});
				}
			}

			// サブウェポン
			if (game.frame % 2 == 0) {
				// レーザー無敵を解除
				MyGame.enemyList.forEach(function(e) {
					e.laserMuteki = false;
				});
			}
			if (game.input.b && this.subweaponEn > 0) {
				if (this.subweapon == 0) {
					// シェードレーザー
					Laser.laserOn();

					if (!this.redLaser.parentNode) {
						this.scene.effectLayer.addChild(this.redLaser);
					}
					if (!this.redLaser.visible) {
						this.redLaser.tl.clear();

						var size = this.subweaponLevel * 2 + 3;

						this.redLaser.visible = true;
						this.redLaser.scaleX = 0.1;
						this.redLaser.scaleY = 0.1;
						this.redLaser.scaleZ = 20;
						this.redLaser.tl.scaleXYZTo(size, size, 20, 3,
								enchant.Easing.LINEAR);
					}

					this.subweaponEn -= 1;
					if (this.subweaponEn == 0) {
						this.subweaponEn = -50;
					}
				} else if (this.subweapon == 1) {
					// ライトニング波動砲
					if (this.lightningHeat <= 0) {
						// 消費エネルギー
						var en = 10;
						// 攻撃力。レベルが上がっても固定
						var ap = 0.5;
						// 発射数。レベルが上がるとたくさん撃てるようになる
						var n = 3 + this.subweaponLevel;
						if (this.subweaponEn < en) {
							n *= ~~(this.subweaponEn / en);
						}
						// 熱量
						var heat = 10;

						var elist = MyGame.enemyList.toArray().map(
								function(e) {
									// [ 距離の２乗, 相対位置角度, 敵オブジェクト ]
									var dy = e.y - self.y;
									var dz = e.z - self.z;
									return [ dy * dy + dz * dz,
											Math.abs(Math.atan2(dy, dz)), e ];
								})
						// x座標がプラスマイナス0.2以内
						.filter(function(p) {
							return -0.2 <= p[2].x && p[2].x <= 0.2;
						})
						// 進行方向となす角がMath.PI*0.3未満の敵が対象
						.filter(function(p) {
							return p[1] < Math.PI * 1 / 3;
						})
						// 近い敵が優先
						.sort(function(a, b) {
							return a[0] - b[0];
						});
						// ターゲット
						var targets = [];
						for ( var i = 0; i < elist.length; i++) {
							var e = elist[i][2];
							if (e.inScreen()) {
								// HPの多い敵にはたくさん撃つ(MAX 2)
								var shot = ~~Math.min(e.hp / ap + 1, 2);
								for ( var j = 0; j < shot; j++) {
									targets[targets.length] = e;
								}
							}
						}

						// ターゲット数が発射数に満たない場合はあさっての方向へ発射する
						if (n > targets.length) {
							for ( var i = 0, end = n - targets.length; i < end; i++) {
								var t = random(0, Math.PI / 4);
								targets[targets.length] = {
									x : 0,
									y : Math.sin(t) * 12 + this.y,
									z : Math.cos(t) * 12 + this.z
								};
							}
						}

						// 発射
						for ( var i = 0; i < n; i++) {
							var target = targets[i];
							if (target instanceof Enemy) {
								target.damage(ap);
							}
							MyGame.effectLightning(this, target, i);
						}
						if (n > 0) {
							playSound("lightning.mp3");
							// サブエネルギー消費
							this.subweaponEn -= en;
							// 砲身加熱
							this.lightningHeat = heat;
						}
					}
				} else if (this.subweapon == 2) {
					// ナパームボム
					// 消費エネルギー
					var en = 30;
					// 熱量
					var heat = 20;
					// 爆風半径
					var radius = (this.subweaponLevel + 2) * 0.25;
					if (this.subweaponEn >= en && this.napalmHeat <= 0) {
						MyGame.bombs.get(function(b) {
							b.init(Math.PI * 1 / 3, radius);
							self.parentNode.addChild(b);
						});
						MyGame.bombs.get(function(b) {
							b.init(Math.PI * 2 / 3, radius);
							self.parentNode.addChild(b);
						});
						MyGame.bombs.get(function(b) {
							b.init(Math.PI * -1 / 3, radius);
							self.parentNode.addChild(b);
						});
						MyGame.bombs.get(function(b) {
							b.init(Math.PI * -2 / 3, radius);
							self.parentNode.addChild(b);
						});

						// サブエネルギー消費
						this.subweaponEn -= en;
						// 砲身加熱
						this.napalmHeat = heat;
					}
				}
			} else {
				Laser.laserOff();
				if (this.redLaser.visible) {
					this.redLaser.tl.scaleXYZTo(0.1, 0.1, 20, 3,
							enchant.Easing.LINEAR).then(function() {
						this.visible = false;
					});
				}
			}

			if (game.input.b && this.subweapon != 0) {
				Laser.laserOff();
			}
		},

		/**
		 * enterframe listener.
		 * 
		 * その他
		 */
		eflOther : function(e) {
			var game = MyGame.game;
			// 砲身冷却
			this.heat -= 1;
			this.lightningHeat -= 1;
			this.napalmHeat -= 1;

			// オプションのvisible
			this.optionR.visible = false;
			this.optionB.visible = false;
			this.optionY.visible = false;
			if (this.subweapon === 0) {
				this.optionR.visible = true;
			} else if (this.subweapon === 1) {
				this.optionB.visible = true;
			} else if (this.subweapon === 2) {
				this.optionY.visible = true;
			}

			// サブエネルギー回復
			if (this.subweaponEn < this.subweaponEnMax && !game.input.b) {
				this.subweaponEn += 1;
			}

			// 敵との衝突チェック
			var self = this;
			MyGame.enemyList.forEach(function(enemy) {
				if (enemy.intersect(self)) {
					self.damage();
				}
			});
		}
	};

	MyShip = enchant.Class.create(enchant.gl.Sprite3D, _myshipSpec);
})();
