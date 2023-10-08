// @flow
import { createMacro } from 'babel-plugin-macros';
import gqlTag from 'graphql-tag';
import serialize from 'babel-literal-to-ast';
import {
  expandImports,
  compileWithFragment,
  resolveImportPath,
} from './utils/index';
// import printAST from 'ast-pretty-print';
// console.log(printAST(referencePath.parentPath))

function graphqlMacro({
  references,
  state: {
    file: {
      opts: { filename },
    },
  },
  babel: { types: t },
}: {
  references: { gql: Array<any>, loader: Array<any> },
  state: { file: { opts: { filename: string } } },
  babel: { types: Object },
}): void {
  const { gql = [], loader = [] } = references;

  // Case 1: import { gql } from 'graphql.macro'.
  gql.forEach(referencePath => {
    const compiled = compileWithFragment(referencePath, t);
    referencePath.parentPath.replaceWith(compiled);
  });

  // Case 2: import { loader } from 'graphql.macro'
  loader.forEach(referencePath => {
    referencePath.parentPath.node.arguments.forEach(({ value }) => {
      const absolutePath = resolveImportPath({ filename, relativePath: value });
      const expanded = expandImports(absolutePath); // Note: #import feature
      referencePath.parentPath.replaceWith(serialize(gqlTag(expanded)));
    });
  });
}

export default createMacro(graphqlMacro);
