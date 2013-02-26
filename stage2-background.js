function setupBackground(game, scene) {
	// 光源追加
//	scene.getDirectionalLight().color = [ 1.2, 1.2, 1.2 ];

	// ゆっくり
	SCROLL_SPEED = 0.04;
	SCROLL_ROT_SPEED = 0.0002;

	// TODO 速く(デバッグ用)
	// SCROLL_SPEED *= 10;

	// 背景
	var bg = new Cylinder(80, 15);
	bg.mesh.texture.ambient = [ 1, 1, 1, 1 ];
	bg.mesh.texture.diffuse = [ 0, 0, 0, 1 ];
	bg.mesh.texture.specular = [ 0, 0, 0, 1 ];
	bg.mesh.texture.src = game.assets["images/stage2_background.png"];
	// bg.mesh.texture.src = game.assets["images/sky.png"];
	scene.backgroundLayer.addChild(bg);
	bg.mesh.reverse();
	bg.addEventListener("enterframe", function() {
		this.rotateYaw(-0.002);
	});

	// ステージモデル
	var water = new PlaneXZ(20); // 水面
	water.name = "water-surface";
	water.mesh.texture.src = (function() {
		var sur = new Surface(64, 64);
		var ctx = sur.context;
		ctx.fillStyle = "rgba(64, 64, 255, 0.02)";
		ctx.fillRect(0, 0, 64, 64);
		return sur.toDataURL();
	})();
	game.assets["model/stage2.l3p.js"].addChild(water);

	var stageModel = (function() {
		var model = game.assets["model/stage2.l3p.js"];
		model.scale(30, 30, 30);
		model.applyRecursive(function(node) {
			if (node.name && node.name.startsWith("water-surface")) {
				// ゆらぐシェーダーを使用
				node.program = MyGame.waterSurfaceShader;
				node._render = function() {
					gl.enable(gl.BLEND);
					gl.blendEquation(gl.FUNC_ADD);
					gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

					this.program.setUniforms(this.scene.getUniforms());
					this.program.setUniforms({
						uTime : game.frame * 0.01
					});
					Sprite3D.prototype._render.apply(this);

					gl.disable(gl.BLEND);
				};
			} else {
				// フォグシェーダーを使用
				node.program = MyGame.backgroundShader;
				node._render = function() {
					this.program.setUniforms(this.scene.getUniforms());
					Sprite3D.prototype._render.apply(this);
				};
			}
		});
		return model;
	})();

	// ステージオブジェクト作成
	var stage = new Stage(stageModel, Stage.scanCheckPoints(stageModel),
			SCROLL_SPEED, SCROLL_ROT_SPEED);
	// scene.backgroundLayer.addChild(stage);
	var stageWrap = new Sprite3D();
	stageWrap.addChild(stage);
	scene.backgroundLayer.addChild(stageWrap);

	stage.addEventListener(Stage.Event.ARRIVE, function(e) {
		if (e.index === 8) {
			stageWrap.addEventListener("enterframe", function() {
				this.rotateYaw(-0.003);
			});
			MyGame.myship.addEventListener("restart", function() {
				stageWrap.clearEventListener("enterframe");
				stageWrap.rotationSet(new Quat(0, 0, 0, 0));
				this.removeEventListener("restart", arguments.callee);
			});
		}

		// TODO デバッグ用
		// console.log(e.index, game.stageStep / 8);
	});

	// 水面の処理。自機が水面に触れると波紋が発生する。
	MyGame.myship.addEventListener("enterframe", function() {
		if (Math.abs(this.y - stage.y) < 0.5) {
			if (game.frame % 3 === 0) {
				var splash = new PlaneXZAnimation(8, 4); // TODO えー、毎回newするの?
				splash.program = MyGame.effectShader;
				splash._render = function() {
					gl.enable(gl.BLEND);
					gl.blendEquation(gl.FUNC_ADD);
					gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
					gl.disable(gl.DEPTH_TEST);

					this.program.setUniforms(this.scene.getUniforms());
					Sprite3D.prototype._render.apply(this);

					gl.enable(gl.DEPTH_TEST);
					gl.disable(gl.BLEND);
				};
				// splash.mesh.texture.src = game.assets["images/hamon.png"];
				splash.mesh.texture.src = game.assets["images/shockwave.png"];
				splash.x = splash.initialX = this.x;
				splash.y = splash.initialY = stage.y + 0.1;
				splash.z = splash.initialZ = this.z;
				splash.relX = stage.x;
				splash.relY = stage.y;
				splash.relZ = stage.z;
				splash.addEventListener("enterframe", function() {
					this.x = this.initialX + (stage.x - this.relX);
					this.y = this.initialY + (stage.y - this.relY);
					this.z = this.initialZ + (stage.z - this.relZ);
					this.frame += 1;

					if (this.frame === 64) {
						this.remove();
						this
								.removeEventListener("enterframe",
										arguments.callee);
					}
				});
				scene.backgroundLayer.addChild(splash);
			}
		}
	});

	// 水中にカメラが入ると視界に色がつく処理
	var shade = new Cube(2);
	shade.mesh.texture.src = (function() {
		var sur = new Surface(64, 64);
		var ctx = sur.context;
		ctx.fillStyle = "rgba(0, 0, 255, 0.2)";
		ctx.fillRect(0, 0, 64, 64);
		return sur.toDataURL();
	})();
	shade.program = MyGame.effectShader;
	shade._render = function() {
		gl.enable(gl.BLEND);
		gl.blendEquation(gl.FUNC_ADD);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

		this.program.setUniforms(this.scene.getUniforms());
		Sprite3D.prototype._render.apply(this);

		gl.disable(gl.BLEND);
	};
	MyGame.camPos.addChild(shade);
	shade.x = 1;
	shade.mesh.reverse();
	shade.visible = false;
	game.addEventListener("enterframe", function() {
		shade.visible = stage.y > 0;
	});

	return stage;
}
