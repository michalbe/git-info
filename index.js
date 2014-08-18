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
  branches: 'git branch'
};

// this object will be sent to callback, with all the answers
var responseObject = {};

// This function executes git command and add the data to the final object
var execGitCommand = function(command, cb) {
  var response;
  // We don't want to execute a command that wasn't defined before
  if (commands[command]) {
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
  }
};

var gitInfo = function(gitDataToGet, cb) {
  // If first parameter is not an array, make one (with just 1 element)
  if (!Array.isArray(gitDataToGet)) {
    gitDataToGet = [gitDataToGet];
  }

  // Execute all the commands in the same time
  async.each(gitDataToGet, execGitCommand, function(err) {
    // And run callback with results when finished
    cb(null, responseObject);
  });
};

module.exports = gitInfo;
