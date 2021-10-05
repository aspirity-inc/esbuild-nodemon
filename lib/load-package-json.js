const { readFileSync } = require("fs");
const { findUpSync } = require("./find-up");

function loadPackageJsonSync() {
  const packageJsonPath = findUpSync("package.json", "file");
  if (packageJsonPath === undefined) {
    return {};
  }
  const packageJsonContent = readFileSync(packageJsonPath, "utf-8");
  return JSON.parse(packageJsonContent);
}

module.exports = {
  loadPackageJsonSync,
};
