var Labels = {};
function setupLabels() {
	var game = enchant.Game.instance;

	/** 情報パネル背景 */
	var panel = new Sprite(game.width, 32);
	panel.backgroundColor = "rgba(0, 0, 0, 0.3)";
	game.rootScene.addChild(panel);

	/** スコア */
	var scoreTitle = new Label("SCORE: ");
	scoreTitle.x = 160;
	scoreTitle.y = 16;
	scoreTitle._style.textAlign = "left";
	scoreTitle._style.fontFamily = "Orbitron";
	scoreTitle._style.color = "white";
	game.rootScene.addChild(scoreTitle);
	var score = new Label("0");
	score.y = 16;
	score._style.textAlign = "right";
	score._style.fontFamily = "Orbitron";
	score._style.color = "white";
	score.refresh = function() {
		this.text = "" + game.score;
	};
	score.addEventListener("enterframe", function() {
		this.refresh();
	});
	game.rootScene.addChild(score);
	Labels.score = score;

	/** 自機のスピード */
	var speed = new Label("SPEED: LV1");
	speed.x = 1;
	speed.y = 16;
	speed._style.fontFamily = "Orbitron";
	speed._style.color = "white";
	speed.refresh = function() {
		this.text = "SPEED: LV" + MyGame.myship.speed;
	};
	speed.addEventListener("enterframe", function() {
		this.refresh();
	});
	game.rootScene.addChild(speed);
	Labels.speed = speed;

	/** サブウェポン */
	var subWeapon = new Label("");
	subWeapon._style.fontFamily = "Orbitron";
	subWeapon.x = 1;
	subWeapon.y = 1;
	subWeapon.refresh = function() {
		if (MyGame.myship.subweapon === 0) {
			this.text = "LASER: LV" + (MyGame.myship.subweaponLevel + 1);
			this._style.color = "#ff3333";
		} else if (MyGame.myship.subweapon === 1) {
			this.text = "THUNDER: LV" + (MyGame.myship.subweaponLevel + 1);
			this._style.color = "#3366ff";
		} else if (MyGame.myship.subweapon === 2) {
			this.text = "NAPALM: LV" + (MyGame.myship.subweaponLevel + 1);
			this._style.color = "#ffff00";
		} else {
			this.text = "";
		}
	};
	subWeapon.addEventListener("enterframe", function() {
		this.refresh();
	});
	game.rootScene.addChild(subWeapon);
	Labels.subWeapon = subWeapon;

	/** 残機 */
	var lifeTitle = new Label("LIFE: ");
	lifeTitle._style.textAlign = "left";
	lifeTitle._style.fontFamily = "Orbitron";
	lifeTitle._style.color = "white";
	lifeTitle.x = 160;
	lifeTitle.y = 1;
	game.rootScene.addChild(lifeTitle);
	var life = new Group();
	life.life = 0;
	life.addEventListener("enterframe", function() {
		if (this.life != MyGame.myship.life) {
			this.life = MyGame.myship.life;
			for ( var i = 0, end = this.childNodes.length; i < end; i++) {
				this.removeChild(this.firstChild);
			}
			for ( var i = 0, end = this.life; i < end; i++) {
				var l = new Sprite(16, 16);
				l.image = game.assets["images/life.png"];
				l.x = game.width - 16 * (i + 1);
				this.addChild(l);
			}
		}
	});
	game.rootScene.addChild(life);

	// アラートラベル
	var alertLabel = MyGame.alertLabel = new Label();
	alertLabel.y = 135;
	alertLabel.text = "";
	alertLabel._style.textAlign = "center";
	alertLabel._style.fontSize = "50px";
	alertLabel._style.fontFamily = "Orbitron";
	alertLabel._style.color = "rgba(0, 127, 127, 0.7)";
	alertLabel._disp = false;
	alertLabel.flashing = true;
	alertLabel.visible = false;
	alertLabel.addEventListener("enterframe", function() {
		this.width = game.width;
		if (this.flashing) {
			if (this._disp && this.age % 5 == 0) {
				this.visible = !this.visible;
			}
		} else {
			if (this._disp) {
				this.visible = true;
			}
		}
	});
	alertLabel.show = function() {
		this._disp = true;
	}
	alertLabel.hide = function() {
		this._disp = false;
		this.visible = false;
	}
	game.rootScene.addChild(alertLabel);

	/** サブゲージ */
	var subgauge = (function() {
		var g = new Group();

		var s0 = new Sprite(64, 4);
		s0.image = new Surface(64, 4);
		s0.backgroundColor = "rgba(64, 255, 64, 0.5)";
		s0.addEventListener("enterframe", function() {
			var m = MyGame.myship;
			this.visible = (m.subweaponEn < m.subweaponEnMax) && m.parentNode;
			if (m.subweaponEn < 0) {
				this.width = 0;
			} else {
				this.width = ~~(16 * (m.subweaponEn / 100));
			}
		});
		g.addChild(s0);

		var s1 = new Sprite(64, 4);
		s1.image = new Surface(64, 4);
		s1.backgroundColor = "rgba(255, 0, 0, 0.5)";
		s1.addEventListener("enterframe", function() {
			var m = MyGame.myship;
			this.visible = (m.subweaponEn < m.subweaponEnMax) && m.parentNode;
			this.x = s0.width;
			this.width = 16 * (m.subweaponEnMax / 100) - s0.width
		});
		g.addChild(s1);

		return g;
	})();
	subgauge.addEventListener("enterframe", function() {
		var m = MyGame.myship
		this.visible = m.subweaponEn < m.subweaponEnMax;
		var c = m.screenCoord();
		this.x = c.x - 10;
		this.y = c.y + 10;
	});
	game.rootScene.addChild(subgauge);

};
