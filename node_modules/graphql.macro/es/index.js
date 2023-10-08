/* eslint no-unused-vars: 0 */
export * from './utils/index';
export { default } from './macro';
/**
 * Note: This is a workaround for flow type to work.
 * The exposed functions are not been used in macro library.
 */

export var loader = function loader(filePath) {
  return {};
};
export var gql = function gql(taggedTemplateLiteral) {
  return {};
};