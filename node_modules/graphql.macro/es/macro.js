import { createMacro } from 'babel-plugin-macros';
import gqlTag from 'graphql-tag';
import serialize from 'babel-literal-to-ast';
import { expandImports, compileWithFragment, resolveImportPath } from './utils/index'; // import printAST from 'ast-pretty-print';
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
    var compiled = compileWithFragment(referencePath, t);
    referencePath.parentPath.replaceWith(compiled);
  }); // Case 2: import { loader } from 'graphql.macro'

  loader.forEach(function (referencePath) {
    referencePath.parentPath.node.arguments.forEach(function (_ref2) {
      var value = _ref2.value;
      var absolutePath = resolveImportPath({
        filename: filename,
        relativePath: value
      });
      var expanded = expandImports(absolutePath); // Note: #import feature

      referencePath.parentPath.replaceWith(serialize(gqlTag(expanded)));
    });
  });
}

export default createMacro(graphqlMacro);