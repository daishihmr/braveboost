// 1文字8フレーム
var StageData = "D.... ....." //
		+ "..... aaaaa bbbbb ..... ccccc ..... ddddd eeeee ..... fffff" // 0
		+ "..... ggggg hhhhh ..... iiiii ..... 2.2.2 .2.2. 2.2.2 .2.2." // 50
		+ "2.2.2 .3A2. 2.2.2 .2.2. 2.2.2 .2.2. .3D2. 2.2.2 .2.2. 2.2.2" // 100
		+ ".2.4. ..... ..... ..... ..... ..... ...AG ....m ..... ..n.." // 150
		+ "....m ..... .o... ...o. ..... o.... ..p.. ..... ..... .p..." // 200
		+ "...p. ..... q.sss ssp.. sssss ..... ..... ..n.. ....r ....." // 250
		+ "..utt ttt.. ..... ..... ..... ..... ..... ..... ..... BD.jk" // 300
		+ "..... ...jk ..... ..... ..... ggggg ..... ..... ..... hhhhh" // 350
		+ "..... ..... ..... ..... ..... n.... .n... ...n. ..... n...." // 400
		+ "..... ..... ..... AD... ..... ..... ....v ..... ..... ....." // 450
		+ "A.DCB .H.E. D.F.G ..... ..... ..... ..... ..... ..... ....." // 500
		+ "z.... ..... ..... ..... ..... ..... ..... ..... ..... ....." // 550
		// 0_____5_____10____15____20____25____30____35____40____45
;
StageData = StageData.split(" ").join("");

