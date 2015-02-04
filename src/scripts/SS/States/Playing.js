// We want to display the field
SS.States.Playing = function(game) {

  var grid;
  var gridSprite;
  var tileSize = 32;

  this.create = function() {
    grid = new SS.Grid(20, 16);
    createGridGraphics();
  };

  function pointerToGridPoint(ptr) {
    return new Phaser.Point(
      Math.floor(ptr.x / tileSize),
      Math.floor(ptr.y / tileSize));
  }

  // converts pointer based coordinates with respect to the grid into
  // grid-index based coordinates.
  function onGridSpriteDown(sprite, ptr) {
    console.log(pointerToGridPoint({
      x: ptr.x,
      y: ptr.y
    }));
  }

  var createGridGraphics = this.createGridGraphics = function() {
    console.log('createGridGraphics');

    var gridGraphics = game.add.graphics();
    var gridPixelDimensions = {
      length: tileSize * (grid.length - 1),
      width: tileSize * (grid.width - 1)
    };

    gridSprite = game.add.sprite(0, 0, null);
    gridSprite.addChild(gridGraphics);
    gridSprite.inputEnabled = true;
    gridSprite.input.useHandCursor = true;
    gridSprite.events.onInputDown.add(onGridSpriteDown, this);
    // make sure the dimensions match the graphic so that input is handled
    // appropriately.
    gridSprite.width = gridPixelDimensions.width;
    gridSprite.height = gridPixelDimensions.height;

    gridGraphics.lineStyle(2, 0xFF0000, 1);

    for(var x = 0; x < grid.width; x ++) {
      var worldX = x * tileSize;
      gridGraphics.moveTo(worldX, 0);
      gridGraphics.lineTo(worldX, gridPixelDimensions.length);
    }
    for(var le = 0; le < grid.length; le ++) {
      var worldLe = le * tileSize;
      gridGraphics.moveTo(0, worldLe);
      gridGraphics.lineTo(gridPixelDimensions.width, worldLe);
    }
  };

  this.render = function() {
  };
};

