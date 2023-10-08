"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = expandImports;

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

/**
 * import .graphql file directly
 * ref: https://github.com/apollographql/graphql-tag/blob/master/loader.js
 */
function expandImports(queryPath, processedFiles) {
  if (processedFiles === void 0) {
    processedFiles = new Set();
  }

  var source = _fs.default.readFileSync(queryPath, 'utf8');

  var lines = source.split(/\r\n|\r|\n/);
  var importContent = lines.filter(function (line) {
    return line[0] === '#' && line.slice(1).split(' ')[0] === 'import';
  }).map(function (line) {
    var value = line.slice(1).split(' ')[1].replace(/('|")/g, '');

    var relativeQueryPath = _path.default.join(queryPath, '..', value);

    if (processedFiles.has(relativeQueryPath)) {
      return '';
    }

    processedFiles.add(relativeQueryPath);
    var raw = expandImports(relativeQueryPath, processedFiles);
    return raw;
  }).join('');
  return importContent + source;
}

module.exports = exports.default;