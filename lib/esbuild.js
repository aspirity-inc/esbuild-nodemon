const esbuild = require("esbuild");
const { setTimeout } = require("timers/promises");
const { loadPackageJsonSync } = require("./load-package-json");

async function startBuild(entryPoint, outputFilePath) {
  console.log("[esbuild]", "Starting build", { entryPoint });

  const result = await esbuild.build({
    bundle: true,
    sourcemap: true,
    platform: "node",
    watch: true,
    outfile: outputFilePath,
    entryPoints: [entryPoint],
    external: getDependencies(),
    logLevel: "debug",
  });

  return async () => {
    // calling stop too soon leads to uncatchable exception
    await setTimeout(100);
    result.stop();
  };
}

function getDependencies() {
  const { dependencies, devDependencies } = loadPackageJsonSync();
  const names = [
    ...Object.keys(dependencies ?? {}),
    ...Object.keys(devDependencies ?? {}),
  ];
  return names;
}

module.exports = { startBuild };
