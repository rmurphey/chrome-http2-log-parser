'use strict';

var fs = require('fs');
var str = fs.readFileSync(require.resolve('./templates/html.jade'), 'utf-8');
var tmpl = require('jade').compile(str);
var markers = require('../lib/markers');

module.exports = function (dataByTime) {
  return tmpl({
    data: dataByTime,
    markers: markers
  });
};
