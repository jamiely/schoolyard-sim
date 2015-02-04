// We want to display the field
SS.States.Playing = function(game) {

  var grid;
  var gridSprite;
  var selectedAttraction;

  function onGridCellDown(index) {
    console.log(index);
  }

  function selectAttraction(attr) {
    selectedAttraction = attr;
    console.log(selectedAttraction);
  }

  this.create = function() {
    grid = new SS.Grid(20, 16);

    gridSprite = new SS.GridSprite(grid, game, 0, 0);
    game.add.existing(gridSprite);
    gridSprite.onGridCellDown.add(onGridCellDown);

    var mapping = _.object(
      _.zip(
        [Phaser.Keyboard.ONE, Phaser.Keyboard.TWO, Phaser.Keyboard.THREE],
        SS.Attractions));

    console.log(mapping);
    _.each(mapping, function(attraction, keyboardCode) {
      console.log(arguments);
      game.input.keyboard.addKey(keyboardCode).onDown.add(function() {
        selectAttraction(attraction);
      });
    });
  };

  this.render = function() {
  };
};

