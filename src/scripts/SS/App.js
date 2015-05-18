module.exports = App = function() {

  var States = require('./States');

  this.run = function() {
    var game = new Phaser.Game(
      700,
      600,
      Phaser.CANVAS, 
      'game');

    game.state.add('main-menu', new States.MainMenu(game));
    game.state.add('playing', new States.Playing(game));

    //game.state.start('main-menu');
    game.state.start('playing'); // easier for development
  };
};

