var Stopwatch = function() {
  var self = this,
    lastTime = null;

  this.getTime = function() {
    return new Date().getTime();
  };

  this.reset = function() {
    lastTime = self.getTime();
  };

  // returns time left since the last time
  this.getElapsedTime = function() {
    return self.getTime() - lastTime;
  };

  // invoke a few things
  self.reset();
};

