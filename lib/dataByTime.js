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

module.exports = function (streams, interval) {
  interval = interval || 10;

  let results = {
    streams: {},
    interval: interval
  };

  let streamResults = results.streams;

  Object.keys(streams).forEach((id) => {
    streamResults[id] = {
      path: '',
      events: []
    };

    let time = 0;
    let streamData = sortBy(streams[id], 'st');
    let streamDataIterator = streamData[Symbol.iterator]();
    let item = streamDataIterator.next().value;
    let streamTimeMax = 1 + streamData[ streamData.length - 1].st;

    do {
      if (
        item.e === 'HTTP2_SESSION_SEND_HEADERS' ||
        item.e === 'HTTP2_SESSION_RECV_PUSH_PROMISE'
      ) {
        streamResults[id].path = item.headers[':path'];
      }

      if (+item.st <= time) {
        streamResults[id].events.push(item);

        item = streamDataIterator.next();

        if (item.done) {
          break;
        }

        item = item.value;
      }
      else {
        streamResults[id].events.push(null);
      }

      time = time + interval;
    } while (time <= streamTimeMax)
  });

  return results;
};
