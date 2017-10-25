'use strict';

var assert = require('assert');
var gi = require('../');

// first argument as a function will print all commands
gi(function(err, result) {
  assert(!err);
  assert('name' in result);
  assert(!Array.isArray(result.name));
  assert.equal(result.name, 'git-info');
});

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
  assert(~result.authors.indexOf('Thorsten Scherler <scherler@gmail.com>'));
});

// Strip the star from the current branch name
gi('branch', function(err, result) {
  assert(!err);
  assert('branch' in result);
  assert.equal(result.branch.indexOf('* '), -1);
});

gi('shaShort', function(err, result) {
  assert(!err);
  assert('shaShort' in result);
  assert.equal(result.shaShort.length, 7);
}),

gi('sha', function(err, result) {
  assert(!err);
  assert('sha' in result);
  assert.equal(result.sha.length > 7, true);
});

assert.throws(() => gi('xxx', function (err, result) {}), Error);

gi(['xxx', 'xxx', 'sha'], function(err, result) {
  assert(!err);
  assert(result);
  assert.equal(result.sha.length > 7, true);
  assert.equal(result.errors.length === 2, true);
});

gi(['authorDateRelative'], function(err, result) {
  assert(!err);
  assert(result);
  assert(result.authorDateRelative);
});
