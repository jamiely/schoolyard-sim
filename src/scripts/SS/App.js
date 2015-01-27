SS.App = function() {
  this.run = function() {
    var game = new Phaser.Game(
      800,
      600,
      Phaser.CANVAS, 
      'game');

    game.state.add('main-menu', new SS.States.MainMenu(game));

    game.state.start('main-menu');
  };
};

