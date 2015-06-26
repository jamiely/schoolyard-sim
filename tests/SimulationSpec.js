// tests simulation

log.enableAll();

var should = chai.should();
var SS = require('../src/scripts/SS');

function createInitialState() {
  var fac = new SS.Simulation.StateFactory();
  var kids = [
    { id: 1, health: 100, morale: 100 },
    { id: 2, health: 100, morale: 100 },
    { id: 3, health: 100, morale: 100 },
    { id: 4, health: 100, morale: 100 }
  ];
  var attractions = [
    { id: 1, attractionId: 1, occupants: [], capacity: 2, duration: 2 }
  ];
  return fac.createState(kids, attractions);
}

describe('Simulation', function() {
  var sim = new SS.Simulation(createInitialState());
  it('has initial state', function() {
    should.exist(sim.currentState);
  });
  it('can step states', function() {
    var s1 = sim.currentState;
    var s2 = sim.step(s1);
    var s3 = sim.step(s2);
    should.exist(s2);
    s2.tick.should.equal(1);
    // check the kids with respect to attractions

    // the tests here are invalid now since movement has been added.
  });
});

