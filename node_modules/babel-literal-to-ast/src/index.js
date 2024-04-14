import * as t from '@babel/types';
import * as babylon from '@babel/parser';
import traverse from '@babel/traverse';

export default function astify(literal) {
  if (literal === null) {
    return t.nullLiteral();
  }
  switch (typeof literal) {
  case 'function':
    const ast = babylon.parse(literal.toString(), {
      allowReturnOutsideFunction: true,
      allowSuperOutsideMethod: true,
    });
    return traverse.removeProperties(ast);
  case 'number':
    return t.numericLiteral(literal);
  case 'string':
    return t.stringLiteral(literal);
  case 'boolean':
    return t.booleanLiteral(literal);
  case 'undefined':
    return t.unaryExpression('void', t.numericLiteral(0), true);
  default:
    if (Array.isArray(literal)) {
      return t.arrayExpression(literal.map(astify));
    }
    return t.objectExpression(Object.keys(literal)
      .filter((k) => {
        return typeof literal[k] !== 'undefined';
      })
      .map((k) => {
        return t.objectProperty(
          t.stringLiteral(k),
          astify(literal[k])
        );
      }));
  }
}
