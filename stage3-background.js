function setupBackground(game, scene) {
	SCROLL_SPEED = 0.04;
	// TODO 速く(デバッグ用)
	// SCROLL_SPEED *= 10;

	// 侵入者だー！！
	var alertLight = scene.getDirectionalLight();
	var f = function() {
		// if (130 * 8 < this.stageStep && this.stageStep < 190 * 8) {
		// var c = Math.sin((this.stageStep - 130 * 8) * 0.3) + 1.0;
		// alertLight.color = [ c, 1.0, 1.0 ];
		// } else {
		// alertLight.color = [ 1.0, 1.0, 1.0 ];
		// }
	};
	game.addEventListener("enterframe", f);

	// 背景
	var bg = new Cylinder(80, 15);
	bg.mesh.texture.ambient = [ 1, 1, 1, 1 ];
	bg.mesh.texture.diffuse = [ 0, 0, 0, 1 ];
	bg.mesh.texture.specular = [ 0, 0, 0, 1 ];
	bg.mesh.texture.src = game.assets["images/stage2_background.png"];
	scene.backgroundLayer.addChild(bg);
	bg.mesh.reverse();
	// bg.addEventListener("prerender", function() {
	// gl.depthFunc(gl.NEVER)
	// });
	// bg.addEventListener("render", function() {
	// gl.depthFunc(gl.LEQUAL)
	// });

	// ステージモデル
	var stageModel = (function() {
		var model = game.assets["model/stage3.l3p.js"];
		model.scale(40, 40, 40);
		model.applyRecursive(function(node) {
			// フォグシェーダーを使用
			node.program = MyGame.backgroundShader;
			node._render = function() {
				this.program.setUniforms(this.scene.getUniforms());
				Sprite3D.prototype._render.apply(this);
			};
		});
		return model;
	})();

	// ステージオブジェクト作成
	var checkpoints = Stage.scanCheckPoints(stageModel);
	for ( var i = 0, end = checkpoints.length; i < end; i++) {
		checkpoints[i][1] = 0;
	}
	var stage = new Stage(stageModel, checkpoints, SCROLL_SPEED,
			SCROLL_ROT_SPEED);
	var stageWrap = new Sprite3D();
	stageWrap.addChild(stage);
	scene.backgroundLayer.addChild(stageWrap);

	stage.addEventListener(Stage.Event.ARRIVE, function(e) {
		// TODO デバッグ用
		console.log("debug", e.index, game.stageStep / 8);
	});

	// 背景のドネルケバブ
	var bgKabap = [];
	for ( var i = 0; i < 30; i++) {
		var d = new Billboard(random(3, 1));
		d.mesh.texture.src = game.assets["images/enemy_ship2_"
				+ (randomInt(3) + 1) + ".png"];
		d.mesh.texture.ambient = [ 0.4, 0.2, 0.2, 1.0 ];
		d.mesh.texture.diffuse = [ 0.0, 0.0, 0.0, 1.0 ];
		d.mesh.texture.specular = [ 0.0, 0.0, 0.0, 1.0 ];
		d.x = 10 + random(50);
		d.y = random(0, 40);
		d.z = random(0, 60);
		d.addEventListener("enterframe", function() {
			this.z += -0.02 - (game.stageStep * 0.00003);
			if (this.z < -30) {
				this.y = random(0, 40);
				this.z += 60;
			}
		});
		scene.backgroundLayer.addChild(d);
		bgKabap[bgKabap.length] = d;
	}
	game.addEventListener("restart", function() {
		bgKabap.forEach(function(d) {
			d.x = 10 + random(50);
			d.y = random(0, 40);
			d.z = random(0, 60);
		});
	});

	return stage;
}