function stage(scene, id) {
	var game = MyGame.game;

	// チェックポイント通過チェック
	if (game.stageStep === 193 * 8) {
		game.checkpoint = [ 2, 193 * 8 ];
	} else if (game.stageStep === 349 * 8) {
		game.checkpoint = [ 3, 349 * 8 ];
	} else if (game.stageStep === 467 * 8) {
		game.checkpoint = [ 4, 467 * 8 ];
	}

	switch (id) {
	case "1":
		break;

	case "2":
		simpleGen("sinner", 2.5);
		simpleGen("sinner", 0.0);
		simpleGen("sinner", -2.5);
		break;
	case "3":
		simpleGen("sinner2", 2.5);
		simpleGen("sinner", 0.0);
		simpleGen("sinner2", -2.5);
		break;
	case "4":
		simpleGen("sinner2", 2.5);
		simpleGen("sinner2", 0.0);
		simpleGen("sinner2", -2.5);
		break;

	case "a":
		simpleGen("midoriF", 2.0);
		break;
	case "b":
		simpleGen("midoriF", -2.0);
		break;
	case "c":
		simpleGen("midoriF", 2.0);
		simpleGen("midoriF", -2.0);
		break;

	case "d":
		simpleGen("midoriF2", 2.0);
		break;
	case "e":
		simpleGen("midoriF2", -2.0);
		break;
	case "f":
		simpleGen("midoriF2", 2.0);
		simpleGen("midoriF2", -2.0);
		break;

	case "g":
		simpleGen("midoriGD", 2.0);
		break;
	case "h":
		simpleGen("midoriGD", -2.0);
		break;
	case "i":
		simpleGen("midoriGD", 2.0);
		simpleGen("midoriGD", -2.0);
		break;

	case "j":
		// 床タンク
		MyGame.enemyPools["tank"].get(function(e) {
			e.init(0, -(VIEWPORT - 0.4), VIEWPORT_H + 0.5, false);
			scene.mainLayer.addChild(e);
			MyGame.enemyList.add(e);
		});
		break;
	case "k":
		// 天井タンク
		MyGame.enemyPools["tank"].get(function(e) {
			e.init(0, VIEWPORT - 0.4, VIEWPORT_H + 0.5, true);
			scene.mainLayer.addChild(e);
			MyGame.enemyList.add(e);
		});
		break;

	case "l":
		break;

	case "m":
		gen("box", -5, 5);
		MyGame.enemyPools["cannon"].get(function(e) {
			e.init(0, -4, 5, false);
			scene.mainLayer.addChild(e);
			MyGame.enemyList.add(e);
		});
		MyGame.enemyPools["cannon"].get(function(e) {
			e.init(0, 3, 5, true);
			scene.mainLayer.addChild(e);
			MyGame.enemyList.add(e);
		});
		gen("box2", 4, 5);
		gen("box", 5, 5);
		gen("box2", -5, 6);
		gen("box3", -4, 6);
		gen("box3", 3, 6);
		gen("box3", 4, 6);
		gen("box", 5, 6);
		break;
	case "n":
		gen("box2", 0, 5);
		gen("cannonMini", 0.7, 5.5);
		gen("cannonMiniR", -0.7, 5.5);
		gen("box2", 0, 6);
		break;
	case "o":
		gen("box3", -1, 5);
		gen("cannonMini", -0.3, 5.5);
		gen("cannonMiniR", -1.7, 5.5);
		gen("box3", -1, 6);
		break;
	case "p":
		gen("box", 0, 5);
		gen("cannonMini", 0.7, 5);
		gen("cannonMiniR", -0.7, 5);
		gen("box2", 0, 6);
		gen("cannonMini", 0.7, 6);
		gen("cannonMiniR", -0.7, 6);
		break;
	case "q":
		gen("box", 0, 6);
		break;
	case "r":
		gen("box", 5, 5);
		gen("box3", 4, 5);
		gen("box", -5, 5);

		gen("box2", 5, 6);
		MyGame.enemyPools["cannon"].get(function(e) {
			e.init(0, 4, 6, true);
			scene.mainLayer.addChild(e);
			MyGame.enemyList.add(e);
		});
		MyGame.enemyPools["cannon"].get(function(e) {
			e.init(0, -4, 6, false);
			scene.mainLayer.addChild(e);
			MyGame.enemyList.add(e);
		});
		gen("box", -5, 6);
		break;
	case "s":
		simpleGen("midoriGA", 5.0);
		break;
	case "t":
		simpleGen("midoriGA", -5.0);
		break;
	case "u":
		if (MyGame.level < 2) {
			simpleGen("geins", 0);
		} else {
			simpleGen("geins", 3);
			simpleGen("geins", -3);
		}
		break;
	case "v":
		// ゴプリキュア！！
		var geins = [];
		geins[0] = gen("geins", 5.0, 6);
		geins[1] = gen("geins3", 2.5, 6);
		geins[2] = gen("geins2", 0.0, 6);
		geins[3] = gen("geins4", -2.5, 6);
		geins[4] = gen("geins5", -5.0, 6);

		// stageStepの更新を止める
		MyGame.stageStepUp = false;

		var onDestroyThemAll = function() {
			if (!geins.some(function(g) {
				return g.hp > 0;
			})) {
				game.removeEventListener("enterframe", arguments.callee);

				// stageStepの更新を再開
				MyGame.stageStepUp = true;
			}
		};
		game.addEventListener("enterframe", onDestroyThemAll);
		MyGame.myship.addEventListener("kill", function() {
			game.removeEventListener("enterframe", onDestroyThemAll);
			this.removeEventListener("kill", arguments.callee);
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
	case "E":
		genCapsule(ITEM_RED, 2);
		break;
	case "F":
		genCapsule(ITEM_BLUE, -4);
		break;
	case "G":
		genCapsule(ITEM_YELLOW, 2);
		break;
	case "H":
		genCapsule(ITEM_SPEED, -3);
		break;

	case "z":
		// 自機
		var m = MyGame.myship;
		// ボス
		var boss = genXYZ("boss", 0, -20, 5);
		boss.animate("_initialPose", 1);

		// カメラ
		var pos = MyGame.camPos;
		var tar = MyGame.camTar;

		// easing
		var ein = enchant.Easing.QUAD_EASEIN;
		var eout = enchant.Easing.QUAD_EASEOUT;
		var einout = enchant.Easing.QUAD_EASEINOUT;

		var timer = new Node();
		game.rootScene.addChild(timer);
		// boss.startBattle();
		timer.tl.//
		delay(1).then(function() {
			// 操作不能に
			MyGame.performance = true;
			m.controllable = false;
			m.tl.moveTo(0, 0, -3, 100);

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
		}).//
		delay(1).then(function() {
			// ボス戦BGMスタート
			if (MyGame.bossBgm) {
				MyGame.currentBgm = MyGame.bossBgm;
				MyGame.currentBgm.stop();
				MyGame.currentBgm.volume = 0.2;
				MyGame.currentBgm.play();
			}
		}).//
		delay(30).then(function() {
			pos.tl.//
			moveTo(-5, -5, 0, 60, einout);

			tar.tl.//
			moveTo(0, -20, 5, 60, einout).//
			then(function() {
				boss.animate("default_2", 400);
				boss.tl.moveTo(0, 0, 2, 200, einout);
			}).moveTo(0, 0, 2, 200, einout);
		}).//
		delay(260).then(function() {
			pos.tl.clear().//
			moveTo(-25, m.y * -0.1, m.z * -0.0025, 20, einout);
			tar.tl.clear().//
			moveTo(0, m.y * 0.2, m.z * 0.05, 20, einout);
		}).//
		delay(60).then(function() {
			// アラート消す
			MyGame.alertLabel.hide();

			// 操作可能に
			MyGame.performance = false;
			m.controllable = true;
		}).//
		delay(30).then(function() {
			// ボス戦闘開始
			boss.startBattle();

			// タイマー削除
			game.rootScene.removeChild(this);
		});

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
		MyGame.enemyPools["itemCapsule"].get(function(e) {
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
