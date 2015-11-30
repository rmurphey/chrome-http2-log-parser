var path = require('path');

var parser = require('../index');

parser(path.resolve(__dirname, './fixtures/session.txt'), {
  reporters: [
    'html'
    // 'text',
    // 'textCompact'
  ],
  // the resolution, in milliseconds, of the report
  interval: 20
}, function (err, data) {
  if (err) {
    throw err;
  }

  // an array of objects representing the records in the log
  // console.log(data.records);

  // an object with an property for each stream id; the value of
  // the property is an array of objects associated with the stream id,
  // in the order in which they appeared in the log
  // console.log(data.streams);

  // the output of the text reporter
  // console.log(data.reporters.text);

  // the output of the textCompact reporter
  console.log(data.reports.html);
});
