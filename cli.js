#!/usr/bin/env node
'use strict';

var meow = require('meow');
var parser = require('./index');

var cli = meow({
	help: [
		'Usage',
		'  $ chrome-http2-log-parser',
		'',
		'Options',
		'  -f, --file  file path containing the output of Chrome HTTP/2 net-internals log',
		'  --reporter  html, generate a html table representing the parsed log data',
		'  --interval  the resolution in milliseconds of the report',
		'',
		'Examples',
		'  $ chrome-http2-log-parser --file=./test/fixtures/session.txt --reporter=html --interval=5'
	]
});

var flags = cli.flags;

parser(flags.f || flags.file, {
  reporters:  [flags.reporter],
  interval: flags.interval
}, function (err, data) {
  if (err) {
    throw err;
  }

  console.log(data.reports[flags.reporter]);
});
