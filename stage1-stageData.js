// 1文字8フレーム
var StageData = "" //
		+ "..... 00000 ..... ....D 22222 ..... ..... 00000 ..... ....." // 0
		+ "22222 ..... ....a ....b ....c ..... c.a.. ..mno ..... ....." // 50
		+ "..... ..... 00000 ..... ..... 22222 .CDB. ..... ..... ....." // 100
		+ "..... ....d ..... ..... ..e.. ..d.. ..... ac... 11111 ....." // 150
		+ "44444 ..... 33333 ..... ..e.. ..... ..e.. ..... ..k.. DA..." // 200
		+ "g.... ..... ..... ..... ..... 44444 ..... ..... ..... ....." // 250
		+ "ac... ..... ..... ..... ..... ..... ..... ..... ..... ....." // 300
		+ "..CBA 00000 ..... ac... ..... 22222 ..... mno.. ..... ....." // 350
		+ "..... 0.5.2 .6.0. 5.2.6 ..D.. ac... ac... kjl.. ..... ....." // 400
		+ "..... 55555 55555 ..... ..... ..... ..... ..... ..... ....." // 450
		+ "z.... ..... ..... ..... ..... ..... ..... ..... ..... ....." // 500
		// 0_____5_____10____15____20____25____30____35____40____45
;
StageData = StageData.split(" ").join("");

