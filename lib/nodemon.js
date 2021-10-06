const nodemon = require("nodemon");

function startNodemon(options, outputFilePath) {
  nodemon({
    signal: "SIGTERM",
    ...options,
    script: outputFilePath,
    watch: outputFilePath,
    nodeArgs: getNodeArgs(options),
    ignoreRoot: [],
  });

  nodemon.on("log", ({ colour }) => {
    console.log(colour);
  });

  // https://github.com/remy/nodemon/issues/1928
  nodemon.once("quit", () => nodemon.reset());

  return () =>
    new Promise((resolve, reject) => {
      nodemon.once("exit", () => resolve());
      nodemon.emit("quit");
    });
}

function getNodeArgs(nodemonOptions) {
  const ENABLE_SOURCE_MAPS = "--enable-source-maps";
  const fromOptions = nodemonOptions.nodeArgs;
  if (fromOptions == null || fromOptions.length === 0) {
    return [ENABLE_SOURCE_MAPS];
  }
  if (fromOptions.includes(ENABLE_SOURCE_MAPS)) {
    return fromOptions;
  }
  return [ENABLE_SOURCE_MAPS, ...fromOptions];
}

module.exports = { startNodemon };
