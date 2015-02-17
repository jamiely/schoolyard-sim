SS.KidSprite = function(game) {
  Phaser.Sprite.call(this, game, 0, 0);

  var nameTextStyle = { 
    font: "10px Arial", 
    fill: "#EEEEEE", 
    align: "center" 
  };
  var nameText = game.add.text(0, 0, '<Name Here>', nameTextStyle);
  this.addChild(nameText);

  var statsTextStyle = {
    font: "10px Arial", 
    fill: "#EEEEEE", 
    align: "center" 
  };
  var statsText = game.add.text(0, 13, '?', statsTextStyle);
  this.addChild(statsText);

  function getDisplayName(kid) {
    var name = kid.name || 'Unknown';
    return name + ' (' + kid.id + ')';
  }

  this.updateKid = function(kid) {
    nameText.text = getDisplayName(kid);
    statsText.text = 'Health: ' + kid.health + ' Morale: ' + kid.morale;
  };
};

SS.KidSprite.prototype = Object.create(Phaser.Sprite.prototype);
SS.KidSprite.prototype.constructor = SS.KidSprite;

SS.KidsSprite = function(game, x, y) {
  Phaser.Sprite.call(this, game, x, y);

  var self = this,
    kidSprites = [];

  this.showKids = function(kids) {
    var i;
    for(i = 0; i < kids.length; i ++) {
      if(!kidSprites[i]) {
        kidSprites[i] = new SS.KidSprite(game);
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

SS.KidsSprite.prototype = Object.create(Phaser.Sprite.prototype);
SS.KidsSprite.prototype.constructor = SS.KidsSprite;

