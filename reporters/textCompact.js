'use strict';

module.exports = function (dataByTime) {
  return require('./text')(dataByTime, true);
};
