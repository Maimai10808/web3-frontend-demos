import path from "node:path";
import { exportDeploymentArtifacts } from "./exportDeploymentArtifacts";

async function main() {
  const foundryRoot = process.cwd();

  const sourceMetaPath = path.resolve(
    foundryRoot,
    "generated/deployment.meta.json",
  );

  const frontendGeneratedDir = path.resolve(
    foundryRoot,
    "../siwe-eip712-demo/src/generated",
  );

  const frontendMetaPath = path.resolve(
    frontendGeneratedDir,
    "deployment.meta.json",
  );

  const frontendContractsPath = path.resolve(
    frontendGeneratedDir,
    "contracts.ts",
  );

  const result = await exportDeploymentArtifacts({
    rootDir: foundryRoot,
    metaPath: sourceMetaPath,
    outputPath: frontendContractsPath,
    normalizedMetaPath: frontendMetaPath,
    writeNormalizedMeta: true,
    outDir: "out",
  });

  console.log("Exported deployment artifacts:");
  console.log("Source Meta:", sourceMetaPath);
  console.log("Output Meta:", frontendMetaPath);
  console.log("Output Contracts:", result.outputPath);
  console.log("Contracts:", result.contractNames.join(", "));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
