SS.GridSprite = function(grid, game, x, y) {
  Phaser.Sprite.call(this, game, x, y);

  var onGridCellDown = this.onGridCellDown = new Phaser.Signal();
  this.inputEnabled = true;
  this.input.useHandCursor = true;
  var tileSize = 32;
  var gridPixelDimensions = {
    length: tileSize * (grid.length),
    width: tileSize * (grid.width)
  };
  this.width = gridPixelDimensions.width;
  this.height = gridPixelDimensions.height;

  var gridGraphics = createGridGraphics();
  this.addChild(gridGraphics);

  this.events.onInputDown.add(onGridSpriteDown, this);

  function pointerToGridPoint(ptr) {
    return new Phaser.Point(
      Math.floor(ptr.x / tileSize),
      Math.floor(ptr.y / tileSize));
  }

  // converts pointer based coordinates with respect to the grid into
  // grid-index based coordinates.
  function onGridSpriteDown(sprite, ptr) {
    var gridCell = pointerToGridPoint({
      x: ptr.x,
      y: ptr.y
    });
    // bounds checking
    if(gridCell.x >= grid.width) return;
    if(gridCell.y >= grid.length) return;

    var adjustedCoordinates = {
      x: gridCell.x * tileSize,
      y: gridCell.y * tileSize
    };

    onGridCellDown.dispatch(gridCell, adjustedCoordinates, ptr);
  }

  function createGridGraphics() {
    var gridGraphics = game.add.graphics();

    // make sure the dimensions match the graphic so that input is handled
    // appropriately.

    gridGraphics.lineStyle(2, 0xFF0000, 1);

    for(var x = 0; x <= grid.width; x ++) {
      var worldX = x * tileSize;
      gridGraphics.moveTo(worldX, 0);
      gridGraphics.lineTo(worldX, gridPixelDimensions.length);
    }
    for(var le = 0; le <= grid.length; le ++) {
      var worldLe = le * tileSize;
      gridGraphics.moveTo(0, worldLe);
      gridGraphics.lineTo(gridPixelDimensions.width, worldLe);
    }
    return gridGraphics;
  };
};

SS.GridSprite.prototype = Object.create(Phaser.Sprite.prototype);
SS.GridSprite.prototype.constructor = SS.Grid;
