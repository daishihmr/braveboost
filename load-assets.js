// var SOUND_URL = "http://static.dev7.jp/bbsound/";
var SOUND_URL = "sound/";

function preloadAssets(game) {
	var assets = [
	// シェーダースクリプト
	"shader/standard.vs", //
	"shader/effect.fs", //
	"shader/fog.fs", //
	"shader/waterSurface.fs", //

	// 3Dモデル
	"model/fighter.l3p.js", //
	"model/option_r.l3p.js", //
	"model/option_b.l3p.js", //
	"model/option_y.l3p.js", //
	"model/blue-fire.l3p.js", //
	"model/red-fire.l3p.js", //
	"model/item_white.l3p.js", //
	"model/item2.l3p.js", //
	"model/item_red.l3p.js", //
	"model/item_blue.l3p.js", //
	"model/item_yellow.l3p.js", //
	"model/capsule.l3p.js", //
	"model/laser1.l3p.js", //
	"model/laser2.l3p.js", //
	"model/laser3.l3p.js", //
	"model/laser_blue1.l3p.js", //
	"model/laser_blue2.l3p.js", //
	"model/laser_blue3.l3p.js", //

	// 画像
	"images/exp_s.png", //
	"images/exp_l.png", //
	"images/exp_blue.png", //
	"images/exp_bomb.png", //
	"images/gather.png", //
	"images/gather_blue.png", //
	"images/gather_large.png", //
	"images/chishibuki1.png", //
	"images/shockwave.png", //
	"images/laser1.png", //
	"images/laser2.png", //
	"images/laser_blue1.png", //
	"images/laser_blue2.png", //
	"images/bullet_red.png", //
	"images/bullet_green.png", //
	"images/bullet_blue.png", //
	"images/bullet_yellow.png", //
	"images/x32.png", //
	"images/x16.png", //
	"images/x8.png", //
	"images/x4.png", //
	"images/life.png", //
	"images/clear.png", //

	// サウンド
	SOUND_URL + "miss.mp3", //
	SOUND_URL + "explode.mp3", //
	SOUND_URL + "explode_large.mp3", //
	SOUND_URL + "explode_super.mp3", //
	SOUND_URL + "explode_bomb.mp3", //
	SOUND_URL + "itemget.mp3", //
	SOUND_URL + "extend.mp3", //
	SOUND_URL + "laser.mp3", //
	SOUND_URL + "lightning.mp3", //
	SOUND_URL + "boss.mp3" //
	];

	// ステージ固有アセット
	if (game.stage === 1) {
		assets = assets.concat([ // stage 1
		"model/stage1.l3p.js", //

		"model/enemy1.l3p.js", //
		"model/enemy2.l3p.js", //
		"model/enemy3.l3p.js", //
		"model/enemy5.l3p.js", //
		"model/enemy_ship2.l3p.js", //
		"model/tank.l3p.js", //
		"model/gun.l3p.js", //
		"model/robo_baz.l3p.js", //
		"model/boss1_fly.l3p.js", //
		"model/boss1.l3c.js", //
		"model/missile.l3p.js", //

		SOUND_URL + "stage1.mp3" //
		]);
	} else if (game.stage === 2) { // stage2
		assets = assets.concat([ //
		"images/stage2_background.png", // 背景球用テクスチャ
		"images/sky.png",

		"model/stage2.l3p.js", // ステージ
		"model/devil_fish.l3c.js", // スティンガー君
		"model/munimuni.l3p.js", // むにむに君
		"model/nage.l3p.js", // 矢頭さん
		"model/force2.l3p.js", // スタンダード・フォース君
		"model/puyo.l3p.js", // ぷよ
		"model/ebichan.l3p.js", // エビちゃん
		"model/ika.l3p.js", // イカちゃん
		"model/bigmouth.l3c.js", // でかい口
		"model/ka.l3p.js", // 蚊
		"model/kame.l3p.js", // カメ
		"model/uni.l3p.js", // ウニ

		// boss
		"model/boss2_head.l3p.js", //
		"model/boss2_body.l3p.js", //
		"model/missile2.l3p.js", //

		SOUND_URL + "stage2.mp3" //
		]);
	} else if (game.stage === 3) { // stage3
		assets = assets.concat([ //
		"images/stage2_background.png", // 背景用
		"images/enemy_ship2_1.png", // 背景用
		"images/enemy_ship2_2.png", // 背景用
		"images/enemy_ship2_3.png", // 背景用

		"model/stage3.l3p.js", // ステージ
		"model/enemy1.l3p.js", // ミドリさん
		"model/tank.l3p.js", // タンクくん
		"model/missile.l3p.js", // ミサイル
		"model/robo_baz.l3p.js", // げいんず君
		"model/robo2.l3p.js", // ガトリングげいんず君
		"model/robo3.l3p.js", // ミサイルげいんず君
		"model/robo4.l3p.js", // ブレードげいんず君
		"model/robo5.l3p.js", // シールドげいんず君
		"model/box1.l3p.js", // 障害物1
		"model/box2.l3p.js", // 障害物2
		"model/box3.l3p.js", // 障害物3
		"model/houdai_ue.l3p.js", // 砲台くん(砲)
		"model/houdai_sita.l3p.js", // 砲台くん(台)
		"model/houdai-r_ue.l3p.js", // 逆さ砲台くん(砲)
		"model/houdai-r_sita.l3p.js", // 逆さ砲台くん(台)
		"model/kotti-min-na.l3p.js", // ミサイル砲台
		"model/sin-wave.l3p.js", // サイン派
		"model/sin-wave-kai.l3p.js", // サイン派改

		// boss
		"model/boss3.l3c.js", //

		SOUND_URL + "stage3.mp3" //
		]);
	}

	game.preload(assets);
}

