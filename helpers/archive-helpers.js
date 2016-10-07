var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');
var Promise = require('bluebird');

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

var readListOfUrls = exports.readListOfUrls = function() {
  var promise = new Promise( function(resolve, reject) {
    fs.readFile(paths.list, (err, data) => {
      var urls = (data.toString() === '') ? [] : data.toString().split('\n');
      resolve(urls);
    });
  });
  return promise;
};

var isUrlInList = exports.isUrlInList = function(url, list) {
  return list.indexOf(url) > -1;
};

var addUrlToList = exports.addUrlToList = function(url) {
  readListOfUrls().then(function(urls) {
    if (!isUrlInList(url, urls)) {
      urls.push(url);
      fs.writeFile(paths.list, urls.join('\n'), err => {});
    }
  });
};

var isUrlArchived = exports.isUrlArchived = function(url) {
  var promise = new Promise(function(resolve, reject) {
    fs.stat(paths.archivedSites + '/' + url, (err, stats) => resolve(Boolean(stats)));
  });
  return promise;
};

exports.downloadUrls = function() {
  var download = function(url) {
    var req = http.request('http://' + url, function(res) {
      var html = '';
      res.on('data', chunk => html += chunk);
      res.on('end', () => fs.writeFile(paths.archivedSites + '/' + url, html.toString(), err => {}));
    });
    req.end();
  };  
  readListOfUrls().then( urls => {
    urls.forEach( url => {
      isUrlArchived(url).then(exists => {
        exists || download(url);
      });
    });
  });
};