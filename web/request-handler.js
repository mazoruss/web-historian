var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelper = require('./http-helpers.js');
var fs = require('fs');
// require more modules/folders here!

var headers = httpHelper.headers;

var sendResponse = function(res, data, statusCode) {
  statusCode = statusCode || 200;
  res.writeHead(statusCode, headers);
  res.end(data);
}

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
    fs.readFile(pathName, function(err, data) {
      if (err || !data) {
        sendResponse(res, null, 404);
        return;
      };
      html = data.toString();
      sendResponse(res, html);
    });
  },

  'POST': function(req, res) {
    console.log('POSTING: ' + req.url);
    // var data = '';
    // req.on('data', function(chunk) {
    //   data += chunk;
    // });
    var page = req.url;
    var pathName = archive.paths.archivedSites + page;
    req.on('end', function() {
    // if (fs.stat(pathName).isFile()) {
      
    // }
    //check if this site is in archives/sites/sites.txt
    //if not, add it
    sendResponse(res, '', 201);
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
