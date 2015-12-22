# chrome-http2-log-parser

This repo contains a module for parsing the output of Chrome's HTTP/2
net-internals and turning it into something more useful.

## Installation

```sh
npm install chrome-http2-log-parser
```

### Try it

```sh
node test
```

## Usage

Given a file `session.txt` gathered from `chrome://net-internals/#export` that contains the output of the Chrome
HTTP/2 net-internals log, and given that it is a sibling of the file
`report.js` that contains the following code:

```js
var path = require('path');

var parser = require('chrome-http2-log-parser');

parser(path.resolve(__dirname, './session.txt'), {
  reporters: [
    'html'
  ],
  // the resolution, in milliseconds, of the report
  interval: 20
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

  // the output of the html reporter
  console.log(data.reports.html);
});
```

Run `node report` to see the data parsed from the log.

## Reporters

### html

Generates an HTML table representing the parsed log data.

Screenshot: ![image](https://cloud.githubusercontent.com/assets/39191/11483285/750a4ab0-975c-11e5-99ff-94820d8b5876.png)

## TODO

- Ability to run `chrome-http2-log-parser --file=<filename> --reporter=html --interval=5`
