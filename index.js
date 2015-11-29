'use strict';

var fs = require('fs');
var path = require('path');

var parse = require('./lib/parse');
var dataByTime = require('./lib/dataByTime');

function doIt (file, opts, cb) {
  opts = opts || {};

  parse(file, (err, data) => {
    if (opts.reporters) {
      let d = dataByTime(data.streams, opts.interval || 5);
      data.reports = {};

      opts.reporters.forEach((r) => {
        data.reports[r] = require('./reporters/' + r)(d);
      });
    }

    cb(null, data);
  });
};

module.exports = doIt;
