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

var readListOfUrls = exports.readListOfUrls = function(callback) {
  var urls = [];
  fs.readFile(paths.list, function(err, data) {
    if (err) {
      console.log(err);
    }
    urls = (data.toString() === '') ? [] : data.toString().split('\n');
    callback ? callback(urls) : null;
  });
};

exports.isUrlInList = function(url, callback) {
  var exists = false;
  readListOfUrls(function(urls) {
    exists = urls.indexOf(url) > -1;
    callback(exists);
  });
};

var addUrlToList = exports.addUrlToList = function(url) {
  readListOfUrls(function(urls) {
    urls.push(url);
    fs.writeFile(paths.list, urls.join('\n'), function(err) {
      if (err) {
        console.log(err);
      }
    });
  });
};

var isUrlArchived = exports.isUrlArchived = function(url, callback) {
  var pathName = paths.archivedSites + '/' + url;
  fs.stat(pathName, function(err, stats) {
    callback(Boolean(stats));
  });
};

exports.downloadUrls = function(urlArray) {
  var download = function(url, exists) {
    if (!exists) {
      var req = http.request(url, function(res) {
        var html = '';
        res.on('data', function(chunk) {
          html += chunk;
        });
        res.on('end', function() {
          fs.writeFile(paths.archivedSites + '/' + url, html.toString(), function(error) {
            if (error) {
              console.log(error);
            }
          });
        });
      });
      req.end();
    }
  };  
  urlArray.forEach( url => {
    isUrlArchived(url, download.bind(null, url));
  });

};

exports.addIfNotInList = function(url, exists) {
  if (!exists) {
    addUrlToList(url);
  }
};
