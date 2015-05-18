KidSprite = function(game) {
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

KidSprite.prototype = Object.create(Phaser.Sprite.prototype);
KidSprite.prototype.constructor = KidSprite;

module.exports = KidSprite;


