const fs = require("fs");

/**
 *
 * @param {fs.PathLike} path
 * @param {fs.RmDirOptions} options
 * @returns
 */
function rmdirSync(path, options) {
  if (typeof fs.rmSync === "function") {
    fs.rmSync(path, { ...options, force: true });
  } else if (fs.existsSync(path)) {
    fs.rmdirSync(path, options);
  }
}

module.exports = { rmdirSync };
