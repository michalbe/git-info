'use strict';

var exec = require('child_process').exec;
// Just to be sure we are in the right directory, before runnig any git
// command we get into the directory where this script was called from
var path = 'cd ' + process.cwd() + ';';
var async = require('async');

// List of git commands needed to execute to get given data
var commands = {
  name: '(basename $(git rev-parse --show-toplevel))',
  author: 'git log --all --format=\'%aN <%cE>\' | sort -u | head -1',
  authors: 'git log --all --format=\'%aN <%cE>\' | sort -u',
  repository: 'git config --get remote.origin.url',
  branch: 'git branch | grep "*"',
  branches: 'git branch',
  shaShort: 'git rev-parse --short HEAD',
  sha: 'git rev-parse HEAD',
};

// This function executes git command and add the data to the final object
var execGitCommand = function(responseObject, command, cb) {
  var response;
  exec(path + commands[command], function(error, stdout, stderr) {
    if (error) {
      console.log(error);
    }
    // Response lines are separated with new line sign, so we remove them
    // (from the begining and the end) using trim() function, then, if asnwer
    // has multi lines, we create an array out of what left
    response = stdout.trim().split('\n');

    // We don't want asterix char in current branch name
    response = response.map(function(el){
      return el.replace('* ', '');
    });
    // When answer has only one line, we don't need an Array
    if (response.length === 1) {
      response = response.pop();
    }

    responseObject[command] = response;

    // async.each callback
    cb();
  });
};

function filterValid(responseObject, value) {
  if (!commands[value]) {
    if (!responseObject.errors) {
      responseObject.errors = new Set();
    }
    responseObject.errors = responseObject.errors.add(value);
  }
  return !!commands[value];
}
/* Main function
 Create a unique responseObject and return it when all async are done.
  */
var gitInfo = function(gitDataToGet, cb) {
  // this object will be sent to callback, with all the answers
  // reset our answer object
  const responseObject = {};
  // If first parameter is not an array, make one (with just 1 element)
  if (!Array.isArray(gitDataToGet)) {
    gitDataToGet = [gitDataToGet];
  }

  // We don't want to execute a command that wasn't defined before
  const filtered = gitDataToGet.filter(filterValid.bind(null, responseObject));
  if (filtered.length===0) {
    throw new Error('No valid definitions for ' +
      JSON.stringify(responseObject.errors));
  }
  // Execute all the commands in the same time
  async.each(filtered, execGitCommand
    .bind(null, responseObject), function(err) {
    // And run callback with results when finished
    cb(err, responseObject);
  });
};

module.exports = gitInfo;
