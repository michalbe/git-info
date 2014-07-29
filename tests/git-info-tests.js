'use strict';

var assert = require('assert');
var gi = require('../');

// First argument as a string
gi('name', function(err, result) {
  assert(!err);
  assert(!Array.isArray(result));
  assert('name' in result);
  assert.equal(result.name, 'git-info');
});
