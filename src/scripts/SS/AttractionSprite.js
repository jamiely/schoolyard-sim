SS.AttractionSprite = function(tileSize, attraction, game) {
  Phaser.Sprite.call(this, game, 0, 0);

  this.tint = 0xff00ff;
  var width = tileSize * attraction.dimensions.width;
  var height = tileSize * attraction.dimensions.length;
  this.addChild(createGraphics());
  this.addChild(createLabel());

  function createGraphics() {
    var graphics = game.add.graphics();
    graphics.beginFill(attraction.color, 1);
    graphics.drawRect(0, 0, width, height);
    return graphics;
  }

  function createLabel() {
    var style = { 
      font: "20px Arial", 
      fill: "#EEEEEE", 
      align: "center" 
    };
    var text = game.add.text(0, 0, attraction.id || 'unknown', style);
    //text.anchor.setTo(0.5, 0.5);
    return text;
  }
};

SS.AttractionSprite.prototype = Object.create(Phaser.Sprite.prototype);
SS.AttractionSprite.prototype.constructor = SS.AttractionSprite;

