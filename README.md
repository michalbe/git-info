# git-info by [@michalbe](http://github.com/michalbe) #
Get detailed data about current git repo.

### How to use: ###
```
npm install git-info
```
then:
```javascript
var gi = require('git-info');

// First argument of the function can be a String
gi('name', function(err, result) {
  console.log(result); // { name: name-of-the-repo }
});

// Or Array of Strings
gi(['name', 'author'], function(err, result) {
  console.log(result); // { name: name-of-the-repo,
             // author: author of the repo }
});

// Sometimes the answer can be multiline
gi('authors', function(err, result) {
  console.log(result); // { authors: [array of all the authors from the project] }
});
```

### API ###
Supported commands:
  * `author` - top author of the repo
  * `authors` - list of all the authors
  * `authorDate` - date of last commit
  * `authorDateRelative` - relative date of last commit
  * `name` - name of the repository
  * `repository` - address of the repo
  * `branch` - current branch
  * `branches` - all the branches in the repo
  * `sha` - sha of the last commit
  * `shaShort` - short form of the sha of the last commit
  * `subject` - message of the last commit
