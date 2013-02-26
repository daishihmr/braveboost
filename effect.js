function setupEffect(scene) {
	var game = enchant.Game.instance;

	// エフェクトレイヤ
	var effectLayer = new Sprite(game.width, game.height);
	effectLayer.image = new Surface(game.width, game.height);
	var effectGroup = new Group();
	effectGroup.addChild(effectLayer);
	effectGroup.addEventListener("enterframe", function() {
		effectLayer.image.clear();
	});
	// game.rootScene.addChild(effectGroup);
	// detectよりも奥に
	game.rootScene.insertBefore(effectGroup, game.rootScene.firstChild);

	MyGame.clearEffect = function() {
		for ( var i = 0, end = effectGroup.childNodes.length; i < end; i++) {
			var e = effectGroup.childNodes[i];
			if (e !== effectLayer) {
				effectGroup.removeChild(e);
			}
		}
	};

	/**
	 * 汎用
	 * 
	 * @param drawFunction
	 *            {function} エフェクトレイヤを引数に取り、Nodeを返す
	 */
	MyGame.drawEffect = function(drawFunction) {
		drawFunction(effectLayer);
	};

	/**
	 * メガレート表示用ビルボードを作成してプールする.
	 */
	function poolMegaRate(image, count) {
		var pool = [];
		for ( var i = 0; i < count; i++) {
			var result = new Billboard();

			result.mesh.texture.src = game.assets[image];
			result.program = MyGame.effectShader;
			result._render = function() {
				gl.enable(gl.BLEND);
				gl.blendEquation(gl.FUNC_ADD);
				gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
				gl.disable(gl.DEPTH_TEST);

				this.program.setUniforms(this.scene.getUniforms());
				Sprite3D.prototype._render.apply(this);

				gl.enable(gl.DEPTH_TEST);
				gl.disable(gl.BLEND);
			};
			result.addEventListener("enterframe", function() {
				this.y += 0.04;
				if (this.age === 20) {
					this.remove();
					pool.dispose(this);
				}
			});
			pool.pool(result);
			game.addEventListener("restart", function() {
				result.remove();
				pool.dispose(result);
			});
		}
		return pool;
	}
	/**
	 * アニメーションビルボードを作成してプールする.
	 * 
	 * 加算合成版.
	 */
	function poolBillboardAnimation(divide, image, count) {
		var pool = [];
		for ( var i = 0; i < count; i++) {
			var result = new BillboardAnimation(divide);
			result.frame = 0;
			result.rframe = 0;
			result.step = 1;
			result.mesh.texture.src = game.assets[image];
			result.program = MyGame.effectShader;
			result._render = function() {
				gl.enable(gl.BLEND);
				gl.blendEquation(gl.FUNC_ADD);
				gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
				gl.disable(gl.DEPTH_TEST);

				this.program.setUniforms(this.scene.getUniforms());
				Sprite3D.prototype._render.apply(this);

				gl.enable(gl.DEPTH_TEST);
				gl.disable(gl.BLEND);
			};
			result.addEventListener("enterframe", function() {
				this.rframe += this.step;
				this.frame = ~~(this.rframe);
				if (this.scroll) {
					this.z -= SCROLL_SPEED;
				}
				if (this.rframe >= divide * divide) {
					this.dispatchEvent(new Event("finish"));
					pool.dispose(this);
					this.remove();
				}
			});
			pool.pool(result);
			game.addEventListener("restart", function() {
				result.remove();
				pool.dispose(result);
			});
		}
		return pool;
	}
	/** アルファ合成版. */
	function poolBillboardAnimation2(divide, image, count) {
		var pool = [];
		for ( var i = 0; i < count; i++) {
			var result = new BillboardAnimation(divide);

			result.mesh.texture.src = game.assets[image];
			result.program = MyGame.effectShader;
			result._render = function() {
				gl.enable(gl.BLEND);
				gl.blendEquation(gl.FUNC_ADD);
				gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
				gl.disable(gl.DEPTH_TEST);

				this.program.setUniforms(this.scene.getUniforms());
				Sprite3D.prototype._render.apply(this);

				gl.enable(gl.DEPTH_TEST);
				gl.disable(gl.BLEND);
			};
			result.addEventListener("enterframe", function() {
				this.frame += 1;
				if (this.scroll) {
					this.z -= SCROLL_SPEED;
				}
				if (this.frame === divide * divide) {
					this.dispatchEvent(new Event("finish"));
					pool.dispose(this);
					this.remove();
				}
			});
			pool.pool(result);
			game.addEventListener("restart", function() {
				result.remove();
				pool.dispose(result);
			});
		}
		return pool;
	}

	/**
	 * プールしたアニメーションビルボードを表示する.
	 */
	function show(pool, target, size, option) {
		if (!option) {
			option = {};
		}
		return pool.get(function(bb) {
			bb.age = 0;
			if (option.startFrame) {
				bb.frame = bb.rframe = option.startFrame;
			} else {
				bb.frame = bb.rframe = 0;
			}
			bb.x = target.x;
			bb.y = target.y;
			bb.z = target.z;
			bb.scaleX = bb.scaleY = bb.scaleZ = size;
			if (option.step) {
				bb.step = option.step;
			} else {
				bb.step = 1;
			}

			bb.clearEventListener("finish");
			if (option.callback) {
				bb.addEventListener("finish", function() {
					option.callback.call(this);
				});
			}

			if (option.layer) {
				option.layer.addChild(bb);
			} else {
				scene.effectLayer.addChild(bb);
			}
		});
	}
	/**
	 * プールしたアニメーションビルボードを表示する.
	 * 
	 * Sprite3Dに固定する.
	 */
	function showFixed(pool, target, position, size, option) {
		if (!option) {
			option = {};
		}
		return pool.get(function(bb) {
			bb.age = 0;
			if (option.startFrame) {
				bb.frame = bb.rframe = option.startFrame;
			} else {
				bb.frame = bb.rframe = 0;
			}
			bb.x = target.x + position.x;
			bb.y = target.y + position.y;
			bb.z = target.z + position.z;
			bb.scaleX = bb.scaleY = bb.scaleZ = size;
			if (option.step) {
				bb.step = option.step;
			} else {
				bb.step = 1;
			}

			bb.clearEventListener("finish");
			if (option.callback) {
				bb.addEventListener("finish", function() {
					option.callback.call(this);
				});
			}

			var fix = function() {
				this.x = target.x + position.x;
				this.y = target.y + position.y;
				this.z = target.z + position.z;
			};
			bb.addEventListener("enterframe", fix);
			bb.addEventListener("finish", function() {
				this.removeEventListener("enterframe", fix);
				this.removeEventListener("finish", arguments.callee);
			});

			scene.effectLayer.addChild(bb);
		});
	}

	/**
	 * 爆発.
	 */
	var explosionPool = poolBillboardAnimation(8, "images/exp_s.png", 30);
	MyGame.explode = function(target, size) {
		if (!size) {
			size = 1.0;
		}
		show(explosionPool, target, size);
	};

	/**
	 * 大爆発.
	 */
	var explosionLargePool = poolBillboardAnimation(8, "images/exp_l.png", 30);
	MyGame.explodeLarge = function(target, size) {
		if (!size) {
			size = 1.0;
		}
		show(explosionLargePool, target, size);
	};

	/**
	 * 爆発(青).
	 */
	var explosionBluePool = poolBillboardAnimation(8, "images/exp_blue.png", 5);
	MyGame.explodeBlue = function(target, size) {
		if (!size) {
			size = 1.0;
		}
		show(explosionBluePool, target, size);
	}
	/**
	 * 爆発(ボム).
	 */
	var explosionBombPool = poolBillboardAnimation(8, "images/exp_bomb.png", 30);
	MyGame.explodeBomb = function(target, size) {
		if (!size) {
			size = 1.0;
		}
		show(explosionBombPool, target, size);
	}
	/**
	 * 集中していく粒子(大).
	 */
	var gatherLargePool = poolBillboardAnimation(8, "images/gather_large.png",
			5, 0.5);
	MyGame.gatherLarge = function(target, size) {
		if (!size) {
			size = 1.0;
		}
		show(gatherLargePool, target, size);
	}
	/**
	 * 集中していく粒子.
	 */
	var gatherPool = poolBillboardAnimation(8, "images/gather.png", 5, 0.5);
	MyGame.gather = function(target, size, option) {
		if (!size) {
			size = 1.0;
		}
		return show(gatherPool, target, size, option);
	};
	MyGame.gatherFixed = function(target, position, size, option) {
		if (!size) {
			size = 1.0;
		}
		return showFixed(gatherPool, target, position, size, option);
	};
	/**
	 * 集中していく粒子(青).
	 */
	var gatherBluePool = poolBillboardAnimation(8, "images/gather_blue.png", 5,
			0.5);
	MyGame.gatherBlue = function(target, size, option) {
		if (!size) {
			size = 1.0;
		}
		return show(gatherBluePool, target, size, option);
	};
	MyGame.gatherBlueFixed = function(target, position, size, option) {
		if (!size) {
			size = 1.0;
		}
		return showFixed(gatherBluePool, target, position, size, option);
	};

	/**
	 * 衝撃波.
	 */
	var shockwavePool = poolBillboardAnimation(8, "images/shockwave.png", 5);
	MyGame.shockwave = function(target, size) {
		if (!size) {
			size = 1.0;
		}
		show(shockwavePool, target, size);
	};

	/**
	 * 血飛沫.
	 */
	var chishibukiPool = poolBillboardAnimation2(8, "images/chishibuki1.png",
			90);
	MyGame.chishibuki = function(target, size) {
		if (!size) {
			size = 1.0;
		}
		show(chishibukiPool, target, size);
		for ( var i = 0; i < 5; i++) {
			show(chishibukiPool, {
				x : target.x + random(0, size * 0.5),
				y : target.y + random(0, size * 0.5),
				z : target.z + random(0, size * 0.5)
			}, size * 0.6);
		}
	};

	/**
	 * x32.
	 */
	var x32Pool = poolMegaRate("images/x32.png", 10);
	MyGame.effectX32 = function(target) {
		show(x32Pool, target, 1.5, {
			layer : scene.bulletLayer
		});
	}
	/**
	 * x16.
	 */
	var x16Pool = poolMegaRate("images/x16.png", 10);
	MyGame.effectX16 = function(target) {
		show(x16Pool, target, 1.0, {
			layer : scene.bulletLayer
		});
	}
	/**
	 * x8.
	 */
	var x8Pool = poolMegaRate("images/x8.png", 10);
	MyGame.effectX8 = function(target) {
		show(x8Pool, target, 0.8, {
			layer : scene.bulletLayer
		});
	}
	/**
	 * x4.
	 */
	var x4Pool = poolMegaRate("images/x4.png", 10);
	MyGame.effectX4 = function(target) {
		show(x4Pool, target, 0.6, {
			layer : scene.bulletLayer
		});
	}

	/**
	 * 電撃を描画する.
	 */
	MyGame.effectLightning = function(myship, enemy, index) {
		var msc = myship.screenCoord();
		var esc = enchant.gl.extension.screenCoord(enemy.x, enemy.y, enemy.z);

		var vec = [ -30, random(0, 30) ];
		var p = {
			x : msc.x - 0.3,
			y : msc.y
		};
		var path = [ {
			x : p.x,
			y : p.y
		} ];

		for ( var i = 0; i < 50; i++) {
			p.x += vec[0];
			p.y += vec[1];
			path[path.length] = {
				x : p.x + random(0, 20),
				y : p.y + random(0, 20)
			};

			var nv = [ esc.x - p.x, esc.y - p.y ];
			var len = Math.sqrt(nv[0] * nv[0] + nv[1] * nv[1]);
			if (len < 5.0) {
				break;
			}
			nv[0] = nv[0] / len * 10;
			nv[1] = nv[1] / len * 10;
			vec[0] += nv[0];
			vec[1] += nv[1];
			len = Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1]);
			var minLen = 12;
			if (len != 0) {
				vec[0] = vec[0] / len * minLen;
				vec[1] = vec[1] / len * minLen;
			}
		}
		path[path.length] = {
			x : esc.x,
			y : esc.y
		};

		var lightningBolt = new Node();
		lightningBolt.path = path;
		lightningBolt.addEventListener("enterframe", function() {
			var ctx = effectLayer.image.context;
			var last = this.path[this.path.length - 1];
			ctx.globalCompositeOperation = "lighter";
			for ( var j = -1; j <= 1; j++) {
				if (j == 0) {
					ctx.strokeStyle = "rgba(255,255,255,0.5)";
				} else {
					ctx.strokeStyle = "rgba(128,128,255,0.5)";
				}
				ctx.beginPath();
				ctx.moveTo(this.path[0].x, this.path[0].y);
				for ( var i = 1, end = this.path.length; i < end; i++) {
					var rnd = random(0, 10);
					ctx.lineTo(this.path[i].x + j + rnd, this.path[i].y + j
							+ rnd);
					ctx.lineTo(this.path[i].x + j + rnd, this.path[i].y - j
							+ rnd);
				}
				ctx.lineTo(last.x, last.y);
				ctx.stroke();
				ctx.fillRect(0, 0, 1, 1);
			}

			if (this.age > 5) {
				this.parentNode.removeChild(this);
			}
		});
		effectGroup.addChild(lightningBolt);
	};

	/**
	 * 画面を揺らす
	 */
	MyGame.quake = function(count) {
		game.quakeCount = count;
	};
}
