'use strict';

var fs = require('fs');
var str = fs.readFileSync(require.resolve('./templates/html.jade'), 'utf-8');
var tmpl = require('jade').compile(str);

module.exports = function (dataByTime) {
  return tmpl({
    data: dataByTime,
    markers: {
      HTTP2_SESSION_SEND_HEADERS : 'S',
      HTTP2_SESSION_RECV_HEADERS : 'R',
      HTTP2_SESSION_RECV_DATA : 'D',
      HTTP2_SESSION_RECV_PUSH_PROMISE : 'P',
      HTTP2_STREAM_ADOPTED_PUSH_STREAM : 'A',
      FIN : 'F',
      OTHER : '*'
    }


  });
};
