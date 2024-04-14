// @flow
import gqlTag from 'graphql-tag';
import serialize from 'babel-literal-to-ast';
import template from '@babel/template';

/**
 * TODO: Reduce runtime to improve performance
 * ref: https://github.com/gajus/babel-plugin-graphql-tag/blob/35edbae44990bf20be2de7139dc0ce5843f70bff/src/index.js#L25
 */
const uniqueFn = template.ast(`
  (acc, definition) =>
    definition.kind === 'FragmentDefinition' &&
    acc.find(
      curDef =>
        curDef.kind === 'FragmentDefinition' &&
        curDef.name.value === definition.name.value,
    )
      ? acc
      : acc.concat(definition)
`);

/**
 * ref: https://github.com/leoasis/graphql-tag.macro
 */
export default function compileWithFragment(
  referencePath: Object,
  t: Object,
): Object {
  const source = referencePath.parentPath.node.quasi.quasis
    .map(node => node.value.raw)
    .join('');
  const compiled = serialize(gqlTag(source));
  const expressions = referencePath.parentPath.get('quasi').get('expressions');
  if (expressions && expressions.length) {
    const definitionsProperty = compiled.properties.find(
      p => p.key.value === 'definitions',
    );
    const definitionsArray = definitionsProperty.value;
    const concatDefinitions = expressions.map(expression =>
      t.memberExpression(expression.node, t.identifier('definitions')),
    );
    definitionsProperty.value = t.callExpression(
      t.memberExpression(
        t.callExpression(
          t.memberExpression(definitionsArray, t.identifier('concat')),
          concatDefinitions,
        ),
        t.identifier('reduce'),
      ),
      [t.toExpression(uniqueFn), t.arrayExpression([])],
    );
  }

  return compiled;
}
