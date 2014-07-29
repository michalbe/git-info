'use strict';

var fs = require('fs');
var exec = require('child_process').exec;
var path = process.cwd();

var commands = {
  name: '(basename $(git rev-parse --show-toplevel))',
  author: 'git log --all --format=\'%aN <%cE>\' | sort -u | head -1',
  repository: 'git config --get remote.origin.url'
}

var gi = function(command, cb) {
  exec(commands[command], function(error, stdout, stderr) {
    if (error) {
      cb(new Error('Cannot run `git` commnds. Something goes wrong'));
    }
    cb(null, stdout.trim());
  });
}

gi('name', function(err, result) {
  if (err) {
    console.log(err);
    return;
  }
  console.log(result);
});
