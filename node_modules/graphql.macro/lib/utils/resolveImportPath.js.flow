// @flow
import path from 'path';
import fs from 'fs';

const CMD = fs.realpathSync(process.cwd());

const jsconfigPath = path.resolve(CMD, 'jsconfig.json');
let jsconfigInclude;
if (fs.existsSync(jsconfigPath)) {
  const jsconfig = JSON.parse(fs.readFileSync(jsconfigPath, 'utf8'));
  jsconfigInclude = jsconfig.include ? jsconfig.include[0] : null;
}

const resolveImportPath = ({
  filename,
  relativePath,
}: {
  filename: string,
  relativePath: string,
}): string => {
  if (relativePath.startsWith('.')) {
    return path.join(filename, '..', relativePath);
  }

  const resolvedPath = path.resolve(
    CMD,
    jsconfigInclude || process.env.NODE_PATH || '.',
    relativePath,
  );
  if (fs.existsSync(resolvedPath)) {
    return resolvedPath;
  }

  // Note: Try to resolve from node_modules if the file does not exist. PR#39
  return path.resolve(CMD, 'node_modules', relativePath);
};

export default resolveImportPath;
