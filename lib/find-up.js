const { statSync } = require("fs");
const { resolve: resolvePath, parse: parsePath, dirname } = require("path");

const typeMapper = {
  file: "isFile",
  f: "isFile",
  d: "isDirectory",
  dir: "isDirectory",
  directory: "isDirectory",
  folder: "isDirectory",
};

function findUpSync(name, type = "file") {
  if (typeMapper[type] === undefined) {
    throw new Error(
      `Unknown type ${type}, expected: ${Object.keys(typeMapper)}`
    );
  }

  let directory = resolvePath("");
  const { root } = parsePath(directory);

  do {
    const pathToCheck = resolvePath(directory, name);
    const stats = statSync(pathToCheck, { throwIfNoEntry: false });
    if (stats != null && stats[typeMapper[type]]()) {
      return pathToCheck;
    }
    directory = dirname(directory);
  } while (directory !== root);

  return undefined;
}

module.exports = {
  findUpSync,
};
