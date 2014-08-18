'use strict';

// I hope those tests will work also in forks.
// I hope.
// Hope is mother of stupid
var assert = require('assert');
var gi = require('../');

// First argument as a string
gi('name', function(err, result) {
  assert(!err);
  assert('name' in result);
  assert(!Array.isArray(result.name));
  assert.equal(result.name, 'git-info');
});

// First argument as an Array
gi(['name', 'repository'], function(err, result) {
  assert(!err);
  assert('name' in result);
  assert('repository' in result);
  assert.equal(result.name, 'git-info');
});

// Multiline answer
gi('authors', function(err, result) {
  assert(!err);
  assert('authors' in result);
  assert(Array.isArray(result.authors));
  assert(~result.authors.indexOf('Michal Budzynski <michal@virtualdesign.pl>'));
});

// Strip the star from the current branch name
gi('branch', function(err, result) {
  assert(!err);
  assert('branch' in result);
  assert.equal(result.branch.indexOf('* '), -1);
});


// On the other hand - 'Hope is when you feel the pain that makes you try again'
