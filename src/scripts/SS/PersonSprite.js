SS.PersonSprite = function(game) {
  Phaser.Sprite.call(this, game, 0, 0);

  var self = this,
    radius = 30,
    half = radius / 2,
    lastColor = 0x666666;

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

  function setBackgroundColor(g, color) {
    if(color === lastColor) return;

    lastColor = color;
    g.clear();
    g.beginFill(color, 0.5);
    g.drawCircle(half, half, radius);
  }

  function getColorFromHealth(health) {
    if(health >= 80) {
      return 0x00ff00;
    } else if(health >= 30) {
      return 0xff9900;
    }
    return 0xff0000;
  }

  function createGraphics() {
    var g = game.add.graphics();

    setBackgroundColor(g, 0xFF9900);
    self.addChild(g);

    return g;
  }

  this.updatePerson = function(person) {
    //TODO
    self.x = person.location.x;
    self.y = person.location.y;
    label.text = person.id;
    setBackgroundColor(graphics, getColorFromHealth(person.health));
  };
};

SS.PersonSprite.prototype = Object.create(Phaser.Sprite.prototype);
SS.PersonSprite.prototype.constructor = SS.PersonSprite;

