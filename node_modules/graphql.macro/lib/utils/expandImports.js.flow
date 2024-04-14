// @flow
import path from 'path';
import fs from 'fs';

/**
 * import .graphql file directly
 * ref: https://github.com/apollographql/graphql-tag/blob/master/loader.js
 */
export default function expandImports(
  queryPath: string,
  processedFiles: Set<string> = new Set(),
): string {
  const source = fs.readFileSync(queryPath, 'utf8');
  const lines = source.split(/\r\n|\r|\n/);
  const importContent = lines
    .filter(line => line[0] === '#' && line.slice(1).split(' ')[0] === 'import')
    .map(line => {
      const value = line
        .slice(1)
        .split(' ')[1]
        .replace(/('|")/g, '');
      const relativeQueryPath = path.join(queryPath, '..', value);

      if (processedFiles.has(relativeQueryPath)) {
        return '';
      }

      processedFiles.add(relativeQueryPath);
      const raw = expandImports(relativeQueryPath, processedFiles);

      return raw;
    })
    .join('');

  return importContent + source;
}
