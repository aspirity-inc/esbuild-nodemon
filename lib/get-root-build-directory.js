const { tmpdir } = require("os");
const { resolve: resolvePath, dirname } = require("path");
const { findUpSync } = require("./find-up");

function getRootBuildDirectory() {
  const packageJsonPath = findUpSync("package.json", "file");
  const root =
    packageJsonPath === undefined
      ? tmpdir()
      : resolvePath(dirname(packageJsonPath), "node_modules");

  return resolvePath(root, ".esbuild-nodemon-builds");
}

module.exports = {
  getRootBuildDirectory,
};
