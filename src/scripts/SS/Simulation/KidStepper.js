// A kid has a certain state among these:
// * acquiring - This means the kid has selected an attraction
//               that he or she wants to use and is heading
//               towards it.
// * riding    - This means that the kid is riding an attraction.
// * roaming   - The kid is just exploring. This is the default state.
module.exports = function(state) {
  var Sim = require('../Simulation');
  var Kid = require('./Kid');
  var Util = require('./Util');

  // determines if the kid is doing anything
  function isOccupied(kid) {
    return kid.state === Kid.States.Riding;
  }

  function isRoaming(kid) {
    return kid.state === Kid.States.Roaming;
  }

  function isAcquiring(kid) {
    return kid.state === Kid.States.Acquiring;
  }

  // Returns the attraction that the kid most prefers to enter.
  // Right now just returns the first attraction that is not full.
  function getPreferredAttraction(kid) {
    var available = _.filter(state.attractionInstances, function(attr) {
      return !Util.attractionIsFull(attr);
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
    if(!kid.attractionInstanceId) {
      log.error({
        message: 'kidFinishedWithAttraction: Is missing an attraction instance Id',
        kid: kid
      });
      throw 'kid should have attraction instance id';
    }
    var attraction = attractionInstanceWithId(kid.attractionInstanceId);
    if(!attraction) {
      log.error({
        message: 'kidFinishedWithAttraction: no such attraction',
        attractionInstanceId: kid.attractionInstanceId
      });
      throw 'no attraction with that Id available.';
    }

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
    kid.state = Kid.States.Roaming;
  }

  function augmentHealth(kid, delta) {
    kid.health = Phaser.Math.clamp(kid.health + delta, 0, 100);
  }

  function adjustMorale(kid, delta) {
    kid.morale = Phaser.Math.clamp(kid.morale + delta, 0, 100);
  }

  function handleOccupied(kid) {
    log.debug({
      message: 'Kid is occupied',
      kid: kid
    });
    var result = kidFinishedWithAttraction(kid);
    if(result) {
      exitAttraction(result);
      augmentHealth(kid, 20);
      adjustMorale(kid, 10);
    } else {
      // stay on attraction
    }
    return kid;
  }

  function handleRoaming(kid) {
    var preferredAttraction = getPreferredAttraction(kid);
    if(preferredAttraction) {
      kid.preferredAttraction = preferredAttraction;
      kid.state = Kid.States.Acquiring;
    } else {
      // no attractions available, is he pissed?
      adjustMorale(kid, -5);
      log.debug({
        message: 'Stepping kid: couldnt enter attraction',
        kid: kid
      });
    }
    return kid;
  }

  function isClose(kid, attr) {
    if(!kid.location.distance) {
      kid.location = new Phaser.Point(kid.location.x, kid.location.y);
    }
    var distance = kid.location.distance(attr.location);
    return distance < 10;
  }

  function canUseAttraction(kid, attr) {
    return !Util.attractionIsFull(attr);
  }

  function handleAcquiringAndIsClose(kid) {
    var preferredAttraction = kid.preferredAttraction;
    if(canUseAttraction(kid, preferredAttraction)) {
      // get on attraction
      Util.enterAttraction(kid, preferredAttraction);
      kid.preferredAttraction = null;
      adjustMorale(kid, 10);
    } else {
      // kid can't get on attraction, is he pissed?
      augmentHealth(kid, -5);
      adjustMorale(kid, -10);
      log.debug({
        message: 'Stepping kid: couldnt enter attraction',
        kid: kid
      });
    }
  }

  // makes the kid go closer to the preferredAttraction
  function goTowardsAttraction(kid) {
    var attr = kid.preferredAttraction;
    if(! attr) throw 'Kid must have preferred attraction to go towards it';

    var differenceVector = Phaser.Point.subtract(kid.location, attr.location);
    var deltaFuncs = [];
    var velocity = 5;
    if(differenceVector.x !== 0) {
      deltaFuncs.push(function(location) {
        return Phaser.Point.add(location, new Phaser.Point(differenceVector.x > 0 ? -velocity : velocity, 0));
      });
    }
    if(differenceVector.y !== 0) {
      deltaFuncs.push(function(location) {
        return Phaser.Point.add(location, new Phaser.Point(0, differenceVector.y > 0 ? -velocity : velocity));
      });
    }

    if(deltaFuncs.length === 0) {
      log.warn({
        message: 'goTowardsAttraction: Kid seems to already be at attraction',
        kid: kid,
        attr: attr,
        differenceVector: differenceVector
      });
      return kid;
    }

    var orig = kid.location;
    deltaFuncs.forEach(function(f) {
      kid.location = f(kid.location);
    });
    log.debug({
      message: 'goTowardsAttraction',
      orig: orig,
      current: kid.location
    });

    return kid;
  }

  function handleAcquiring(kid) {
    var preferredAttraction = kid.preferredAttraction;
    if(! preferredAttraction) throw 'Kid is acquiring but there is no preferred attraction';

    if(isClose(kid, preferredAttraction)) {
      kid = handleAcquiringAndIsClose(kid);
    } else {
      // expend some health getting to the attraction
      augmentHealth(kid, -1);
      goTowardsAttraction(kid);
      adjustMorale(kid, -1);
    }

    log.debug({
      message: 'Finished Stepping kid',
      kid: kid
    });

    return kid;
  }

  this.stepFunction = function(kid) {
    log.debug({
      message: 'Stepping kid',
      kid: kid,
      kidState: kid.state
    });

    if(isOccupied(kid)) {
      return handleOccupied(kid);
    } 

    if(isRoaming(kid)) {
      return handleRoaming(kid);
    }

    if(isAcquiring(kid)) {
      return handleAcquiring(kid);
    }

    // otherwise we just return the kid as is
    return kid;
  };
};

