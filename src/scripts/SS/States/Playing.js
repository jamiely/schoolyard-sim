// We want to display the field
SS.States.Playing = function(game) {

  var grid;
  var gridSprite;
  var selectedAttraction;
  var simulation;
  var stopwatch;
  var attractionInstanceId = 1;
  var simInfoSprite;
  var attractionInstanceSprites = [];

  function nextAttractionInstanceId() {
    var a = attractionInstanceId;
    attractionInstanceId ++;
    return a;
  }

  function getCurrentAttractionInstances() {
    return simulation.currentState.attractionInstances;
  }

  function getInstanceFromAttraction(attr) {
    return {
      id: nextAttractionInstanceId(),
      attractionId: attr.id,
      occupants: [],
      capacity: attr.capacity,
      duration: attr.duration
    };
  }

  function addAttractionInstanceToSimulation(attractionInstance) {
    return simulation.addAttractionInstance(attractionInstance);
  }

  function onGridCellDown(index, snappedCoordinates, pointer) {
    console.log(index);
    if(!selectedAttraction) return;

    if(! grid.mayAddAttraction(index, selectedAttraction)) {
      console.log({
        what: 'attraction cannot go at that location',
        index: index,
        attraction: selectedAttraction
      });
      return;
    }

    // track the attraction in the grid
    grid.addAttraction(index, selectedAttraction);

    // setup the attraction sprite
    var attrSprite = new SS.AttractionSprite(32, selectedAttraction, game);

    game.add.existing(attrSprite);
    log.debug({
      message: 'added attraction sprite',
      coordinates: snappedCoordinates
    });
    attrSprite.x = snappedCoordinates.x;
    attrSprite.y = snappedCoordinates.y;

    // add to simulation
    var instance = getInstanceFromAttraction(selectedAttraction);
    addAttractionInstanceToSimulation(instance);
    attractionInstanceSprites[instance.id] = attrSprite;
  }

  function selectAttraction(attr) {
    selectedAttraction = attr;
    console.log(selectedAttraction);
  }

  this.create = function() {
    grid = new SS.Grid(20, 16);

    gridSprite = new SS.GridSprite(grid, game, 0, 0);
    game.add.existing(gridSprite);
    gridSprite.onGridCellDown.add(onGridCellDown);

    simInfoSprite = new SS.SimInfoSprite(game, 0, 0);
    game.add.existing(simInfoSprite);

    var mapping = _.object(
      _.zip(
        [Phaser.Keyboard.ONE, Phaser.Keyboard.TWO, Phaser.Keyboard.THREE],
        SS.Attractions));

    console.log(mapping);
    _.each(mapping, function(attraction, keyboardCode) {
      console.log(arguments);
      game.input.keyboard.addKey(keyboardCode).onDown.add(function() {
        selectAttraction(attraction);
      });
    });

    // testing
    function createInitialState() {
      var fac = new SS.Simulation.StateFactory();
      var kids = [
        { id: 1, health: 100, morale: 100 },
        { id: 2, health: 100, morale: 100 }
      ];
      var attractions = [
        //{ attractionId: 1, occupants: [], capacity: 4, duration: 10 },
        //{ attractionId: 1, occupants: [], capacity: 4, duration: 10 }
      ];
      return fac.createState(kids, attractions);
    }

    log.enableAll();
    stopwatch = new Stopwatch();
    simulation = new SS.Simulation(createInitialState());
  };

  function stepSimulation() {
    if(stopwatch.getElapsedTime() < 5000) {
      return;
    }

    simulation.stepCurrent();
    stopwatch.reset();
    simInfoSprite.updateSimulationInfo(simulation);
  }

  function updateAttractionInstance(attrInstance) {
    var sprite = attractionInstanceSprites[attrInstance.id];
    sprite.updateAttractionInstance(attrInstance);
  }

  function updateAttractions() {
    getCurrentAttractionInstances().forEach(updateAttractionInstance);
  }

  this.update = function() {
    stepSimulation();
    updateAttractions();
  };

  this.render = function() {
  };
};

