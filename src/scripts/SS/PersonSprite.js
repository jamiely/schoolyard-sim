SS.PersonSprite = function(game) {
  Phaser.Sprite.call(this, game, 0, 0);

  var self = this,
    radius = 30,
    half = radius / 2;

  var graphics = createGraphics(),
    label = createText();

  function createText() {
    var style = { 
      font: "20px Arial", 
      fill: "#000000", 
      align: "center" 
    };
    var t = game.add.text(10, 2, '?', style);
    self.addChild(t);
    return t;
  }

  function createGraphics() {
    var g = game.add.graphics();

    g.beginFill(0xFF9900, 1);
    g.drawCircle(half, half, radius);
    self.addChild(g);

    return g;
  }

  this.updatePerson = function(person) {
    //TODO
    self.x = person.x;
    self.y = person.y;
    label.text = person.id;
  };
};

SS.PersonSprite.prototype = Object.create(Phaser.Sprite.prototype);
SS.PersonSprite.prototype.constructor = SS.PersonSprite;

