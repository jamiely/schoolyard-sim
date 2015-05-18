module.exports = function() {
  // @param kids
  // @param attractionInstances These are attractions placed on the
  //                            board.
  this.createState = function(kids, attractionInstances) {
    return {
      tick: 0,
      kids: _.cloneDeep(kids),
      attractionInstances: _.cloneDeep(attractionInstances)
    };
  };
};



