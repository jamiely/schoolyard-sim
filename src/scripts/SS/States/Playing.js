// We want to display the field
module.exports = function(game) {

  var PersonSprite = require('../PersonSprite');
  var AttractionSprite = require('../AttractionSprite');
  var Grid = require('../Grid');
  var GridSprite = require('../GridSprite');
  var KidsSprite = require('../KidsSprite');
  var SimInfoSprite = require('../SimInfoSprite');
  var Attractions = require('../Attractions');
  var Simulation = require('../Simulation');
  var Stopwatch = require('../../Stopwatch');

  var grid;
  var gridSprite;
  var selectedAttraction;
  var simulation;
  var stopwatch;
  var attractionInstanceId = 1;
  var simInfoSprite;
  var attractionInstanceSprites = [];
  var childrenSprites;
  var childrenGroup;

  function updateChildren() {
    childrenSprites.showKids(getCurrentChildren());
    childrenGroup.parent.bringToTop(childrenGroup);
    var children = getCurrentChildren();
    var i;
    for(i = 0, count = childrenGroup.countLiving(); 
        i < children.length; i ++) {
      var sprite = null,
        child = children[i];

      if(count <= i) {
        sprite = new PersonSprite(game);
        childrenGroup.addChild(sprite);
        count ++;
      } else {
        sprite = childrenGroup.getChildAt(i);
      }

      //sprite.parent.bringToTop(sprite);

      sprite.visible = true;
      //sprite.x = 100 + i * sprite.width;
      sprite.updatePerson(child);
    }

    for(; i < count; i ++) {
      childrenGroup.getChildAt(i).visible = false;
    }
  }

  function nextAttractionInstanceId() {
    var a = attractionInstanceId;
    attractionInstanceId ++;
    return a;
  }

  function getCurrentAttractionInstances() {
    return simulation.currentState.attractionInstances;
  }

  function getCurrentChildren() {
    return simulation.currentState.kids;
  }

  function getInstanceFromAttraction(attr, coords) {
    return {
      id: nextAttractionInstanceId(),
      attractionId: attr.id,
      occupants: [],
      capacity: attr.capacity,
      duration: attr.duration,
      gridLocation: coords.gridLocation,
      location: coords.location
    };
  }

  function addAttractionInstanceToSimulation(attractionInstance) {
    return simulation.addAttractionInstance(attractionInstance);
  }

  function onGridCellDown(index, snappedCoordinates, pointer) {
    log.debug(index);
    if(!selectedAttraction) return;

    if(! grid.mayAddAttraction(index, selectedAttraction)) {
      log.debug({
        what: 'attraction cannot go at that location',
        index: index,
        attraction: selectedAttraction
      });
      return;
    }

    // track the attraction in the grid
    grid.addAttraction(index, selectedAttraction);

    // setup the attraction sprite
    var attrSprite = new AttractionSprite(32, selectedAttraction, game);

    game.add.existing(attrSprite);
    log.debug({
      message: 'added attraction sprite',
      coordinates: snappedCoordinates
    });
    attrSprite.x = snappedCoordinates.x;
    attrSprite.y = snappedCoordinates.y;

    // add to simulation
    var instance = getInstanceFromAttraction(selectedAttraction, {
      location: snappedCoordinates,
      gridLocation: index
    });
    addAttractionInstanceToSimulation(instance);
    attractionInstanceSprites[instance.id] = attrSprite;
  }

  function selectAttraction(attr) {
    selectedAttraction = attr;
    log.debug(selectedAttraction);
  }

  this.create = function() {
    grid = new Grid(20, 16);

    gridSprite = new GridSprite(grid, game, 0, 0);
    game.add.existing(gridSprite);
    gridSprite.onGridCellDown.add(onGridCellDown);

    childrenSprites = new KidsSprite(game, game.world.width - 150, 0);
    game.add.existing(childrenSprites);

    simInfoSprite = new SimInfoSprite(game, 0, 0);
    game.add.existing(simInfoSprite);

    childrenGroup = game.add.group();

    var mapping = _.object(
      _.zip(
        [Phaser.Keyboard.ONE, Phaser.Keyboard.TWO, Phaser.Keyboard.THREE],
        Attractions));

    log.debug(mapping);
    _.each(mapping, function(attraction, keyboardCode) {
      log.debug(arguments);
      game.input.keyboard.addKey(keyboardCode).onDown.add(function() {
        selectAttraction(attraction);
      });
    });

    // testing
    function createInitialState() {
      var fac = new Simulation.StateFactory();
      var kids = [
        { id: 1, state: Simulation.Kid.States.Roaming, health: 100, morale: 100, location: {x: 100, y: 0}, name: 'John' },
        { id: 2, state: Simulation.Kid.States.Roaming, health: 100, morale: 100, location: {x: 500, y: 0}, name: 'Sally' },
        { id: 3, state: Simulation.Kid.States.Roaming, health: 100, morale: 100, location: {x: 250, y: 300}, name: 'Jane' }
        //{ id: 4, state: Simulation.Kid.States.Roaming, health: 100, morale: 100, location: {x: 100, y: 0}, name: 'Jacob' },
        //{ id: 5, state: Simulation.Kid.States.Roaming, health: 100, morale: 100, location: {x: 500, y: 0}, name: 'Isaac' },
        //{ id: 6, state: Simulation.Kid.States.Roaming, health: 100, morale: 100, location: {x: 250, y: 300}, name: 'Noah' },
        //{ id: 7, state: Simulation.Kid.States.Roaming, health: 100, morale: 100, location: {x: 100, y: 0}, name: 'Abraham' },
        //{ id: 8, state: Simulation.Kid.States.Roaming, health: 100, morale: 100, location: {x: 100, y: 0}, name: 'Soloman' },
        //{ id: 9, state: Simulation.Kid.States.Roaming, health: 100, morale: 100, location: {x: 500, y: 0}, name: 'David' },
        //{ id: 10, state: Simulation.Kid.States.Roaming, health: 100, morale: 100, location: {x: 250, y: 300}, name: 'Jason' },
        //{ id: 11, state: Simulation.Kid.States.Roaming, health: 100, morale: 100, location: {x: 500, y: 0}, name: 'Jack' },
        //{ id: 12, state: Simulation.Kid.States.Roaming, health: 100, morale: 100, location: {x: 250, y: 300}, name: 'Jonah' }
      ];
      kids.forEach(function(kid) {
        kid.location.x = Math.random() * 500;
        kid.location.y = Math.random() * 400;
      });
      var attractions = [
        //{ attractionId: 1, occupants: [], capacity: 4, duration: 10 },
        //{ attractionId: 1, occupants: [], capacity: 4, duration: 10 }
      ];
      log.debug({
        message: 'created initial state',
        kids: kids,
        attractions: attractions,
        states: Simulation.Kid.States
      });
      return fac.createState(kids, attractions);
    }

    log.setLevel(log.levels.ERROR);
    stopwatch = new Stopwatch();
    simulation = new Simulation(createInitialState());
  };

  function stepSimulation() {
    if(stopwatch.getElapsedTime() < 250) {
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
    updateChildren();
  };

  this.render = function() {
  };
};

