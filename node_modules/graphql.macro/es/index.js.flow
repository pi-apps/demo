// @flow
/* eslint no-unused-vars: 0 */
import { type DocumentNode } from 'graphql/language/ast';

export * from './utils/index';
export { default } from './macro';

/**
 * Note: This is a workaround for flow type to work.
 * The exposed functions are not been used in macro library.
 */
export type TemplateStringsArray = $ReadOnlyArray<string>;
export const loader = (filePath: string): DocumentNode => ({}: DocumentNode);
export const gql = (
  taggedTemplateLiteral: TemplateStringsArray,
  ...nodes: DocumentNode[]
): DocumentNode => ({}: DocumentNode);
