'use strict';

var fs = require('fs');
var path = require('path');
var readline = require('readline');

var RECORD_START = /^t=\s+(\d+)\s\[st=\s+(\d+)\]\s+(.+)$/;
var RECORD_KEY_VALUE = /^\s+-->\s(\S+)\s=\s\"?([^\"]+)\"?/;
var RECORD_HEADERS = /^\s+(--> )?(:?[^:]+):\s(.+)$/;

var records = [];
var currentRecord;

function parse (logfile, cb) {
  let input = readline.createInterface({
    input: fs.createReadStream(logfile, {
      encoding: 'utf-8'
    })
  });

  input.on('line', data => {
    let recordStartMatch = data.match(RECORD_START);

    if (recordStartMatch) {
      if (currentRecord) {
        records.push(currentRecord);
      }

      currentRecord = {
        t : recordStartMatch[1],
        st : recordStartMatch[2],
        e : recordStartMatch[3]
      };

      return;
    }

    let recordKeyValueMatch = data.match(RECORD_KEY_VALUE);

    if (recordKeyValueMatch) {
      currentRecord[recordKeyValueMatch[1]] = recordKeyValueMatch[2];
      return;
    }

    let recordHeadersMatch = data.match(RECORD_HEADERS);

    if (recordHeadersMatch) {
      currentRecord.headers = currentRecord.headers || {};
      currentRecord.headers[recordHeadersMatch[2]] = recordHeadersMatch[3];
      return;
    }

    cb(new Error(`Could not parse ${data}`));
  });

  input.on('close', () => {
    let data = {
      records: records,
      streams: {}
    };

    records.forEach(r => {
      let streamId = r.stream_id || r.promised_stream_id;

      if (streamId) {
        data.streams[streamId] = data.streams[streamId] || [];
        data.streams[streamId].push(r);
      }
    });

    cb(null, data);
  });
}

module.exports = parse;
