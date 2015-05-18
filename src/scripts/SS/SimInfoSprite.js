var SimInfoSprite = function(game, x, y) {
  Phaser.Sprite.call(this, game, x, y);

  var gameClockStyle = { 
    font: "20px Arial", 
    fill: "#EEEEEE", 
    align: "center" 
  };
  var gameClock = game.add.text(0, 0, 'Clock: 0', gameClockStyle);
  this.addChild(gameClock);

  this.updateSimulationInfo = function(sim) {
    gameClock.text = 'Clock: ' + sim.getTick();
  };
};

SimInfoSprite.prototype = Object.create(Phaser.Sprite.prototype);
SimInfoSprite.prototype.constructor = SimInfoSprite;

module.exports = SimInfoSprite;

