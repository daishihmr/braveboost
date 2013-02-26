/**
 * ぱない爆発.
 */
function superExplosion() {
	var game = MyGame.game;
	var expAge = game.frame;

	// でかいの
	var particles = [];
	for ( var i = 0; i < 300; i++) {
		var p = new Particle(160, 160);
		particles.push(p);
	}
	game.addEventListener("enterframe", function(e) {
		MyGame.drawEffect(function(effectLayer) {
			var ctx = effectLayer.image.context;
			ctx.clearRect(0, 0, effectLayer.width, effectLayer.height);
			ctx.globalCompositeOperation = "lighter";
			for ( var i = 0, end = particles.length; i < end; i++) {
				particles[i].draw(ctx);
				particles[i].tick();
			}
		});
		expAge += 1;
	});
};
var Particle = function(x, y) {
	// 位置
	this.center = {
		x : x,
		y : y
	};

	// 初期半径
	this.radius = 1;

	// 初速度ベクトル
	var t = Math.random() * 2 * Math.PI;
	var v = Math.random() * 15.0 + 0.1;
	this.vec = {
		x : Math.cos(t) * v,
		y : Math.sin(t) * v
	};

	this.age = 0;

	// 拡大っぷり
	this.sizing = Math.random() * 4.0 + 0.8;

	// トゲトゲの数
	this.togeNum = 120;

	// トゲトゲの開始角
	this.tStart = Math.random() * Math.PI * 2;

	// 放射グラデーションの中心の色
	this.colorStart = {
		r : 128,
		g : 128,
		b : 128,
		a : 0.4,
		toStr : function() {
			return "rgba(" + ~~this.r + "," + ~~this.g + "," + ~~this.b + ","
					+ this.a + ")";
		}
	};
	// 放射グラデーションの中間の色
	this.colorMid = {
		r : 128,
		g : 100,
		b : 0,
		a : 0.2,
		toStr : function() {
			return "rgba(" + ~~this.r + "," + ~~this.g + "," + ~~this.b + ","
					+ this.a + ")";
		}
	};
	// 放射グラデーションの最外縁の色
	this.colorEnd = {
		r : 190,
		g : 0,
		b : 0,
		a : 0.0,
		toStr : function() {
			return "rgba(" + ~~this.r + "," + ~~this.g + "," + ~~this.b + ","
					+ this.a + ")";
		}
	};
};
Particle.prototype.draw = function(ctx) {
	if (this.age > 20) {
		if (Math.random() < 0.1) {
			return;
		}
	}
	// 放射グラデーション
	var grad = ctx.createRadialGradient(this.center.x, this.center.y, 0,
			this.center.x, this.center.y, this.radius);
	grad.addColorStop(0.0, this.colorStart.toStr());
	grad.addColorStop(0.5, this.colorMid.toStr());
	grad.addColorStop(1.0, this.colorEnd.toStr());
	ctx.fillStyle = grad;

	// トゲひとつあたりの角度
	var tu = Math.PI * 2 / this.togeNum;
	// トゲトゲの内径（の、外径に対する割合）
	var innerRadius = 0.99;
	if (this.age > 30) {
		innerRadius = 1.0;
	}
	// トゲトゲを描画
	ctx.beginPath();
	ctx.moveTo(this.center.x + Math.cos(this.tStart) * this.radius,
			this.center.y + Math.sin(this.tStart) * this.radius);
	for ( var t = this.tStart, odd = true; t < this.tStart + Math.PI * 2; t += tu, odd = !odd) {
		var radius = this.radius;
		if (!odd) {
			radius *= innerRadius;
		}
		ctx.lineTo(this.center.x + Math.cos(t) * radius, this.center.y
				+ Math.sin(t) * radius);
	}
	ctx.closePath();
	ctx.fill();
};
Particle.prototype.tick = function() {
	// 移動
	this.center.x += this.vec.x;
	this.center.y += this.vec.y;

	// 拡大
	if (this.age < 10) {
		this.radius += 1.8 * this.sizing;
	} else if (this.age < 20) {
		this.radius += 0.9 * this.sizing;
	} else if (this.age < 30) {
		this.radius += 0.3 * this.sizing;
	} else if (this.age < 40) {
		this.radius += 0.2 * this.sizing;
	} else if (this.age < 50) {
		this.radius += 0.1 * this.sizing;
	}
	// 加速
	if (0 < this.age) {
		if (this.vec.x * this.vec.x + this.vec.y * this.vec.y > 5) {
			this.vec.x = this.vec.x * 0.94;
			this.vec.y = this.vec.y * 0.94;
		}
	}
	// 色
	if (60 < this.age) {
		if (this.colorStart.a > 0.001) {
			this.colorStart.a *= 0.9;
		}
		if (this.colorMid.a > 0.001) {
			this.colorMid.a *= 0.9;
		}
	}

	this.age += 1;
};
