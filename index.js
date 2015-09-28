var SOUND_URL = "./sound/";

enchant();
window.onload = function() {
	var game = new Game();
	game.keybind(90, 'a'); // z
	game.keybind(88, 'b'); // x
	game.keybind(32, 'p'); // space

	game.preload([ "images/stage1_open.gif", "images/stage2_open.gif",
			"images/stage3_open.gif", SOUND_URL + "itemget.mp3",
			SOUND_URL + "pi.mp3", SOUND_URL + "po.mp3" ]);
	game.memory.player.preload();

	game.onload = function() {
		var data = game.memory.player.data;
		if (data.bgmOn == undefined) {
			data.bgmOn = true;
			game.memory.update();
		}
		if (!data.cleared) {
			data.cleared = {
				level0 : 0,
				level1 : 0,
				level2 : 0
			};
			game.memory.update();
		} else if (!data.cleared.level0) {
			data.cleared.level0 = 0;
			game.memory.update();
		}

		function gray(img) {
			var sur = new Surface(img.width, img.height);
			sur.draw(img);
			var pixels = sur.context.getImageData(0, 0, sur.width, sur.height);
			for ( var y = 0; y < pixels.height; y++) {
				for ( var x = 0; x < pixels.width; x++) {
					var i = (y * 4) * pixels.width + x * 4;
					var avg = (pixels.data[i] + pixels.data[i + 1] + pixels.data[i + 2]) / 3;
					pixels.data[i] = avg;
					pixels.data[i + 1] = avg;
					pixels.data[i + 2] = avg;
					pixels.data[i + 3] = 255;
				}
			}
			sur.context.putImageData(pixels, 0, 0, 0, 0, pixels.width,
					pixels.height);

			return sur;
		}

		var selectedLevel;
		var selectedStage;
		var bgmOn = data.bgmOn;
		var cleared = [ data.cleared.level0, data.cleared.level1,
				data.cleared.level2 ];
		var images = [ game.assets["images/stage1_open.gif"],
				game.assets["images/stage2_open.gif"],
				game.assets["images/stage3_open.gif"] ];

		function selectLevel(level, soundOff) {
			if (!soundOff)
				game.assets[SOUND_URL + "pi.mp3"].clone().play();

			selectedLevel = level;
			lv.forEach(function(l) {
				l._style.backgroundColor = "rgba(0,0,0,0)";
			});
			lv[level]._style.backgroundColor = "#00aa44";

			stage[0]._style.cursor = "pointer";
			stage[0].image = images[0];

			if (cleared[level] >= 1) {
				stage[1]._style.cursor = "pointer";
				stage[1].image = images[1];
			} else {
				stage[1]._style.cursor = "default";
				stage[1].image = gray(images[1]);
			}
			if (cleared[level] >= 2) {
				stage[2]._style.cursor = "pointer";
				stage[2].image = images[2];
			} else {
				stage[2]._style.cursor = "default";
				stage[2].image = gray(images[2]);
			}

			selectStage(1, true);
		}

		function selectStage(stg, soundOff) {
			if (cleared[selectedLevel] < stg - 1) {
				if (!soundOff) {
					game.assets[SOUND_URL + "po.mp3"].clone().play();
				}
				return false;
			}

			if (!soundOff) {
				game.assets[SOUND_URL + "pi.mp3"].clone().play();
			}

			selectedStage = stg;
			stage.forEach(function(s) {
				s._style.backgroundColor = "rgba(0,0,0,0)";
			});
			stage[stg - 1]._style.backgroundColor = "#00aa44";

			return true;
		}

		function go(con) {
			game.assets[SOUND_URL + "itemget.mp3"].clone().play();
			game.rootScene.addChild(confirmGroup);
		}
		function goToNext() {
			game.assets[SOUND_URL + "itemget.mp3"].clone().play();

			// 9leapストレージに保存
			data.bgmOn = bgmOn;
			game.memory.update();

			// ローカルストレージに保存
			var tempData = {
				level : selectedLevel,
				life : 3,
				score : 0,
				speed : 1,
				subweapon : -1,
				subweaponLevel : -1,
				subweaponEnMax : 100,
				savedAt : new Date().getTime()
			};
			if (selectedLevel == 0) {
				tempData.speed = 2;
				tempData.subweapon = 1;
				tempData.subweaponLevel = 0;
			}
			localStorage.setItem(UUID, JSON.stringify(tempData));

			window.setTimeout(function() {
				// 画面遷移
				location.href = "stage" + selectedStage + ".html";
			}, 1000);
		}

		Label.prototype.setUp = function() {
			this.width = 128;
			this._style.color = "white";
			this._style.backgroundColor = "rgba(0,0,0,0)";
			this._style.paddingLeft = "5px";
		}

		var title = new Label("SETTING");
		title._style.color = "#00aa44";
		title._style.backgroundColor = "rgba(0,0,0,0)";
		title.textAlign = "center";
		title._style.fontSize = "x-large";
		title.x = 0;
		title.y = 16;
		game.rootScene.addChild(title);

		var difficulty = new Label("DIFFICULTY");
		difficulty.setUp();
		difficulty.x = 16;
		difficulty.y = 64;
		game.rootScene.addChild(difficulty);

		var lv = [];
		lv[0] = new Label("EASY");
		lv[0]._style.cursor = "pointer";
		lv[0].setUp();
		lv[0].x = 160;
		lv[0].y = 64;
		game.rootScene.addChild(lv[0]);
		lv[0].addEventListener("touchend", function() {
			selectLevel(0);
		});

		lv[1] = new Label("NORMAL");
		lv[1]._style.cursor = "pointer";
		lv[1].setUp();
		lv[1].x = 160;
		lv[1].y = 80;
		game.rootScene.addChild(lv[1]);
		lv[1].addEventListener("touchend", function() {
			selectLevel(1);
		});

		lv[2] = new Label("HARD");
		lv[2]._style.cursor = "pointer";
		lv[2].setUp();
		lv[2].x = 160;
		lv[2].y = 96;
		game.rootScene.addChild(lv[2]);
		lv[2].addEventListener("touchend", function() {
			selectLevel(2);
		});

		var stage = new Label("STAGE");
		stage.setUp();
		stage.x = 16;
		stage.y = 112;
		game.rootScene.addChild(stage);

		var stage = [];
		stage[0] = new Sprite(64, 64);
		stage[0].x = 32;
		stage[0].y = 128;
		game.rootScene.addChild(stage[0]);
		stage[0].addEventListener("touchend", function() {
			var al = selectedStage === 1;
			if (selectStage(1) && al) {
				go();
			}
		});

		stage[1] = new Sprite(64, 64);
		stage[1].x = 128;
		stage[1].y = 128;
		game.rootScene.addChild(stage[1]);
		stage[1].addEventListener("touchend", function() {
			var al = selectedStage === 2;
			if (selectStage(2) && al) {
				go();
			}
		});

		stage[2] = new Sprite(64, 64);
		stage[2].x = 224;
		stage[2].y = 128;
		game.rootScene.addChild(stage[2]);
		stage[2].addEventListener("touchend", function() {
			var al = selectedStage === 3;
			if (selectStage(3) && al) {
				go();
			}
		});

		var bgm = new Label("SOUND");
		bgm.setUp();
		bgm.x = 16;
		bgm.y = 208;
		game.rootScene.addChild(bgm);
		var bgmOnOff = new Label("");
		if (bgmOn) {
			bgmOnOff.text = "ON";
		} else {
			bgmOnOff.text = "OFF";
		}
		bgmOnOff.setUp();
		bgmOnOff._style.cursor = "pointer";
		bgmOnOff.x = 160;
		bgmOnOff.y = 208;
		game.rootScene.addChild(bgmOnOff);
		bgmOnOff.addEventListener("touchend", function() {
			game.assets[SOUND_URL + "pi.mp3"].clone().play();
			if (bgmOn) {
				this.text = "OFF";
				bgmOn = false;
			} else {
				this.text = "ON";
				bgmOn = true;
			}
		});

		game.addEventListener("upbuttonup", function() {
			if (!confirmGroup.parentNode) {
				selectLevel(selectedLevel - 1);
			}
		});
		game.addEventListener("downbuttonup", function() {
			if (!confirmGroup.parentNode) {
				selectLevel(selectedLevel + 1);
			}
		});
		game.addEventListener("leftbuttonup", function() {
			if (!confirmGroup.parentNode) {
				selectStage(selectedStage - 1);
			}
		});
		game.addEventListener("rightbuttonup", function() {
			if (!confirmGroup.parentNode) {
				selectStage(selectedStage + 1);
			}
		});
		game.addEventListener("abuttonup", function() {
			if (!confirmGroup.parentNode) {
				go();
			} else {
				ok.addEventListener("enterframe", function() {
					if (this.age % 2 === 0) {
						this._style.backgroundColor = "#00aa44";
					} else {
						this._style.backgroundColor = "rgba(0,0,0,0)";
					}
				});
				goToNext();
			}
		});
		game.addEventListener("bbuttonup", function() {
			if (confirmGroup.parentNode) {
				game.assets[SOUND_URL + "po.mp3"].clone().play();
				confirmGroup.parentNode.removeChild(confirmGroup);
			}
		});
		game.addEventListener("pbuttonup", function() {
			bgmOnOff.dispatchEvent(new Event("touchend"));
		});

		selectLevel(1, true);
		selectStage(1, true);

		var confirmGroup = new Group();
		var confirmWindow = new Sprite(224, 128);
		confirmWindow.image = (function() {
			var sur = new Surface(confirmWindow.width, confirmWindow.height);
			var ctx = sur.context;
			ctx.fillStyle = "rgba(0,0,32,0.6)";
			ctx.fillRect(0, 0, sur.width, sur.height);
			ctx.strokeStyle = "white";
			ctx.lineWidth = 5;
			ctx.strokeRect(0, 0, sur.width, sur.height);
			return sur;
		})();
		confirmWindow.x = 48;
		confirmWindow.y = 96;
		confirmGroup.addChild(confirmWindow);
		var confirmText = new Label("GAME START?");
		confirmText.setUp();
		confirmText.x = 96;
		confirmText.y = 112;
		confirmGroup.addChild(confirmText);
		var ok = new Label("OK (Z)");
		ok.setUp();
		ok.x = 112;
		ok.y = 160;
		ok._style.cursor = "pointer";
		ok.addEventListener("touchend", function() {
			this.addEventListener("enterframe", function() {
				if (this.age % 2 === 0) {
					this._style.backgroundColor = "#00aa44";
				} else {
					this._style.backgroundColor = "rgba(0,0,0,0)";
				}
			});
			goToNext();
		});
		confirmGroup.addChild(ok);
		var cancel = new Label("CANCEL (X)");
		cancel.setUp();
		cancel.x = 112;
		cancel.y = 176;
		cancel._style.cursor = "pointer";
		cancel.addEventListener("touchend", function() {
			if (confirmGroup.parentNode) {
				game.assets[SOUND_URL + "po.mp3"].clone().play();
				confirmGroup.parentNode.removeChild(confirmGroup);
			}
		});
		confirmGroup.addChild(cancel);
	};
	game.start();
};
