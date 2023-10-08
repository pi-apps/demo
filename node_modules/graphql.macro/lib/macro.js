"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _babelPluginMacros = require("babel-plugin-macros");

var _graphqlTag = _interopRequireDefault(require("graphql-tag"));

var _babelLiteralToAst = _interopRequireDefault(require("babel-literal-to-ast"));

var _index = require("./utils/index");

// import printAST from 'ast-pretty-print';
// console.log(printAST(referencePath.parentPath))
function graphqlMacro(_ref) {
  var references = _ref.references,
      filename = _ref.state.file.opts.filename,
      t = _ref.babel.types;
  var _references$gql = references.gql,
      gql = _references$gql === void 0 ? [] : _references$gql,
      _references$loader = references.loader,
      loader = _references$loader === void 0 ? [] : _references$loader; // Case 1: import { gql } from 'graphql.macro'.

  gql.forEach(function (referencePath) {
    var compiled = (0, _index.compileWithFragment)(referencePath, t);
    referencePath.parentPath.replaceWith(compiled);
  }); // Case 2: import { loader } from 'graphql.macro'

  loader.forEach(function (referencePath) {
    referencePath.parentPath.node.arguments.forEach(function (_ref2) {
      var value = _ref2.value;
      var absolutePath = (0, _index.resolveImportPath)({
        filename: filename,
        relativePath: value
      });
      var expanded = (0, _index.expandImports)(absolutePath); // Note: #import feature

      referencePath.parentPath.replaceWith((0, _babelLiteralToAst.default)((0, _graphqlTag.default)(expanded)));
    });
  });
}

var _default = (0, _babelPluginMacros.createMacro)(graphqlMacro);

exports.default = _default;
module.exports = exports.default;