/* @flow */

import colors from 'colors/safe';
import {determineFlowVersion} from './npmProjectUtils';
import {findPackageJsonPath} from './npmProjectUtils';
import {format} from 'util';
import {fs} from './node';
import globAsync from 'glob';
import {getPackageJsonData} from './npmProjectUtils';
import {getPackageJsonDependencies} from './npmProjectUtils';
import {mkdirp} from './fileUtils';
import {path} from './node';
import {signCode} from './codeSign';
import {verifySignedCode} from './codeSign';
import {versionToString} from './semver';

export function glob(pattern: string, options: Object): Promise<Array<string>> {
  return new Promise((resolve, reject) =>
    globAsync(pattern, options, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    })
  );
}

async function resolvePkgDirPath(
  pkgName: string,
  pkgJsonDirPath: string,
): Promise<null | string> {
  let prevNodeModulesDirPath;
  let nodeModulesDirPath = path.resolve(pkgJsonDirPath, 'node_modules');
  while (true) {
    const pkgDirPath = path.resolve(nodeModulesDirPath, pkgName);
    if (await fs.exists(pkgDirPath)) {
      return pkgDirPath;
    }

    prevNodeModulesDirPath = nodeModulesDirPath;
    nodeModulesDirPath = path.resolve(
      nodeModulesDirPath,
      '..',
      '..',
      'node_modules',
    );
    if (prevNodeModulesDirPath === nodeModulesDirPath) {
      break;
    }
  }
  throw new Error(
    'Unable to find `node_modules/' + pkgName + '/` install directory! ' +
    'Did you forget to run `npm install` before running `flow-typed install`?'
  );
}

const moduleStubTemplate = (`
declare module '%s' {
  declare module.exports: any;
}`).trim();
const aliasTemplate = (`
declare module '%s%s' {
  declare module.exports: $Exports<'%s'>;
}`).trim();

function stubFor(moduleName: string, fileExt?: string): string {
  const moduleStub = format(moduleStubTemplate, moduleName);
  if (fileExt !== undefined) {
    const aliasStub = format(aliasTemplate, moduleName, fileExt, moduleName);
    return `${moduleStub}\n${aliasStub}`;
  }
  return moduleStub;
}

async function writeStub(
  projectRoot: string,
  packageName: string,
  packageVersion: string,
  overwrite: boolean,
  files: Array<string>,
): Promise<string> {
  let output = [
    '/**',
    ' * This is an autogenerated libdef stub for:',
    ' *',
    ` *   '${packageName}'`,
    ' *',
    ' * Fill this stub out by replacing all the `any` types.',
    ' *',
    ' * Once filled out, we encourage you to share your work with the ',
    ' * community by sending a pull request to: ',
    ' * https://github.com/flowtype/flow-typed',
    ' */\n\n'
  ].join('\n');

  output += stubFor(packageName);

  if (files.length > 0) {
    output += `

/**
 * We include stubs for each file inside this npm package in case you need to
 * require those files directly. Feel free to delete any files that aren't
 * needed.
 */
`;

    const [fileDecls, aliases] = files.reduce(([fileDecls, aliases], file) => {
      const ext = path.extname(file);
      const name = file.substr(0, file.length - ext.length);
      const moduleName = `${packageName}/${name}`;
      if (name === 'index') {
        aliases.push(format(aliasTemplate, moduleName, '', packageName));
        aliases.push(format(aliasTemplate, moduleName, ext, packageName));
      } else {
        fileDecls.push(format(moduleStubTemplate, moduleName));
        aliases.push(format(aliasTemplate, moduleName, ext, moduleName));
      }
      return [fileDecls, aliases];
    }, [[], []]);

    output += fileDecls.join('\n\n');
    output += '\n\n// Filename aliases\n';
    output += aliases.join('\n');
  }
  output += "\n"; // File should end with a newline
  const filename = path.join(
    projectRoot,
    "flow-typed",
    "npm",
    format("%s_vx.x.x.js", packageName),
  );
  await mkdirp(path.dirname(filename));

  if (!overwrite) {
    const exists = await fs.exists(filename);
    if (exists) {
      const existingStub = await fs.readFile(filename);
      if (!verifySignedCode(existingStub.toString())) {
        throw new Error(
          "Stub already exists and has been modified. " +
          "Use --overwrite to overwrite",
        );
      }
    }
  }

  const flowVersionRaw = await determineFlowVersion(projectRoot);
  const flowVersion =
    flowVersionRaw
    ? `/flow_${versionToString(flowVersionRaw)}`
    : '';
  const stubVersion =
    `<<STUB>>/${packageName}_v${packageVersion}${flowVersion}`;
  await fs.writeFile(filename, signCode(output, stubVersion));
  return filename;
}

export async function pkgHasFlowFiles(
  projectRoot: string,
  packageName: string,
): Promise<boolean> {
  let pathToPackage = await resolvePkgDirPath(
    packageName,
    projectRoot,
  );

  const files = await glob("**/*.flow", {
    cwd: pathToPackage,
    ignore: "node_modules/**",
  });

  return files.length > 0;
};

/**
 * createStub("/path/to/root", "foo") will create a file
 * /path/to/root/flow-typed/npm/foo.js that contains a stub for the module foo.
 *
 * If foo is installed, it will read the directory that require("foo") resolves
 * to and include definitions for "foo/FILE", for every FILE in the foo package
 */
export async function createStub(
  projectRoot: string,
  packageName: string,
  explicitVersion: string | null,
  overwrite: boolean,
): Promise<boolean> {
  let files = [];
  let resolutionError = null;
  let pathToPackage = null;
  let version = explicitVersion || null;
  try {
    pathToPackage = await resolvePkgDirPath(
      packageName,
      process.cwd(),
    );

    files = await glob("**/*.{js,jsx}", {
      cwd: pathToPackage,
      ignore: "node_modules/**",
    });
  } catch (e) {
    resolutionError = e;
  }

  // Try to deduce a version if one isn't provided
  if (version == null) {
    // Look at the package.json for the installed module
    if (pathToPackage != null) {
      try {
        version = (require: any)(path.join(pathToPackage, 'package.json')).version;
      } catch (e) {}
    }
  }

  // If that failed, try looking for a package.json in the root
  if (version == null) {
    try {
      const pkgJsonPathStr = await findPackageJsonPath(projectRoot);
      const pkgJsonData = await getPackageJsonData(pkgJsonPathStr);
      const rootDependencies = await getPackageJsonDependencies(pkgJsonData);
      version = rootDependencies[packageName] || null;
    } catch (e) { }
  }

  try {
    if (version === null) {
      throw new Error(
        "Could not deduce version from node_modules or package.json. " +
        "Please provide an explicit version",
      );
    }
    const filename = await writeStub(
      projectRoot,
      packageName,
      version,
      overwrite,
      files,
    );
    const terseFilename = path.relative(projectRoot, filename);
    console.log(
      colors.bold(
        "  ??? %s@%s\n" +
        "    ???> %s"
      ),
      packageName,
      version,
      colors.red(terseFilename),
    );
    if (resolutionError) {
      console.log(
        colors.yellow(
          "\t  Unable to stub all files in '%s', " +
          "so only created a stub for the main module (%s)"
        ),
        packageName,
        resolutionError.message,
      );
    }
    return true;
  } catch (e) {
    console.log(
      colors.red("???\t%s%s': %s"),
      packageName,
      version ? "@"+version : "",
      e.message,
    );
    return false;
  }
};
