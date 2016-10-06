var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');

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

var readListOfUrls = exports.readListOfUrls = function(callback) {
  fs.readFile(paths.list, (err, data) => {
    var urls = (data.toString() === '') ? [] : data.toString().split('\n');
    callback ? callback(urls) : null;
  });
};

exports.isUrlInList = function(url, callback) {
  readListOfUrls(urls => callback(urls.indexOf(url) > -1));
};

var addUrlToList = exports.addUrlToList = function(url) {
  readListOfUrls(function(urls) {
    urls.push(url);
    fs.writeFile(paths.list, urls.join('\n'), err => {});
  });
};

var isUrlArchived = exports.isUrlArchived = function(url, callback) {
  fs.stat(paths.archivedSites + '/' + url, (err, stats) => callback(Boolean(stats)));
};

exports.downloadUrls = function(urlArray) {
  var download = function(url, exists) {
    if (!exists) {
      var req = http.request('http://' + url, function(res) {
        var html = '';
        res.on('data', chunk => html += chunk);
        res.on('end', () => fs.writeFile(paths.archivedSites + '/' + url, html.toString(), err => {}));
      });
      req.end();
    }
  };  
  urlArray.forEach( url => isUrlArchived(url, download.bind(null, url)));
};

exports.addIfNotInList = function(url, exists) {
  if (!exists) {
    addUrlToList(url);
  }
};
