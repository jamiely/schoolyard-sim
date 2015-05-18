module.exports = function(template) {
  for(var i in template) {
    this[i] = template[i];
  }
};

