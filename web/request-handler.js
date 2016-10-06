var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelper = require('./http-helpers.js');
var fs = require('fs');
var http = require('http');
// require more modules/folders here!

var headers = httpHelper.headers;

var sendResponse = function(res, data, statusCode) {
  statusCode = statusCode || 200;
  res.writeHead(statusCode, headers);
  res.end(data);
};

var renderPage = function(res, pathName, statusCode) {
  fs.readFile(pathName, function(err, data) {
    if (err || !data) {
      sendResponse(res, null, 404);
      return;
    }
    html = data.toString();
    sendResponse(res, html, statusCode);
  });
};

var actions = {
  'GET': function(req, res) {
    console.log('REQUESTING: ' + req.url);
    var page = req.url;
    var pathName;
    var html = {};
    if (page === '/') {
      pathName = archive.paths.siteAssets + '/index.html';
    } else {
      pathName = archive.paths.archivedSites + page;
    }
    renderPage(res, pathName, 200);
  },

  'POST': function(req, res) {
    console.log('POSTING: ' + req.url);
    var url = '';
    req.on('data', function(chunk) {
      url += chunk;
    });
    req.on('end', function() {
      if (url !== '') {
        url = url.split('url=')[1];
        archive.isUrlInList(url, archive.addIfNotInList.bind(null, url));
      }
      archive.isUrlArchived(url, function(exists) {
        if (!exists) {
          // TODO: Download urls
          archive.readListOfUrls(function() {});
        }
      });
      // TODO: THIS LOGIG
      //if url is archived
        //render page
      //else
        //render loading page
      //TODO: take this out
      renderPage(res, archive.paths.siteAssets + '/index.html', 302);
    });
  },

  'OPTIONS': function(req, res) {
    sendResponse(res, null);
  }
};


exports.handleRequest = function(req, res) {
  var action = actions[req.method];
  if (action) {
    action(req, res);
  } else {
    sendResponse(res, null, 404);
  }
};
