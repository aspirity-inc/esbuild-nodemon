const nodemon = require("nodemon");

function startNodemon(options, outputFilePath) {
  const mon = nodemon({
    signal: "SIGTERM",
    ...options,
    script: outputFilePath,
    watch: outputFilePath,
    nodeArgs: getNodeArgs(options),
    ignoreRoot: [],
  });

  mon.on("log", ({ colour }) => {
    console.log(colour);
  });
  return mon;
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
