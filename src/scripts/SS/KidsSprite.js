var KidSprite = require('./KidSprite');

KidsSprite = function(game, x, y) {
  Phaser.Sprite.call(this, game, x, y);

  var self = this,
    kidSprites = [];

  this.showKids = function(kids) {
    var i;
    for(i = 0; i < kids.length; i ++) {
      if(!kidSprites[i]) {
        kidSprites[i] = new KidSprite(game);
        self.addChild(kidSprites[i]);
        kidSprites[i].y = i * kidSprites[i].height + 25;
      }
      kidSprites[i].visible = true;
      kidSprites[i].updateKid(kids[i]);
    }
    for(; i < kidSprites.length; i ++) {
      kidSprites[i].visible = false;
    }
  };
};

KidsSprite.prototype = Object.create(Phaser.Sprite.prototype);
KidsSprite.prototype.constructor = KidsSprite;

module.exports = KidsSprite;

