PersonSprite = function(game) {
  Phaser.Sprite.call(this, game, 0, 0);

  var EXPRESSIONS = {
    SAD: 0,
    NEUTRAL: 1,
    HAPPY: 2
  };

  var self = this,
    radius = 30,
    half = radius / 2,
    qtr = half / 2,
    eighth = qtr / 2,
    lastColor = 0x666666;

  var 
    face = createFace(),
    label = createText(),
    health = createHealth();

  function createHealth() {
    var g = game.add.graphics();
    updateHealth(g, 100);
    self.addChild(g);
    return g;
  }

  function updateHealth(g, healthPct) {
    g.clear();
    var width = qtr * 2/3,
      totalHeight = radius - qtr,
      height = healthPct/100 * totalHeight,
      x = radius + eighth,
      vpadding = eighth;

    log.debug({
      height: height,
      totalHeight: totalHeight
    });

    g.lineStyle(1, 0xffffff);
    g.beginFill(0x0000000);
    g.drawRect(x, vpadding + 0, width, totalHeight);
    g.endFill();

    g.beginFill(0xff0000);
    g.drawRect(x, vpadding + totalHeight - height, width, height);
    g.endFill();

    return g;
  }

  function createFace() {
    var g = game.add.graphics();

    drawFace(g, EXPRESSIONS.HAPPY);
    self.addChild(g);

    return g;
  }

  function drawFace(g, expression) {
    drawHead(g);
    drawEyes(g);
    drawExpression(g, expression);
  }

  function drawHead(g) {
    g.beginFill(0xff9900, 1);
    g.drawCircle(half, half, radius);
    g.endFill();
    return g;
  }

  function drawExpression(g, expression) {
    var eigthPi = Math.PI * 0.125,
      fourthPi = Math.PI * 0.25,
      halfPi = Math.PI * 0.5;
    switch(expression) {
      case EXPRESSIONS.SAD:
        g.lineStyle(2, 0x000000, 1);
        g.arc(half, radius, qtr, Math.PI + fourthPi, Math.PI + Math.PI - fourthPi);
        break;
      case EXPRESSIONS.HAPPY:
        g.lineStyle(2, 0x000000, 1);
        g.beginFill(0xff0000, 1);
        g.arc(half, half + qtr * .75 , qtr, 0, Math.PI);
        g.endFill();
        break;
      default:
        g.drawRoundedRect(qtr, half + qtr, half, 3, 1);
        break;
    }
    return g;
  }

  function drawEyes(g) {
    g.beginFill(0x000000, 1);
    var eyeline = half;
    g.drawCircle(qtr, eyeline, qtr);
    g.drawCircle(qtr + half, eyeline, qtr);
    g.endFill();
    return g;
  }

  function createText() {
    var style = { 
      font: "10px Arial", 
      fill: "#000000", 
      align: "center" 
    };
    var t = game.add.text(half - 3, radius, '?', style);
    self.addChild(t);
    return t;
  }

  function setBackgroundColor(g, color) {
    if(color === lastColor) return;

    lastColor = color;
    g.clear();
    g.beginFill(color, 1);
    g.drawCircle(half, radius + qtr, half);
    g.endFill();
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
    g.parent.bringToTop(g);

    return g;
  }

  function getExpressionFromKid(kid) {
    if(kid.morale >= 80) {
      return EXPRESSIONS.HAPPY;
    } else if(kid.morale >= 40) {
      return EXPRESSIONS.NEUTRAL;
    }
    return EXPRESSIONS.SAD;
  }

  this.updatePerson = function(person) {
    //TODO
    self.x = person.location.x;
    self.y = person.location.y;
    label.text = person.id;
    drawFace(face, getExpressionFromKid(person));
    updateHealth(health, person.health);
  };
};

PersonSprite.prototype = Object.create(Phaser.Sprite.prototype);
PersonSprite.prototype.constructor = PersonSprite;

module.exports = PersonSprite;
