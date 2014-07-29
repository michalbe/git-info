'use strict';

var exec = require('child_process').exec;
var path = 'cd ' + process.cwd() + ';';
var async = require('async');

var commands = {
  name: '(basename $(git rev-parse --show-toplevel))',
  author: 'git log --all --format=\'%aN <%cE>\' | sort -u | head -1',
  repository: 'git config --get remote.origin.url'
};

var responseObject = {};
var execGitCommand = function(command, cb){
  if (commands[command]) {
    exec(path + commands[command], function(error, stdout, stderr) {
      if (error) {
        console.log(error);
      }

      responseObject[command] = stdout.trim();
      cb();
    });
  }
};

var gitInfo = function(gitDataToGet, cb) {
  if (!Array.isArray(gitDataToGet)) {
    gitDataToGet = [gitDataToGet];
  }
  async.each(gitDataToGet, execGitCommand, function(err) {
    cb(null, responseObject);
  });
};

gitInfo(['name', 'author', 'repository'], function(err, result) {
  if (err) {
    console.log(err);
    return;
  }
  console.log(result);
});
