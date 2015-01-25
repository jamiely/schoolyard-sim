SS.App = function() {
  this.run = function() {
    console.log('Run');

    function create() {
      var text = "Hello World";
      var style = { font: "65px Arial", fill: "#ff0044", align: "center" };
      var t = game.add.text(
        game.world.centerX,
        game.world.centerY,
        text,
        style);
      t.anchor.setTo(0.5, 0.5);
    }

    var game = new Phaser.Game(
      800,
      600,
      Phaser.CANVAS, 
      'game', { 
        create: create 
      });
  };
};

