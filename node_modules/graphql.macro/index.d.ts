import { DocumentNode } from 'graphql';

export function loader(path: string): DocumentNode;
export function gql(taggedTemplateLiteral: TemplateStringsArray, ...nodes: DocumentNode[]): DocumentNode;
