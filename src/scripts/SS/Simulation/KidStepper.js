SS.Simulation.KidStepper = function(state) {
  // determines if the kid is doing anything
  function isOccupied(kid) {
    return !! kid.attractionInstanceId;
  }

  // Returns the attraction that the kid most prefers to enter.
  // Right now just returns the first attraction that is not full.
  function getPreferredAttraction(kid) {
    var available = _.filter(state.attractionInstances, function(attr) {
      return !SS.Simulation.Util.attractionIsFull(attr);
    });

    if(available.length === 0) return null;

    return available[Math.floor(Math.random() * available.length)];
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

  this.stepFunction = function(kid) {
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
      SS.Simulation.Util.enterAttraction(kid, preferredAttraction);
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
};

