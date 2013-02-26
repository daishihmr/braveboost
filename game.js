enchant();

var startGame = function(game) {
	MyGame.game = game;
	MyGame.enemyList = new LinkedList();
	MyGame.itemList = new LinkedList();
	MyGame.bullets = [];
	MyGame.bombs = [];
	MyGame.bombExps = [];
	MyGame.enemyBullets = [];
	MyGame.enemyBulletsG = [];
	MyGame.enemyBulletsB = [];
	MyGame.enemyBulletsY = [];
	MyGame.enemyPools = [];

	var scene;
	var myship;

	game.fps = 30; // 30
	game.keybind(90, 'a'); // z
	game.keybind(88, 'b'); // x
	game.keybind(65, 'a'); // a
	game.keybind(66, 'b'); // b
	game.keybind(32, 'p'); // space

	// アセットをロード
	preloadAssets(game);

	// ユーザーデータをロード
	game.memory.player.preload();

	game.onload = function() {

		// 9leapストレージからサウンド設定をロード
		var data = game.memory.player.data;
		if (data.bgmOn == undefined) {
			MyGame.soundEnable = true;
		} else {
			MyGame.soundEnable = data.bgmOn;
		}

		// ロードしたアセットをほげほげする
		onLoadAssets(game);

		// メインシーン
		scene = MyGame.scene = new Scene3D();

		// 描画順制御用レイヤ
		scene.addChild(scene.mainLayer = new Sprite3D());
		scene.addChild(scene.backgroundLayer = new Sprite3D());
		scene.addChild(scene.effectLayer = new Sprite3D());
		scene.addChild(scene.bulletLayer = new Sprite3D());

		var trigger = new Sprite(32, 32);
		trigger.addEventListener("enterframe", function() {
			if (game.started) {
				game.setup();
				this.parentNode.removeChild(this);
			}
		});
		game.rootScene.addChild(trigger);

		// モデルデータをバッファに転送しておく
		for ( var url in game.assets) {
			if (game.assets.hasOwnProperty(url) && url.startsWith("model/")) {
				var model = game.assets[url].clone();
				model.visible = false;
				scene.addChild(model);
			}
		}

	};

	game.setup = function(startPoint) {
		// ライト
		var light = scene.getDirectionalLight();
		light.directionX = -30;
		light.directionY = 30;
		light.directionZ = 0;

		// カメラ
		var camera = scene.getCamera();
		MyGame.camPos = new Sprite3D();
		MyGame.camPos.addEventListener("enterframe", function() {
			camera.x = this.x;
			camera.y = this.y;
			camera.z = this.z;
		});
		scene.addChild(MyGame.camPos);
		MyGame.camTar = new Sprite3D();
		MyGame.camTar.addEventListener("enterframe", function() {
			camera.lookAt(this);
		});
		scene.addChild(MyGame.camTar);

		MyGame.camPos.x = -25;
		MyGame.camPos.y = 0;
		MyGame.camPos.z = 0;
		MyGame.camTar.x = 0;
		MyGame.camTar.y = 0;
		MyGame.camTar.z = 0;

		// 計器類表示
		setupLabels();

		// 前ステージからデータを引き継ぎ
		var tempData = JSON.parse(localStorage.getItem(UUID));
		// 30分以上経ってたら古いデータとみなす
		if (tempData
				&& tempData.savedAt + 1000 * 60 * 30 < new Date().getTime()) {
			tempData = null;
		}

		// スコアと難易度を引き継ぎ
		if (tempData) {
			MyGame.level = tempData.level;
			game.score = tempData.score;
		} else {
			game.score = 0;
		}
		// TODO デバッグ用
		// 開発環境では基本的にHARDでやる
		// if (location.hostname === "localhost") {
		// MyGame.level = 2;
		// }

		// 自機
		myship = MyGame.myship = new MyShip();
		// 自機の状態を引き継ぎ
		if (tempData) {
			myship.life = tempData.life;
			myship.speed = tempData.speed;
			myship.subweapon = tempData.subweapon;
			myship.subweaponLevel = tempData.subweaponLevel;
			myship.subweaponEnMax = tempData.subweaponEnMax;
		}

		// 引き継いだデータを消す
		if (tempData) {
			localStorage.removeItem(UUID);
		}

		// 通常弾
		setupBullets();
		// ボム
		setupBombs();

		// 敵通常弾
		setupEnemyBullets();

		// 敵
		setupEnemies();

		// エフェクト
		setupEffect(scene);

		// アイテム
		setupItem();

		// 背景を作成
		game.background = setupBackground(game, scene);

		// ポーズ機能
		game.isPause = false;
		game.pauseCommand = "";
		game.addEventListener("pbuttonup", function() {
			if (!myship.controllable) {
				return;
			}

			if (game.isPause) {
				MyGame.alertLabel.flashing = true;
				MyGame.alertLabel.hide();

				game.resume();
				if (MyGame.soundEnable) {
					if (MyGame.currentBgm) {
						MyGame.currentBgm.play();
					}
				}
			} else {
				MyGame.alertLabel.text = "PAUSE";
				MyGame.alertLabel.flashing = false;
				MyGame.alertLabel._style.color = "rgba(255, 255, 255, 0.7)";
				MyGame.alertLabel.show();

				game.pauseCommand = "";
				if (MyGame.soundEnable) {
					if (MyGame.currentBgm) {
						MyGame.currentBgm.pause();
					}
				}
				game.addEventListener("enterframe", function() {
					game.pause();
					game.removeEventListener("enterframe", arguments.callee);
				});
			}
			game.isPause = !game.isPause;
		});

		// 伝説のコマンド
		[ "up", "down", "left", "right", "a", "b" ].forEach(function(et) {
			game.addEventListener(et + "buttonup", function(e) {
				if (game.isPause) {
					game.pauseCommand += (e.type.charAt(0));
					if (game.pauseCommand === "uuddlrlrba") {
						myship.powerdown();
						myship.powerup(ITEM_SPEED);
						myship.powerup(ITEM_SPEED);
						myship.powerup(ITEM_SPEED);
						for ( var i = 0; i < 6; i++) {
							myship.powerup(ITEM_RED);
						}
						game.incrScore(1);

						var sound = game.assets[SOUND_URL + "extend.mp3"]
								.clone();
						sound.volume = MyGame.soundVolume;
						sound.play();

						Labels.subWeapon.refresh();
						Labels.speed.refresh();
						Labels.score.refresh();
					}
				}
			});
		});

		// ゲームのメインループ
		game.addEventListener("enterframe", function() {
			if (!MyGame.performance) {
				MyGame.camPos.x = -25;
				MyGame.camPos.y = myship.y * -0.100;
				MyGame.camPos.z = myship.z * -0.025;
				MyGame.camTar.x = 0;
				MyGame.camTar.y = myship.y * 0.20;
				MyGame.camTar.z = myship.z * 0.05;
				if (game.quakeCount) {
					MyGame.camPos.y += Math.sin(game.frame) * 0.03
							* game.quakeCount;
					MyGame.camTar.y += Math.sin(game.frame) * 0.03
							* game.quakeCount;
					MyGame.camPos.z += Math.sin(game.frame * 1.5) * 0.03
							* game.quakeCount;
					MyGame.camTar.z += Math.sin(game.frame * 1.5) * 0.03
							* game.quakeCount;
					game.quakeCount -= 1;
				}

				if (MyGame.stageStepUp) {
					if (game.stageStep % 8 == 0) {
						(function() {
							var f = ~~(game.stageStep / 8);
							var s = StageData.charAt(f);
							stage(scene, s);
						})();
					}
					game.stageStep += 1;
				}
			}

			// BGMをループ
			if (MyGame.soundEnable) {
				var bgm = MyGame.currentBgm;
				if (bgm) {
					var start = bgm._start;
					var end = bgm._end;
					if (bgm.currentTime >= end) {
						// console.info("曲終わった");
						bgm.stop();
						bgm.currentTime = start;
						bgm.play();
					}
				}
			}
		});

		// 音を鳴らす
		playSound.queue = {};
		if (MyGame.soundEnable) {
			game.addEventListener("enterframe", function() {
				if (game.frame % 3 == 0) {
					for ( var fileName in playSound.queue) {
						if (playSound.queue.hasOwnProperty(fileName)) {
							if (game.assets[SOUND_URL + fileName]) {
								var s = game.assets[SOUND_URL + fileName]
										.clone()
								s.volume = MyGame.soundVolume;
								s.play();
							}
						}
					}
					playSound.queue = {};
				}
			});
		}

		game.checkpoint = [ 0, 0 ];
		game.main(false);
	};

	/**
	 * メインループを再開する.
	 * 
	 * @param enRoute
	 *            途中復活フラグ
	 */
	game.main = function(enRoute) {
		MyGame.stageStepUp = true;

		// BGMを再生
		if (MyGame.soundEnable) {
			if (MyGame.currentBgm) {
				MyGame.currentBgm.stop();
			}
			if (MyGame.bgm) {
				MyGame.currentBgm = MyGame.bgm.clone();
				MyGame.currentBgm.name = MyGame.bgm.name;
				MyGame.currentBgm.volume = 0.2;
				MyGame.currentBgm.play();
			}
		}

		// 自機を再配置
		myship.restart();
		scene.mainLayer.addChild(myship);

		// エフェクトを消去
		MyGame.clearEffect();

		// 敵を消去
		MyGame.enemyList.forEach(function(e) {
			e.remove();
		});

		// アイテムを消去
		MyGame.itemList.forEach(function(i) {
			i.remove();
			MyGame.itemList.remove(i);
		});

		// 自分の弾を消去
		for ( var i = 0, end = MyGame.bullets.length; i < end; i++) {
			MyGame.bullets[i].remove();
		}
		MyGame.bullets.disposeAll();

		// 敵の弾を消去
		for ( var i = 0, end = MyGame.enemyBullets.length; i < end; i++) {
			MyGame.enemyBullets[i].remove();
		}
		MyGame.enemyBullets.disposeAll();
		for ( var i = 0, end = MyGame.enemyBulletsG.length; i < end; i++) {
			MyGame.enemyBulletsG[i].remove();
		}
		MyGame.enemyBulletsG.disposeAll();
		for ( var i = 0, end = MyGame.enemyBulletsB.length; i < end; i++) {
			MyGame.enemyBulletsB[i].remove();
		}
		MyGame.enemyBulletsB.disposeAll();
		for ( var i = 0, end = MyGame.enemyBulletsY.length; i < end; i++) {
			MyGame.enemyBulletsY[i].remove();
		}
		MyGame.enemyBulletsY.disposeAll();

		// 背景スクロールスタート
		game.background.start(game.checkpoint[0]);
		game.stageStep = game.checkpoint[1];

		// 「READY」表示
		MyGame.performance = true;
		MyGame.alertLabel.text = "READY";
		MyGame.alertLabel._style.color = "rgba(0, 127, 127, 0.7)";
		MyGame.alertLabel.show();
		myship.controllable = false;

		// 自機とカメラを初期位置に
		if (enRoute) {
			myship.x = 0;
			myship.y = 0;
			myship.z = 0;
		} else {
			myship.x = -25;
			myship.y = 0;
			myship.z = -0.3;
			myship.tl.//
			delay(10).//
			rotateRollTo(Math.PI * 1.999, 50, enchant.Easing.QUAD_EASEOUT).//
			and().//
			moveTo(0, 0, 0, 50, enchant.Easing.BACK_EASEOUT);
		}
		MyGame.camPos.x = -25;
		MyGame.camPos.y = 0;
		MyGame.camPos.z = 0;
		MyGame.camTar.x = 0;
		MyGame.camTar.y = 0;
		MyGame.camTar.z = 0;
		MyGame.camPos.dispatchEvent(new Event("enterframe"));
		MyGame.camTar.dispatchEvent(new Event("enterframe"));

		// スタート直後の処理
		var startFrame = game.frame;
		game.addEventListener("enterframe", function() {
			// 復活なら30f、初回なら50f待つ
			var readyTime = enRoute ? 30 : 60;
			if (game.frame >= startFrame + readyTime) {
				// 演出フラグ解除
				MyGame.performance = false;

				// 制御可能にする
				myship.controllable = true;

				// アラートラベル消す
				MyGame.alertLabel.hide();
				// バックファイア消す
				myship.backfire.visible = false;

				game.removeEventListener("enterframe", arguments.callee);
			}
		});

		if (!enRoute) {
			myship.backfire.visible = true;
		}

		game.dispatchEvent(new Event("restart"));
	};

	game.start();
};

