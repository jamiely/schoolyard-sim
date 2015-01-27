SS.States.MainMenu = function(game) {
  var buttonFactory = new SS.ButtonFactory(game);
  var buttonDefinitions = [{
    label: 'Start',
    callback: startGame
  }, {
    label: 'Choose Level',
    callback: notImplemented
  }, {
    label: 'Credits',
    callback: notImplemented
  }];
  var buttons = [];

  this.preload = function() {
    buttonFactory.preload();
  };

  this.create = function() {
    buttons = _.map(buttonDefinitions, function(defn) {
      return buttonFactory.newButton(defn.label, defn.callback);
    });

    var startButton = 200;
    var buttonPadding = 10;
    _.each(buttons, function(button) {
      button.y = startButton + button.height;
      button.x = game.world.centerX - button.width / 2;

      startButton += button.height + buttonPadding;
    });
  };

  this.shutdown = function() {
    buttons.invoke('destroy');
    buttonFactory = null;
  };

  function startGame() {
    game.state.start('new-game');
  }

  function notImplemented() {
    alert('Not implemented yet');
  }
};
