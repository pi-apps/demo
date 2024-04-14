import gqlTag from 'graphql-tag';
import serialize from 'babel-literal-to-ast';
import template from '@babel/template';
/**
 * TODO: Reduce runtime to improve performance
 * ref: https://github.com/gajus/babel-plugin-graphql-tag/blob/35edbae44990bf20be2de7139dc0ce5843f70bff/src/index.js#L25
 */

var uniqueFn = template.ast("\n  (acc, definition) =>\n    definition.kind === 'FragmentDefinition' &&\n    acc.find(\n      curDef =>\n        curDef.kind === 'FragmentDefinition' &&\n        curDef.name.value === definition.name.value,\n    )\n      ? acc\n      : acc.concat(definition)\n");
/**
 * ref: https://github.com/leoasis/graphql-tag.macro
 */

export default function compileWithFragment(referencePath, t) {
  var source = referencePath.parentPath.node.quasi.quasis.map(function (node) {
    return node.value.raw;
  }).join('');
  var compiled = serialize(gqlTag(source));
  var expressions = referencePath.parentPath.get('quasi').get('expressions');

  if (expressions && expressions.length) {
    var definitionsProperty = compiled.properties.find(function (p) {
      return p.key.value === 'definitions';
    });
    var definitionsArray = definitionsProperty.value;
    var concatDefinitions = expressions.map(function (expression) {
      return t.memberExpression(expression.node, t.identifier('definitions'));
    });
    definitionsProperty.value = t.callExpression(t.memberExpression(t.callExpression(t.memberExpression(definitionsArray, t.identifier('concat')), concatDefinitions), t.identifier('reduce')), [t.toExpression(uniqueFn), t.arrayExpression([])]);
  }

  return compiled;
}