Game.prototype.incrScore = function(score) {
	if (MyGame.level === 0) {
		score = ~~(score * 0.5);
		if (score === 0) {
			score = 1;
		}
	}

	var ex = 100000;
	var after = this.score + score;
	if (~~(after / ex) > ~~(this.score / ex)) {
		MyGame.myship.life += (~~(after / ex) - ~~(this.score / ex));
		playSound("extend.mp3");
	}
	this.score += score;
};

function playSound(sound) {
	playSound.queue[sound] = true;
}

Game.prototype.stageClear = function(nextStage, nextLevel) {
	MyGame.performance = true;
	var game = MyGame.game;

	// ステージクリアフラグを保存
	var unlock = false;
	var data = game.memory.player.data;
	if (nextLevel === 0) {
		if (data.cleared.level0 < nextStage) {
			data.cleared.level0 = nextStage;
			game.memory.update();
			unlock = true;
		}
	} else if (nextLevel === 1) {
		if (data.cleared.level1 < nextStage) {
			data.cleared.level1 = nextStage;
			game.memory.update();
			unlock = true;
		}
	} else if (nextLevel === 2) {
		if (data.cleared.level2 < nextStage) {
			data.cleared.level2 = nextStage;
			game.memory.update();
			unlock = true;
		}
	}
	if (unlock) {
		alert("ステージ" + nextStage + "("
				+ [ "EASY", "NORMAL", "HARD" ][nextLevel] + ") のロックが解除されました！");
	}

	var m = MyGame.myship;
	m.rollAngle = 0;
	m.controllable = false;
	MyGame.camPos.tl.//
	moveTo(m.x, m.y + 0.3, m.z + 4, 30, enchant.Easing.QUAD_EASEINOUT)//
	.then(function() {
		var t = 0;
		this.addEventListener("enterframe", function() {
			this.x = m.x + Math.sin(t) * 4;
			this.z = m.z + Math.cos(t) * 4;
			t += 0.03;
		});
	});
	MyGame.camTar.tl.//
	moveTo(m.x, m.y, m.z, 30, enchant.Easing.QUAD_EASEINOUT).//
	then(function() {
		this.addEventListener("enterframe", function() {
			this.x = m.x;
			this.y = m.y;
			this.z = m.z;
		});
		Label.prototype.setUp = function() {
			this.width = 128;
			this._style.color = "white";
			this._style.paddingLeft = "5px";
		}

		var timeBonus = ~~Math.max(0, (120 - (MyGame.bossBattleTime / 30)));
		var totalBonus = m.life * 30000 + timeBonus * 200;
		var beforeLife = m.life;
		game.incrScore(totalBonus);

		if (MyGame.level === 0) {
			totalBonus *= 0.5;
		}

		var labels = [];

		var title = new Label("STAGE CLEAR!");
		labels.push(title);
		title._style.color = "#00aa44";
		title.textAlign = "center";
		title._style.fontSize = "x-large";
		title.x = 0;
		title.y = 48;
		game.rootScene.addChild(title);

		var lifeLabel = new Label("LIFE");
		labels.push(lifeLabel);
		lifeLabel.setUp();
		lifeLabel.x = 16;
		lifeLabel.y = 128;
		game.rootScene.addChild(lifeLabel);
		var life = new Label(beforeLife + " x 30000");
		labels.push(life);
		life.setUp();
		life.textAlign = "right";
		life.x = 160;
		life.y = 128;
		game.rootScene.addChild(life);

		var timeLabel = new Label("BOSS BATTLE TIME")
		labels.push(timeLabel);
		timeLabel.setUp();
		timeLabel.x = 16;
		timeLabel.y = 160;
		game.rootScene.addChild(timeLabel);
		var time = new Label(timeBonus + " x 200");
		labels.push(time);
		time.setUp();
		time.textAlign = "right";
		time.x = 160;
		time.y = 160;
		game.rootScene.addChild(time);

		var totalLabel = new Label("TOTAL BONUS")
		labels.push(totalLabel);
		totalLabel.setUp();
		totalLabel.x = 16;
		totalLabel.y = 224;
		game.rootScene.addChild(totalLabel);
		var total = new Label(totalBonus);
		labels.push(total);
		total.setUp();
		total.textAlign = "right";
		total.x = 160;
		total.y = 224;
		game.rootScene.addChild(total);

		if (MyGame.level === 0) {
			var levelLabel = new Label("DIFFICULTY EASY")
			labels.push(levelLabel);
			levelLabel.setUp();
			levelLabel.x = 16;
			levelLabel.y = 192;
			game.rootScene.addChild(levelLabel);
			var level = new Label(" x 0.5");
			labels.push(level);
			level.setUp();
			level.textAlign = "right";
			level.x = 160;
			level.y = 192;
			game.rootScene.addChild(level);
		}

		title.tl.delay(30).//
		then(function() {
			var prompt = new Label("PRESS Z BUTTON");
			labels.push(prompt);
			prompt.textAlign = "center";
			prompt._style.color = "white";
			prompt.x = 0;
			prompt.y = 288;
			game.rootScene.addChild(prompt);
			var v = false;
			prompt.addEventListener("enterframe", function() {
				if (this.age % 15 === 0) {
					v = !v;
					this.visible = v;
				}
			});

			game.addEventListener("abuttonup", function() {
				labels.forEach(function(l) {
					l.parentNode.removeChild(l);
				});

				game.clearEventListener("abuttonup");
				if (MyGame.soundEnable) {
					var sound = game.assets[SOUND_URL + "itemget.mp3"].clone();
					sound.volume = MyGame.soundVolume;
					sound.play();
				}

				if (nextStage == 1 && (nextLevel == 1 || nextLevel == 3)) {
					// 全クリ
					game.endScene.image = game.assets["images/clear.png"];
					var msg;
					if (MyGame.level === 0) {
						msg = "スコア" + game.score + " EASYモードクリア！";
					} else {
						msg = "スコア" + game.score + " 全ステージクリア！！";
					}
					game.end(game.score, msg);
				} else {
					// ローカルストレージに保存
					var tempData = {
						level : nextLevel,
						score : game.score,
						life : MyGame.myship.life,
						speed : MyGame.myship.speed,
						subweapon : MyGame.myship.subweapon,
						subweaponLevel : MyGame.myship.subweaponLevel,
						subweaponEnMax : MyGame.myship.subweaponEnMax,
						savedAt : new Date().getTime()
					};
					localStorage.setItem(UUID, JSON.stringify(tempData));

					m.backfire.visible = true;
					MyGame.camPos.clearEventListener("enterframe");
					m.tl.moveBy(0, 0, 100, 50, enchant.Easing.QUAD_EASEIN).//
					then(function() {
						location.href = "stage" + nextStage + ".html";
					});
				}
			});
		});
	});
};
