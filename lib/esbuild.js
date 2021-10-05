const esbuild = require("esbuild");
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

  return {
    stop() {
      setTimeout(() => {
        result.stop();
      }, 1000).unref();
    },
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
