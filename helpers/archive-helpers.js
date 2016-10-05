var fs = require('fs');
var path = require('path');
var _ = require('underscore');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

var paths = exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

var readListOfUrls = exports.readListOfUrls = function() {
  var urls = [];
  var txtList = fs.createReadStream(paths.list);
  var remaining = '';
  txtList.on('data', function(data) {
    remaining += data;
    var index = remaining.indexOf('\n');
    while (index > -1) {
      var line = remaining.slice(0, index);
      remaining = remaining.slice(index + 1);
      urls.push(line);
      index = remaining.indexOf('\n');
    }
  });
  txtList.on('end', function() {
    if (remaining.length > 0) {
      urls.push(remaining);
    }
  });
  return urls;
};

exports.isUrlInList = function(url) {
  return readListOfUrls().includes(url);
};

exports.addUrlToList = function(url) {
};

exports.isUrlArchived = function() {
};

exports.downloadUrls = function() {
};
