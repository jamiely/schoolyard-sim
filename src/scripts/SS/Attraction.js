SS.Attraction = function(template) {
  for(var i in template) {
    this[i] = template[i];
  }
};

SS.Attractions = _.map([
  {
    id: 'slide',
    dimensions: {
      width: 1,
      length: 3,
      duration: 1,
      capacity: 1,
      safety: 3,
    }
  }, {
    id: 'swings',
    dimensions: {
      width: 2,
      length: 4,
      duration: 4,
      capacity: 2,
      safety: 4
    }
  }, {
    id: 'monkey-bars',
    dimensions: {
      width: 4,
      length: 4,
      duration: 4,
      capacity: 4,
      safety: 2
    }
  }
], function(data) {
  return new SS.Attraction(data);
});

