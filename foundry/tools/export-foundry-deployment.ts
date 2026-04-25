import fs from "node:fs/promises";
import path from "node:path";
import { exportDeploymentArtifacts } from "./exportDeploymentArtifacts";

async function main() {
  const foundryRoot = process.cwd();

  const sourceMetaPath = path.resolve(
    foundryRoot,
    "generated/deployment.meta.json",
  );

  const targetGeneratedDir = path.resolve(foundryRoot, "../generated");

  const targetMetaPath = path.resolve(
    targetGeneratedDir,
    "deployment.meta.json",
  );

  const targetContractsPath = path.resolve(targetGeneratedDir, "contracts.ts");

  const result = await exportDeploymentArtifacts({
    rootDir: foundryRoot,
    metaPath: sourceMetaPath,
    outputPath: targetContractsPath,
    outDir: "out",
  });

  await fs.mkdir(targetGeneratedDir, { recursive: true });
  await fs.copyFile(sourceMetaPath, targetMetaPath);

  console.log("Exported deployment artifacts:");
  console.log("Source Meta:", sourceMetaPath);
  console.log("Output Meta:", targetMetaPath);
  console.log("Output Contracts:", result.outputPath);
  console.log("Contracts:", result.contractNames.join(", "));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
