SS.App = function() {
  this.run = function() {
    var game = new Phaser.Game(
      700,
      600,
      Phaser.CANVAS, 
      'game');

    game.state.add('main-menu', new SS.States.MainMenu(game));
    game.state.add('playing', new SS.States.Playing(game));

    //game.state.start('main-menu');
    game.state.start('playing'); // easier for development
  };
};

