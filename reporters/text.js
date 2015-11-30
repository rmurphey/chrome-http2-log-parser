'use strict';

var markers = {
  HTTP2_SESSION_SEND_HEADERS : 'S',
  HTTP2_SESSION_RECV_HEADERS : 'R',
  HTTP2_SESSION_RECV_DATA : 'D',
  HTTP2_SESSION_RECV_PUSH_PROMISE : 'P',
  HTTP2_STREAM_ADOPTED_PUSH_STREAM : 'A',
  FIN : 'F',
  OTHER : '*'
};

module.exports = function (dataByTime, compact) {
  var txt = [];

  if (!compact) {
    txt.push('===');

    Object.keys(markers).forEach(k => {
      txt.push(`${markers[k]}: ${k}`);
    });

    txt.push(`INTERVAL: ${dataByTime.interval}ms`);
    txt.push('===');
  }

  Object.keys(dataByTime.streams).forEach((streamId) => {
    let stream = dataByTime.streams[streamId];
    if (!compact) {
      txt.push(`STREAM ${streamId}: ${stream.path}`);
    }

    let events = stream.events.map((item) => {
      if (!item) {
        return ' ';
      }

      return markers[item.e] || markers.OTHER;
    });

    if (compact) {
      txt.push([`${streamId}:\t`].concat(events).join(''));
    }
    else {
      txt.push(events.join(''));
    }
  });

  return txt.join('\n');
};
