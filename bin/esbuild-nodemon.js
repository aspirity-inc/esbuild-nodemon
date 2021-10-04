#!/usr/bin/env node
const { tmpdir } = require("os");
const { join: pathJoin } = require("path");
const { rmdirSync } = require("fs");
const esbuild = require("esbuild");
const nodemon = require("nodemon");
const { parse: nodemonParse } = require("nodemon/lib/cli");

const outFilename = "output.js";
const buildDir = pathJoin(tmpdir(), "esbuild-nodemon", `_${getPathDate()}`);
const outputFilePath = pathJoin(buildDir, outFilename);

console.log({ outputFilePath });

/** @type { nodemon.Settings } */
const nodemonOptions = nodemonParse(process.argv);

process.on("SIGINT", () => {
  console.log(`Removing ${buildDir}`);
  rmdirSync(buildDir, { recursive: true });
  process.exit(0);
});

esbuild
  .build({
    bundle: true,
    sourcemap: true,
    platform: "node",
    watch: { onRebuild },
    outfile: outputFilePath,
    entryPoints: [nodemonOptions.script],
  })
  .then(() => {
    nodemon({
      verbose: true,
      signal: "SIGTERM",
      ...nodemonOptions,
      script: outputFilePath,
      watch: outputFilePath,
      nodeArgs: getNodeArgs(),
    });
  })
  .catch(() => process.exit(1));

function onRebuild() {
  console.log(new Date(), "Rebuild completed.");
}

function getNodeArgs() {
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

function getPathDate() {
  return new Date().toISOString().replace(/\:/g, "-");
}