function onLoadAssets(game) {
	// シェーダー
	MyGame.effectShader = new Shader(game.assets["shader/standard.vs"],
			game.assets["shader/effect.fs"]);
	MyGame.backgroundShader = new Shader(game.assets["shader/standard.vs"],
			game.assets["shader/fog.fs"]);
	MyGame.waterSurfaceShader = new Shader(game.assets["shader/standard.vs"],
			game.assets["shader/waterSurface.fs"]);

	// BGM
	if (MyGame.soundEnable) {
		game.assets[SOUND_URL + "boss.mp3"]._start = 0;
		game.assets[SOUND_URL + "boss.mp3"]._end = 148;
	}

	// モデルデータちょっと補正
	[ "model/fighter.l3p.js" ].forEach(function(m) {
		game.assets[m].scale(0.8, 0.8, 0.8);
		game.assets[m].z = 0.1;
	});

	for ( var i = 0; i < 4; i++) {
		game.assets["model/item_white.l3p.js"].childNodes[0].mesh.texture.diffuse[i] *= 3;
		game.assets["model/item_red.l3p.js"].childNodes[0].mesh.texture.diffuse[i] *= 3;
		game.assets["model/item_blue.l3p.js"].childNodes[0].mesh.texture.diffuse[i] *= 3;
		game.assets["model/item_yellow.l3p.js"].childNodes[0].mesh.texture.diffuse[i] *= 3;
		game.assets["model/item2.l3p.js"].childNodes[0].mesh.texture.diffuse[i] *= 3;
	}
	game.assets["model/item_white.l3p.js"].rotateYaw(Math.PI / 2);
	game.assets["model/item_red.l3p.js"].rotateYaw(Math.PI / 2);
	game.assets["model/item_blue.l3p.js"].rotateYaw(Math.PI / 2);
	game.assets["model/item_yellow.l3p.js"].rotateYaw(Math.PI / 2);
	game.assets["model/capsule.l3p.js"].scale(1.2, 1.2, 1.2);

	// ステージ固有
	if (game.stage == 1) {
		// BGM
		if (MyGame.soundEnable) {
			game.assets[SOUND_URL + "stage1.mp3"]._start = 0;
			game.assets[SOUND_URL + "stage1.mp3"]._end = 221;
			MyGame.bgm = game.assets[SOUND_URL + "stage1.mp3"];
			MyGame.bossBgm = game.assets[SOUND_URL + "boss.mp3"];
		}

		// モデルデータ左右反転
		[ "model/enemy1.l3p.js", "model/enemy2.l3p.js", "model/enemy3.l3p.js",
				"model/enemy5.l3p.js", "model/tank.l3p.js",
				"model/enemy_ship2.l3p.js" ].forEach(function(url) {
			game.assets[url].rotateYaw(Math.PI);
		});
		game.assets["model/missile.l3p.js"].scale(0.5, 0.5, 0.5);
		game.assets["model/enemy1.l3p.js"].rotateRoll(Math.PI / 2);
		game.assets["model/enemy1.l3p.js"].scale(0.75, 0.75, 0.75);
		game.assets["model/enemy2.l3p.js"].rotateRoll(Math.PI / 2);
		game.assets["model/enemy2.l3p.js"].scale(1, 0.8, 1);
		game.assets["model/enemy3.l3p.js"].scale(0.6, 0.6, 0.6);
		game.assets["model/enemy5.l3p.js"].scale(1.2, 1.2, 1.2);
		game.assets["model/tank.l3p.js"].scale(2.5, 2.5, 2.5);
		game.assets["model/enemy_ship2.l3p.js"].scale(2, 2, 2);
		game.assets["model/gun.l3p.js"].scale(0.75, 0.75, 0.75);
		game.assets["model/robo_baz.l3p.js"].scale(1.8, 1.8, 1.8);

	} else if (game.stage == 2) {
		// BGM
		if (MyGame.soundEnable) {
			game.assets[SOUND_URL + "stage2.mp3"]._start = 0;
			game.assets[SOUND_URL + "stage2.mp3"]._end = 155;
			MyGame.bgm = game.assets[SOUND_URL + "stage2.mp3"];
			MyGame.bossBgm = game.assets[SOUND_URL + "boss.mp3"];
		}

		// モデルデータ左右反転
		[ "model/munimuni.l3p.js", "model/nage.l3p.js", "model/force2.l3p.js",
				"model/puyo.l3p.js", "model/ebichan.l3p.js", "model/ka.l3p.js",
				"model/kame.l3p.js" ].forEach(function(url) {
			game.assets[url].rotateYaw(Math.PI);
		});
		game.assets["model/munimuni.l3p.js"].scale(3.0, 3.0, 3.0);
		game.assets["model/nage.l3p.js"].scale(2.6, 1.6, 1.6);
		game.assets["model/force2.l3p.js"].scale(2.0, 2.0, 2.0);
		game.assets["model/puyo.l3p.js"].scale(0.5, 0.5, 0.5);
		game.assets["model/ebichan.l3p.js"].scale(1.8, 1.8, 1.8);
		game.assets["model/ka.l3p.js"].scale(1.2, 1.2, 1.2);
		game.assets["model/kame.l3p.js"].scale(0.6, 0.8, 0.6);
		game.assets["model/uni.l3p.js"].scale(2.0, 2.0, 2.0);

	} else if (game.stage == 3) {
		// BGM
		if (MyGame.soundEnable) {
			game.assets[SOUND_URL + "stage3.mp3"]._start = 0;
			game.assets[SOUND_URL + "stage3.mp3"]._end = 120;
			MyGame.bgm = game.assets[SOUND_URL + "stage3.mp3"];
			MyGame.bossBgm = game.assets[SOUND_URL + "boss.mp3"];
		}

		// モデルデータ左右反転
		[ "model/enemy1.l3p.js", "model/tank.l3p.js", "model/sin-wave.l3p.js",
				"model/sin-wave-kai.l3p.js" ].forEach(function(url) {
			game.assets[url].rotateYaw(Math.PI);
		});

		// 正面向かせる
		[ "model/box1.l3p.js" ].forEach(function(url) {
			game.assets[url].rotateYaw(Math.PI * 0.5);
		});

		// モデルデータ調整
		game.assets["model/enemy1.l3p.js"].rotateRoll(Math.PI / 2);
		game.assets["model/enemy1.l3p.js"].scale(0.75, 0.75, 0.75);
		game.assets["model/tank.l3p.js"].scale(2.5, 2.5, 2.5);
		game.assets["model/missile.l3p.js"].scale(0.5, 0.5, 0.5);
		game.assets["model/robo_baz.l3p.js"].scale(1.8, 1.8, 1.8);
		game.assets["model/robo2.l3p.js"].scale(1.8, 1.8, 1.8);
		game.assets["model/robo3.l3p.js"].scale(1.8, 1.8, 1.8);
		game.assets["model/robo4.l3p.js"].scale(1.8, 1.8, 1.8);
		game.assets["model/robo5.l3p.js"].scale(1.8, 1.8, 1.8);
		game.assets["model/sin-wave.l3p.js"].scale(0.5, 0.5, 0.5);
		game.assets["model/sin-wave-kai.l3p.js"].scale(0.5, 0.5, 0.5);
		game.assets["model/houdai_ue.l3p.js"].scale(0.5, 0.5, 0.5);
		game.assets["model/houdai_sita.l3p.js"].scale(0.5, 0.5, 0.5);
		game.assets["model/houdai-r_ue.l3p.js"].scale(0.5, 0.5, 0.5);
		game.assets["model/houdai-r_sita.l3p.js"].scale(0.5, 0.5, 0.5);
	} // ステージ固有 ここまで

	if (MyGame.bgm) {
		MyGame.bgm.volume = MyGame.bgmVolume;
	}
	if (MyGame.bossBgm) {
		MyGame.bossBgm.volume = MyGame.bgmVolume;
	}
}