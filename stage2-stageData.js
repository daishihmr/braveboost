// 1文字8フレーム
var StageData = ""
		+ "123AC 123.. 123.. 123.. ..... ..... 567D. 567.. 567.. 567.." // 0
		+ "..... a.... ..... ..... ..... b.... ..... ..... ..... b...." // 50
		+ "e.... e.... e.... e.... e.... ..... ..... ..d94 89B48 12321" // 100
		+ "..... ..... ..... ..... ..... ..... ..... ..... g.h.i g.h.i" // 150
		+ "..... ..... ..k.. ..... g.h.i ..... ..... ..k.. ..... ....." // 200
		+ "D.j.. ..... g.h.i lm... no... ..... BD... ..... g.h.i ....." // 250
		+ "p.... ..... e.... e.... e.... e.... e.... 79687 79687 ....." // 300
		+ "..... 01q2r 1q2r3 ..... ..... ..... *.... ..... ..... ....." // 350
		+ "..... ..... ..... s.... s.... s.... ..... ..... ..... ....." // 400
		+ "..... ..... ABD.. ..Z.. ..... ..... z.... ..... ..... ....." // 450
		+ "..... ..... ..... ..... ..... ..... ..... ..... ..... ....." // 500
		// 0_____5_____10____15____20____25____30____35____40____45
;
StageData = StageData.split(" ").join("");

function stage(scene, id) {
	var game = MyGame.game;

	// チェックポイント通過チェック
	// 1
	// 2
	// 3
	// 4
	// 5 ここから水平に飛ぶ
	// 6
	// 7 ここから下に
	// 8 終点
	if (game.stageStep === 135 * 8) {
		game.checkpoint = [ 2, 135 * 8 ];
	} else if (game.stageStep === 262 * 8) {
		game.checkpoint = [ 5, 262 * 8 ];
	} else if (game.stageStep === 447 * 8) {
		game.checkpoint = [ 7, 447 * 8 ];
	}

	switch (id) {
	case "*":
		simpleGen("floatingUni");
		break;

	case "1":
		simpleGen("puyo", 3);
		break;
	case "2":
		simpleGen("puyo", 2);
		break;
	case "3":
		simpleGen("puyo", 1);
		break;
	case "5":
		simpleGen("puyo", -1);
		break;
	case "6":
		simpleGen("puyo", -2);
		break;
	case "7":
		simpleGen("puyo", -3);
		break;

	case "0":
		if (MyGame.level >= 1)
			simpleGen("puyo", 1);
		break;
	case "q":
		if (MyGame.level >= 1)
			simpleGen("puyo", 2);
		break;
	case "r":
		if (MyGame.level >= 1)
			simpleGen("puyo", 3);
		break;
	case "4":
		if (MyGame.level >= 1)
			simpleGen("puyo", -1);
		break;
	case "8":
		if (MyGame.level >= 1)
			simpleGen("puyo", -2);
		break;
	case "9":
		if (MyGame.level >= 1)
			simpleGen("puyo", -3);
		break;

	case "a":
		genXYZ("r9a", 0, -5, 5);
		break;

	case "b":
		simpleGen("kurage", 0);
		simpleGen("kurage", 0);
		if (MyGame.level >= 1) {
			simpleGen("kurage", 0);
			simpleGen("kurage", 0);
		}
		break;

	case "d":
		simpleGen("stinger", -2);
		break;

	case "e":
		simpleGen("ebichan", 0);
		break;

	case "f":
		simpleGen("munimuni2", 4);
		simpleGen("munimuni", -4);
		break;

	case "g":
		gen("ika", -5, 3 + random(0, 1));
		break;
	case "h":
		gen("ika", -5, 1 + random(0, 1));
		break;
	case "i":
		gen("ika", -5, -1 + random(0, 1));
		break;

	case "j":
		gen("bigmouth", -9, 0);
		break;

	case "k":
		gen("ka", -5, 5);
		break;

	case "l":
		gen("kame", 2, 5);
		break;
	case "m":
		gen("kame", 0, 5);
		break;
	case "n":
		if (MyGame.level >= 1)
			gen("kame", 1, 5);
		break;
	case "o":
		if (MyGame.level >= 1)
			gen("kame", -1, 5);
		break;

	case "p":
		simpleGen("stinger", -3);
		break;

	case "s":
		gen("kurage", -5, 0);
		if (MyGame.level >= 1) {
			gen("kurage", -5, 0);
			gen("kurage", -5, 0);
		}
		break;

	case "A":
		genCapsule(ITEM_RED, 2);
		break;
	case "B":
		genCapsule(ITEM_BLUE, -2);
		break;
	case "C":
		genCapsule(ITEM_YELLOW, 0);
		break;
	case "D":
		genCapsule(ITEM_SPEED, 2);
		break;

	case "Z":
		// BGM止める
		if (MyGame.currentBgm) {
			try {
				MyGame.currentBgm.stop();
			} catch (e) {
				console.error(e);
			}
		}
		// ボス戦BGMスタート
		if (MyGame.bossBgm) {
			MyGame.currentBgm = MyGame.bossBgm.clone();
			MyGame.currentBgm.name = MyGame.bossBgm.name;
			MyGame.currentBgm.volume = 0.2;
			MyGame.currentBgm.play();
		}

		var orig = VIEWPORT;
		VIEWPORT = 5.5;
		MyGame.myship.addEventListener("restart", function() {
			VIEWPORT = orig;
		});
		break;
	case "z":
		gen("boss", 0, 2);
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
