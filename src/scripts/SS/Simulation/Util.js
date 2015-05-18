var Kid = require('./Kid');

var Util = {
  attractionIsFull: function(attr) {
    return attr.capacity <= attr.occupants.length;
  },
  enterAttraction: function(kid, attr) {
    if(kid.attractionInstanceId) throw 'kid is already on attraction';
    if(Util.attractionIsFull(attr)) throw 'attraction is already full';
    if(kid.state !== Kid.States.Acquiring) throw 'Kid attempted to ride without acquiring!';

    kid.state = Kid.States.Riding;

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
};

module.exports = Util;
