
SS.Simulation = function(initialState) {
  var self = this;

  this.currentState = initialState;

  this.stepCurrent = function() {
    self.currentState = self.step(self.currentState);
  };

  this.getTick = function() {
    return self.currentState.tick;
  };

  this.addAttractionInstance = function(attrInst) {
    log.debug({
      message: 'addAttractionInstance',
      attractionInstance: attrInst
    });
    self.currentState.attractionInstances.push(attrInst);
  };

  function attractionIsFull(attr) {
    return attr.capacity <= attr.occupants.length;
  }

  function enterAttraction(kid, attr) {
    if(kid.attractionInstanceId) throw 'kid is already on attraction';
    if(attractionIsFull(attr)) throw 'attraction is already full';

    log.debug({
      message: 'Kid attempting to enter attraction',
      kid: kid,
      attr: attr
    });

    kid.attractionInstanceId = attr.id;
    var slot = {
      kidId: kid.id,
      timeSpent: 0
    };
    attr.occupants.push(slot);
    log.debug({
      message: 'Kid entered attraction',
      kid: kid,
      attr: attr,
      spacesRemaining: attr.capacity - attr.occupants.length
    });


    return {
      attractionInstance: attr,
      kid: kid,
      slot: slot
    };
  }

  function kidStepper(state) {
    // determines if the kid is doing anything
    function isOccupied(kid) {
      return !! kid.attractionInstanceId;
    }

    // Returns the attraction that the kid most prefers to enter.
    // Right now just returns the first attraction that is not full.
    function getPreferredAttraction(kid) {
      return _.find(state.attractionInstances, function(attr) {
        return !attractionIsFull(attr);
      });
    }

    function attractionInstanceWithId(id) {
      return _.find(state.attractionInstances, function(ai) {
        return ai.id === id;
      });
    }

    function attractionSlot(kid, attraction) {
      return _.find(attraction.occupants, function(occupant) {
        return occupant.kidId === kid.id;
      });
    }

    function kidFinishedWithAttraction(kid) {
      var attraction = attractionInstanceWithId(kid.attractionInstanceId);
      if(!attraction) throw 'no attraction available.';

      var slot = attractionSlot(kid, attraction);
      if(!slot) throw 'no slot available.';

      log.debug({
        message: 'is kid finished with attraction?',
        slot: slot,
        attraction: attraction,
        duration: attraction.duration,
        timeSpent: slot.timeSpent
      });
      if(slot.timeSpent > attraction.duration) {
        return {
          kid: kid,
          attraction: attraction,
          slot: slot
        };
      }

      return false;
    }

    function exitAttraction(rideInfo) {
      log.debug({
        message: 'Exiting attraction',
        rideInfo: rideInfo,
        attraction: rideInfo.attraction,
        kid: rideInfo.kid
      });
      var attraction = rideInfo.attraction;
      var kid = rideInfo.kid;
      var slot = rideInfo.slot;

      attraction.occupants = _.without(attraction.occupants, slot);
      kid.attractionInstanceId = null;
    }

    return function(kid) {
      log.debug({
        message: 'Stepping kid',
        kid: kid
      });

      if(isOccupied(kid)) {
        log.debug({
          message: 'Kid is occupied',
          kid: kid
        });
        var result = kidFinishedWithAttraction(kid);
        if(result) {
          exitAttraction(result);
          kid.health += 10;
          kid.morale += 10;
        } else {
          // stay on attraction
        }
        return kid;
      } 

      var preferredAttraction = getPreferredAttraction(kid);
      if(preferredAttraction) {
        // get on attraction
        enterAttraction(kid, preferredAttraction);
        kid.morale += 10;
      } else {
        // kid can't get on attraction, is he pissed?
        kid.health -= 5;
        kid.morale -= 20;
        log.debug({
          message: 'Stepping kid: couldnt enter attraction',
          kid: kid
        });
      }

      log.debug({
        message: 'Finished Stepping kid',
        kid: kid
      });

      return kid;
    };
  }

  function incrementSlotTimeSpent(slot) {
    slot.timeSpent ++;
  }

  function attractionInstanceStepper(state) {
    return function(attractionInstance) {
      log.debug({
        message: 'Stepping attraction',
        attr: attractionInstance,
        occupants: JSON.stringify(attractionInstance.occupants)
      });
      _.each(attractionInstance.occupants, incrementSlotTimeSpent);
      log.debug({
        message: 'Finished Stepping attraction',
        attr: attractionInstance,
        occupants: JSON.stringify(attractionInstance.occupants)
      });
      return attractionInstance;
    };
  }

  function tickState(state) {
    state.tick ++;
  }

  // there are kids
  this.step = function(previousState) {
    log.debug({
      message: 'Stepping state',
      state: previousState
    });

    var newState = _.cloneDeep(previousState);
    tickState(newState);

    _.each(newState.kids, kidStepper(newState));
    _.each(newState.attractionInstances, attractionInstanceStepper(newState));

    log.debug({
      message: 'Stepped state',
      previousState: previousState,
      nextState: newState
    });
    return newState;
  }
};

SS.Simulation.StateFactory = function() {
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


// we'll just use vanilla objects to represent
// simulation objects, so they can be more easily copied.
//
// We'll also make them as flat as possible so they're
// easier to clone.
//
// Sample state
// { kids: [], attractionInstances: [] }
//
// Sample kid
// { id: 1, health: 100, morale: 100, attractionInstanceId: 1 }
//
// Sample attraction instances
// { id: 1, attractionId: 1, occupants: [], capacity: 4, duration: 10 }
//
// Sample attraction slot
// timeSpent is the time spent on the attraction
// { kidId: 1, timeSpent: 0}

//
//


