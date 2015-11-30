'use strict';

function sortBy (streamData, field) {
  return streamData.sort(function (a, b) {
    if (+a[field] < +b[field]) {
      return -1;
    }

    if (+a[field] > +b[field]) {
      return 1;
    }

    return 0;
  });
}

function fill (arr, length) {
  let diff = length - arr.length;
  return arr.concat(new Array(diff)).map(item => {
    return item || null;
  });
}

module.exports = function (streams, interval) {
  interval = interval || 10;

  let results = {
    streams: {},
    interval: interval,
    entries: 0
  };

  let streamResults = results.streams;

  Object.keys(streams).forEach((id) => {
    streamResults[id] = {
      path: '',
      events: {}
    };

    let time = 0;
    let streamData = sortBy(streams[id], 'st');
    let streamDataIterator = streamData[Symbol.iterator]();
    let item = streamDataIterator.next().value;
    let streamTimeMax = 1 + streamData[streamData.length - 1].st;

    while (time <= streamTimeMax) {
      let events = streamResults[id].events[time] = streamResults[id].events[time] || [];

      // current item occurs outside of time window;
      // check the next time window
      if ((+item.st - time) > interval) {
        time = time + interval;
        continue;
      }

      // current item occurs within the time window
      if (
        item.e === 'HTTP2_SESSION_SEND_HEADERS' ||
        item.e === 'HTTP2_SESSION_RECV_PUSH_PROMISE'
      ) {
        streamResults[id].path = item.headers[':path'];
      }

      events.push(item);

      item = streamDataIterator.next();

      if (item.done) {
        break;
      }

      item = item.value;
    }
  });

  let maxEvents = 0;

  Object.keys(results.streams).forEach(s => {
    let events = Object.keys(results.streams[s].events);
    if (events.length > maxEvents) {
      maxEvents = events.length
    }
  });

  results.entries = maxEvents;

  return results;
};
