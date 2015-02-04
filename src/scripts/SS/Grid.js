SS.Grid = function(width, length) {
  this.width = width;
  this.length = length;

  var GRID = {
    EMPTY: 0
  };
  var grid = [];
  for(var w = 0; w < width; w++) {
    grid[w] = [];
    for(var h = 0; h < length; h++) {
      grid[w].push(GRID.EMPTY);
    }
  }

  var isEmpty = function(x, y) {
    return grid[x][y] === GRID.EMPTY;
  };

  // Determines if an attraction may be added at the passed point
  var mayAddAttraction = this.mayAddAttraction = function(pt, attraction) {
    for(var w = 0; w < attraction.width; w ++) {
      for(var le = 0; le < attraction.length; le ++) {
        if(!isEmpty(pt.x + w, pt.y + le)) return false;
      }
    }
    return true;
  };

  // Attempts to add an attraction at the passed point
  var addAttraction = this.addAttraction = function(pt, attraction) {
    for(var w = 0; w < attraction.width; w ++) {
      for(var le = 0; le < attraction.length; le ++) {
        var x = pt.x + w,
          y = pt.y + le;
        if(!isEmpty(x, y)) {
          throw 'Cannot add attraction to occupied position (' + x + ', ' + y + ')';
        }
        grid[x][y] = attraction;
      }
    }
  };
};

