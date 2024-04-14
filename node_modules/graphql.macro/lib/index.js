"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
var _exportNames = {
  loader: true,
  gql: true
};
exports.gql = exports.loader = exports.default = void 0;

var _index = require("./utils/index");

Object.keys(_index).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  exports[key] = _index[key];
});

var _macro = _interopRequireDefault(require("./macro"));

exports.default = _macro.default;

/* eslint no-unused-vars: 0 */
var loader = function loader(filePath) {
  return {};
};

exports.loader = loader;

var gql = function gql(taggedTemplateLiteral) {
  return {};
};

exports.gql = gql;