function stage(scene, id) {
	var game = MyGame.game;

	// チェックポイント通過チェック
	if (game.stageStep === 119 * 8) {
		game.checkpoint = [ 1, 119 * 8 ];
	} else if (game.stageStep === 239 * 8) {
		game.checkpoint = [ 7, 239 * 8 ];
	} else if (game.stageStep === 352 * 8) {
		game.checkpoint = [ 14, 352 * 8 ];
	}

	switch (id) {
	case "0":
		// ミドリ
		simpleGen(0, 3);
		break;
	case "1":
		// 蛇行ミドリ
		simpleGen(5, 2);
		break;
	case "2":
		// ミドリ
		simpleGen(0, -3);
		break;
	case "3":
		// ミドリ
		simpleGen(0, 3);
		simpleGen(0, -3);
		break;
	case "4":
		// 蛇行ミドリ
		simpleGen(5, -2);
		break;
	case "5":
		if (MyGame.level !== 0) {
			// うしろミドリ
			MyGame.enemyPools[7].get(function(e) {
				e.init(0, 4, -(VIEWPORT_H + 0.5));
				scene.mainLayer.addChild(e);
				MyGame.enemyList.add(e);
			});
		}
		break;
	case "6":
		if (MyGame.level !== 0) {
			// うしろミドリ
			MyGame.enemyPools[7].get(function(e) {
				e.init(0, -4, -(VIEWPORT_H + 0.5));
				scene.mainLayer.addChild(e);
				MyGame.enemyList.add(e);
			});
		}
		break;
	case "7":
		// 蛇行ミドリ
		simpleGen(5, 0);
		break;

	case "a":
		// 赤
		simpleGen(1, 3);
		break;
	case "b":
		// 赤
		simpleGen(1, 0);
		break;
	case "c":
		// 赤
		simpleGen(1, -3);
		break;

	case "d":
		// たんく
		simpleGen(2, -(VIEWPORT - 0.4));
		break;

	case "e":
		// アジフライ
		simpleGen(12, 0);
		break;

	case "g":
		// ドネルケバブ
		gen(4, 4, VIEWPORT_H + 3.9);
		if (MyGame.level === 2) { // 2周目は2隻出てくる
			gen(4, -4, VIEWPORT_H + 3.9);
		}
		break;

	case "j":
		// げいんず君
		gen(6, 3, VIEWPORT_H + 3.9);
		break;
	case "k":
		// げいんず君
		gen(6, -3, VIEWPORT_H + 3.9);
		break;
	case "l":
		// げいんず君
		gen(6, 0.0, VIEWPORT_H + 3.9);
		break;

	case "m":
		// コウノトリ
		MyGame.enemyPools[11].get(function(e) {
			e.init(3);
			scene.mainLayer.addChild(e);
			MyGame.enemyList.add(e);
		});
		break;
	case "n":
		// コウノトリ
		MyGame.enemyPools[11].get(function(e) {
			e.init(0);
			scene.mainLayer.addChild(e);
			MyGame.enemyList.add(e);
		});
		break;
	case "o":
		// コウノトリ
		MyGame.enemyPools[11].get(function(e) {
			e.init(-3);
			scene.mainLayer.addChild(e);
			MyGame.enemyList.add(e);
		});
		break;

	case "x":
		MyGame.enemyPools[9].get(function(e) {
			e.init(0, 0, 3.5, [ 0, 1, 1 ]);
			scene.mainLayer.addChild(e);
			MyGame.enemyList.add(e);
		});
		MyGame.enemyPools[9].get(function(e) {
			e.init(0, 0, 3.5, [ 0, 1, 0 ]);
			scene.mainLayer.addChild(e);
			MyGame.enemyList.add(e);
		});
		MyGame.enemyPools[9].get(function(e) {
			e.init(0, 0, 3.5, [ 0, 1, -1 ]);
			scene.mainLayer.addChild(e);
			MyGame.enemyList.add(e);
		});
		MyGame.enemyPools[9].get(function(e) {
			e.init(0, 0, 3.5, [ 0, -1, 1 ]);
			scene.mainLayer.addChild(e);
			MyGame.enemyList.add(e);
		});
		MyGame.enemyPools[9].get(function(e) {
			e.init(0, 0, 3.5, [ 0, -1, 0 ]);
			scene.mainLayer.addChild(e);
			MyGame.enemyList.add(e);
		});
		MyGame.enemyPools[9].get(function(e) {
			e.init(0, 0, 3.5, [ 0, -1, -1 ]);
			scene.mainLayer.addChild(e);
			MyGame.enemyList.add(e);
		});
		break;
	case "z":
		// ボス
		// 敵を消去
		MyGame.enemyList.forEach(function(e) {
			e.remove();
		});
		// 敵の弾を消去
		for ( var i = 0, end = MyGame.enemyBullets.length; i < end; i++) {
			MyGame.enemyBullets[i].remove();
		}
		MyGame.enemyBullets.disposeAll();

		// 操作不能に
		MyGame.performance = true;
		MyGame.myship.controllable = false;
		MyGame.myship.tl.moveTo(0, 0, -3, 100);

		var timer = new Sprite3D(); // タイマー
		scene.addChild(timer);
		timer.tl.wait(). //
		then(function() {

			// アラート出す
			MyGame.alertLabel.text = "WARNING!!";
			MyGame.alertLabel._style.color = "rgba(255, 0, 0, 0.7)";
			MyGame.alertLabel.show();

			// BGM止める
			if (MyGame.currentBgm) {
				try {
					MyGame.currentBgm.stop();
				} catch (e) {
					console.error(e);
				}
			}
		}). //
		delay(5). //
		then(
				function() {

					// ボス戦BGMスタート
					if (MyGame.bossBgm) {
						MyGame.currentBgm = MyGame.bossBgm;
						MyGame.currentBgm.stop();
						MyGame.currentBgm.volume = 0.2;
						MyGame.currentBgm.play();
					}

					// 出現
					var boss = genXYZ("bossFly", 50, 0.5, 50);
					boss.scaleX = boss.scaleY = boss.scaleZ = 4.5;
					boss.rotationSet(new Quat(0, 1, 0, Math.PI * 0.75));
					boss.tl
							.moveTo(-20, 3, -20, 100,
									enchant.Easing.QUAD_EASEIN);

					// カメラ位置
					MyGame.camPos.tl.//
					moveTo(-10, 1, -10, 120, enchant.Easing.QUAD_EASEINOUT);

					// カメラを向ける
					MyGame.camTar.tl.//
					moveTo(20, 0.5, 20, 120, enchant.Easing.QUAD_EASEINOUT).//
					delay(20). //
					then(
							function() {
								this.tl.moveTo(0, 0, 0, 60,
										enchant.Easing.QUAD_EASEIN);
								MyGame.camPos.tl.//
								moveTo(-25, 0, 0, 60,
										enchant.Easing.QUAD_EASEIN).then(
										function() {

											// アラート消す
											MyGame.alertLabel.hide();

											// 操作可能に
											MyGame.performance = false;
											MyGame.myship.controllable = true;

											boss.remove();

											// 登場
											genXYZ("boss", -30, 2, 1);
										});
							});
				});

		break;

	case "A":
		genCapsule(ITEM_RED, 0);
		break;
	case "B":
		genCapsule(ITEM_BLUE, -2);
		break;
	case "C":
		genCapsule(ITEM_YELLOW, 0);
		break;
	case "D":
		genCapsule(ITEM_SPEED, 1);
		break;
	}

	function simpleGen(type, y) {
		var result;
		MyGame.enemyPools[type].get(function(e) {
			e.init(0, y, VIEWPORT_H + 0.5);
			scene.mainLayer.addChild(e);
			MyGame.enemyList.add(e);
			result = e;
		});
		return result;
	}
	function genCapsule(itemType, y) {
		var result;
		MyGame.enemyPools[3].get(function(e) {
			e.init(0, y, VIEWPORT_H + 0.5, itemType);
			scene.mainLayer.addChild(e);
			MyGame.enemyList.add(e);
			result = e;
		});
		return result;
	}
	function gen(type, y, z) {
		var result;
		MyGame.enemyPools[type].get(function(e) {
			e.init(0, y, z);
			scene.mainLayer.addChild(e);
			MyGame.enemyList.add(e);
			result = e;
		});
		return result;
	}
	function genXYZ(type, x, y, z) {
		var result;
		MyGame.enemyPools[type].get(function(e) {
			e.init(x, y, z);
			scene.mainLayer.addChild(e);
			MyGame.enemyList.add(e);
			result = e;
		});
		return result;
	}
}
