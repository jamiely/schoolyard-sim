// tests simulation

log.enableAll();

var should = chai.should();

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
    s2.kids[0].attractionInstanceId.should.equal(1);
    s2.kids[1].attractionInstanceId.should.equal(1);
    should.not.exist(s2.kids[2].attractionInstanceId);
    should.not.exist(s2.kids[3].attractionInstanceId);

    // check kids with respect to their own properties
    s2.kids[0].morale.should.be.above(s1.kids[0].morale);
    s2.kids[1].morale.should.be.above(s1.kids[0].morale);
    s2.kids[2].morale.should.be.below(s1.kids[0].morale);
    s2.kids[3].morale.should.be.below(s1.kids[0].morale);

    // check attractions
    var a = s2.attractionInstances[0];
    a.occupants.should.have.length(2);
    a.occupants[0].kidId.should.equal(1);
    a.occupants[1].kidId.should.equal(2);
    a.occupants[0].timeSpent.should.equal(1);
    a.occupants[1].timeSpent.should.equal(1);

    s3.tick.should.equal(2);
  });
});

