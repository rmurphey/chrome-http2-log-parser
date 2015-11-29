# chrome-http2-log-parser

This repo contains a module for parsing the output of Chrome's HTTP/2
net-internals and turning it into something more useful.

## Installation

```sh
npm install chrome-http2-log-parser
```

## Usage

Given a file `session.txt` that contains the output of the Chrome 
HTTP/2 net-internals log, and given that it is a sibling of the file 
`report.js` that contains the following code:

```js
var path = require('path');

var parser = require('chrome-http2-log-parser');

parser(path.resolve(__dirname, './session.txt'), {
  reporters: [
    'text',
    'textCompact'
  ],
  // the resolution, in milliseconds, of the report
  interval: 5
}, function (err, data) {
  if (err) {
    throw err;
  }

  // an array of objects representing the records in the log
  console.log(data.records);

  // an object with an property for each stream id; the value of
  // the property is an array of objects associated with the stream id,
  // in the order in which they appeared in the log
  console.log(data.streams);

  // the output of the text reporter
  console.log(data.reporters.text);

  // the output of the textCompact reporter
  console.log(data.reporters.textCompact);
});
```

Run `node report` to see the data parsed from the log.

## Reporters

### text

Generates a text table showing the beginning of each record for
each stream; includes the path for each stream, as well as a key.

Example output:

```
===
S: HTTP2_SESSION_SEND_HEADERS
R: HTTP2_SESSION_RECV_HEADERS
D: HTTP2_SESSION_RECV_DATA
P: HTTP2_SESSION_RECV_PUSH_PROMISE
A: HTTP2_STREAM_ADOPTED_PUSH_STREAM
*: OTHER
===
INTERVAL: 5ms
===
STREAM 0:
             *
STREAM 1: /index-separate.html?push=/common/libs/combined.js
S            R                     D         D
STREAM 2: /common/libs/combined.js
             PDR       DDDD       DDDDDD   DDDDDD                                  A
STREAM 3: /common/libs/jquery.min.js?z=0
                                      S          DRDDDDDDDDDDDD
STREAM 5: /common/libs/jquery.min.js?z=1
                                        S             R  DDDDDDDDDD                              DDDD          D
STREAM 7: /common/libs/jquery.min.js?z=2
                                        S               R     DDDDDDDD                           DDD           D
STREAM 9: /common/libs/jquery.min.js?z=3
                                        S               R        DDDDDDDD                        DDD           D
STREAM 11: /common/libs/jquery.min.js?z=4
                                        S                R         DDDDDD  DD                    DDD           D
STREAM 13: /common/libs/jquery.min.js?z=5
                                        S                R                  DDDDDDDD              DDDD         D
STREAM 15: /common/libs/jquery.min.js?z=6
                                        S                R                     DDDDDDDD            DDD         D
STREAM 17: /common/libs/jquery.min.js?z=7
                                        S                R                       DDDDDDDD          DDD         D
STREAM 19: /common/libs/jquery.min.js?z=8
                                        S                R                         DDDDD       DDDDDDDD        D
STREAM 21: /common/libs/jquery.min.js?z=9
                                        S                R                                     DDDDDDDDDDDDDD  DD
```

### textCompact

Generates a compact text table showing the beginning of each record for
each stream.

Example output:

```
0:	             *
1:	S            R                     D         D
2:	             PDR       DDDD       DDDDDD   DDDDDD                                  A
3:	                                      S          DRDDDDDDDDDDDD
5:	                                        S             R  DDDDDDDDDD                              DDDD          D
7:	                                        S               R     DDDDDDDD                           DDD           D
9:	                                        S               R        DDDDDDDD                        DDD           D
11:	                                        S                R         DDDDDD  DD                    DDD           D
13:	                                        S                R                  DDDDDDDD              DDDD         D
15:	                                        S                R                     DDDDDDDD            DDD         D
17:	                                        S                R                       DDDDDDDD          DDD         D
19:	                                        S                R                         DDDDD       DDDDDDDD        D
21:	                                        S                R                                     DDDDDDDDDDDDDD  DD
```

## TODO

- HTML reporter
