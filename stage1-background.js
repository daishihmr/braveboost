function setupBackground(game, scene) {
	// 背景球
	var bgSphere = new Sphere(100);
	for ( var i = 0, end = bgSphere.mesh.texCoords.length; i < end; i += 2) {
		bgSphere.mesh.texCoords[i + 0] *= 8;
		bgSphere.mesh.texCoords[i + 1] *= 8;
	}
	bgSphere.mesh.texture.ambient = [ 1, 1, 1, 1 ];
	bgSphere.mesh.texture.diffuse = [ 0, 0, 0, 1 ];
	bgSphere.mesh.texture.specular = [ 0, 0, 0, 1 ];
	bgSphere.mesh.texture.src = (function() {
		var size = 512;
		var result = new Surface(size, size);
		var ctx = result.context;
		ctx.fillStyle = "#000000";
		ctx.fillRect(0, 0, size, size);

		for ( var i = 0; i < 500; i++) {
			ctx.fillStyle = "rgba(255,255,255," + random(1) + ")";
			ctx.fillRect(random(size), random(size), 2, 2);
		}

		return result.toDataURL();
	})();
	bgSphere.addEventListener("enterframe", function() {
		var cam = scene.getCamera();
		this.rotateYaw(-0.001);
		this.x = cam.x;
		this.y = cam.y;
		this.z = cam.z;
	});
	scene.backgroundLayer.addChild(bgSphere);
	bgSphere.mesh.reverse();

	// ステージモデル
	var stageModel = (function() {
		var model = game.assets["model/stage1.l3p.js"];
		model.scale(40, 40, 40);
		// 背景用のシェーダーを使用
		model.applyRecursive(function(node) {
			node.program = MyGame.backgroundShader;
			node._render = function() {
				this.program.setUniforms(this.scene.getUniforms());
				Sprite3D.prototype._render.apply(this);
			}
		});
		return model;
	})();

	// ステージオブジェクト作成
	var stage = new Stage(stageModel, Stage.scanCheckPoints(stageModel),
			SCROLL_SPEED, SCROLL_ROT_SPEED);
	scene.backgroundLayer.addChild(stage);

	// デバッグ用
	// stage.addEventListener(Stage.Event.ARRIVE, function(e) {
	// console.log(e.index, game.stageStep / 8);
	// });

	// デブリ
	for ( var i = 0; i < 20; i++) {
		var s = new Cube(0.05);
		s.x = random(30) + 2;
		s.y = random(0, 20);
		s.z = random(20) + 5;
		s.rotationSet(new Quat(random(1), random(1), random(1), random(3)));
		s.addEventListener("enterframe", function() {
			this.z += -0.6;
			if (game.stageStep < 148 * 8) {
				if (this.z < -10) {
					this.x = random(20) + 2;
					this.y = random(0, 20);
					this.z += 20;
				}
			}
		});
		scene.addChild(s)
	}

	return stage;
}
