#!/usr/bin/env node
const { resolve: resolvePath, relative } = require("path");
const { parse: nodemonParse } = require("nodemon/lib/cli");
const { getRootBuildDirectory } = require("../lib/get-root-build-directory");
const { rmdirSync } = require("../lib/rm");
const { startBuild } = require("../lib/esbuild");
const { startNodemon } = require("../lib/nodemon");

const outFilename = "output.js";
const buildDir = resolvePath(getRootBuildDirectory(), `_${getPathDate()}`);
const outputFilePath = resolvePath(buildDir, outFilename);

async function shutdown(signal, stopBuild, stopMon) {
  console.log("[esbuild-nodemon]", "Graceful shutdown", { signal });
  await stopBuild();
  await stopMon();
  const relPath = relative(process.cwd(), buildDir);
  console.log("[esbuild-nodemon]", "Removing build directory", {
    path: relPath,
  });
  rmdirSync(buildDir, { recursive: true });
}

async function run() {
  console.log("[esbuild-nodemon]", { pid: process.pid });
  /** @type { nodemon.Settings } */
  const nodemonOptions = nodemonParse(process.argv);
  const stopBuild = await startBuild(nodemonOptions.script, outputFilePath);
  const stopMon = startNodemon(nodemonOptions, outputFilePath);

  process.on("SIGINT", (signal) => shutdown(signal, stopBuild, stopMon));
  process.on("SIGTERM", (signal) => shutdown(signal, stopBuild, stopMon));
}

run();

function getPathDate() {
  return new Date().toISOString().replace(/\:/g, "-");
}
