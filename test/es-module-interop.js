// This file helps with ES module interoperability
// It's used to run tests in both CommonJS and ESM environments

const path = require('path');

module.exports = {
  require,
  __dirname,
  __filename,
  path
}; 