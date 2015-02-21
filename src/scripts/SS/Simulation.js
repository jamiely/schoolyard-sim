
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

    var kidStepper = function(s) {
      var stepper = new SS.Simulation.KidStepper(s);
      return _.bind(stepper.stepFunction, stepper);
    };

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


