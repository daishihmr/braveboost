function setupItem() {
	// アイテム出現
	MyGame.generateItem = function(type, capsule) {
		var game = MyGame.game;
		if (!capsule.parentNode) {
			return;
		}

		var item = (function(_type) {
			var i1;
			switch (_type) {
			case 0:
				i1 = game.assets["model/item_red.l3p.js"].clone();
				break;
			case 1:
				i1 = game.assets["model/item_blue.l3p.js"].clone();
				break;
			case 2:
				i1 = game.assets["model/item_yellow.l3p.js"].clone();
				break;
			case 3:
				i1 = game.assets["model/item_white.l3p.js"].clone();
				break;
			default:
				return null;
			}
			i1.addEventListener("enterframe", function() {
				this.rotationApply(new Quat(0, 1, 0, -0.2));
			});

			var i2 = game.assets["model/item2.l3p.js"].clone();
			i2.addEventListener("enterframe", function() {
				this.rotationApply(new Quat(0, 1, 0.5, 0.2));
			});

			var _item = new Sprite3D();
			_item.type = _type;
			_item.scale(1.2, 1.2, 1.2);
			_item.addChild(i1);
			_item.addChild(i2);

			return _item;
		})(type);
		if (!item) {
			return;
		}

		item.x = capsule.x;
		item.y = capsule.y;
		item.z = capsule.z;
		capsule.parentNode.addChild(item);
		item.addEventListener("enterframe", function() {
			this.z += -0.03;

			if (!this.inWorld()) {
				this.remove();
				return;
			}

			if (this.intersect(MyGame.myship)) {
				playSound("itemget.mp3");
				MyGame.myship.powerup(this.type);
				MyGame.shockwave(MyGame.myship, 4.0);
				this.remove();
				this.removeEventListener("enterframe", arguments.callee);

				game.incrScore(100);
				return;
			}
		})

		MyGame.itemList.add(item);
	};
}
