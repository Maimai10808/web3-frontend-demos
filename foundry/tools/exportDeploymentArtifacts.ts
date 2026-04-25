import fs from "node:fs/promises";
import path from "node:path";

export type DeploymentContractMeta = {
  artifactName: string;
  address: string;
};

export type DeploymentMeta = {
  deploymentId: string;
  chainId: number;
  networkName: string;
  contracts: Record<string, DeploymentContractMeta>;
};

export type ExportDeploymentArtifactsOptions = {
  /**
   * Foundry 项目根目录。
   * 一般传 process.cwd()
   */
  rootDir: string;

  /**
   * Foundry 编译产物目录。
   * 默认是 rootDir/out
   */
  outDir?: string;

  /**
   * deployment.meta.json 路径。
   * 默认是 rootDir/generated/deployment.meta.json
   */
  metaPath?: string;

  /**
   * contracts.ts 输出路径。
   * 默认是 rootDir/generated/contracts.ts
   */
  outputPath?: string;

  /**
   * 是否额外输出部署元数据 json。
   * 一般 deployment.meta.json 已经由 Solidity script 写好了，所以默认 false。
   */
  writeNormalizedMeta?: boolean;

  /**
   * normalized meta 输出路径。
   * 默认是 rootDir/generated/deployment.normalized.json
   */
  normalizedMetaPath?: string;
};

type FoundryArtifact = {
  abi: unknown;
};

function toConstExport(name: string, value: unknown) {
  return `export const ${name} = ${JSON.stringify(value, null, 2)} as const;`;
}

function normalizeAddressExportName(exportName: string) {
  return `${exportName}Address`;
}

function normalizeAbiExportName(exportName: string) {
  return `${exportName}Abi`;
}

async function readJson<T>(filePath: string): Promise<T> {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw) as T;
}

async function fileExists(filePath: string) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function resolveFoundryArtifactPath(params: {
  outDir: string;
  artifactName: string;
}) {
  const directPath = path.join(
    params.outDir,
    `${params.artifactName}.sol`,
    `${params.artifactName}.json`,
  );

  if (await fileExists(directPath)) {
    return directPath;
  }

  /**
   * 兜底逻辑：
   * 有些情况下合约文件名和合约名不完全一致。
   * 比如 artifactName 是 DemoERC20，但文件可能在 out/Tokens.sol/DemoERC20.json。
   * 所以这里递归扫描 out 目录找 `${artifactName}.json`。
   */
  const candidates: string[] = [];

  async function walk(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        await walk(fullPath);
        continue;
      }

      if (entry.isFile() && entry.name === `${params.artifactName}.json`) {
        candidates.push(fullPath);
      }
    }
  }

  await walk(params.outDir);

  if (candidates.length === 0) {
    throw new Error(
      `Artifact not found for contract "${params.artifactName}". Expected: ${directPath}`,
    );
  }

  if (candidates.length > 1) {
    throw new Error(
      [
        `Multiple artifacts found for contract "${params.artifactName}".`,
        "Please make artifactName unique or pass a more specific export config.",
        ...candidates.map((item) => `- ${item}`),
      ].join("\n"),
    );
  }

  return candidates[0];
}

export async function exportDeploymentArtifacts(
  options: ExportDeploymentArtifactsOptions,
) {
  const rootDir = path.resolve(options.rootDir);

  const generatedDir = path.resolve(rootDir, "generated");

  const outDir = options.outDir
    ? path.resolve(rootDir, options.outDir)
    : path.resolve(rootDir, "out");

  const metaPath = options.metaPath
    ? path.resolve(rootDir, options.metaPath)
    : path.resolve(generatedDir, "deployment.meta.json");

  const outputPath = options.outputPath
    ? path.resolve(rootDir, options.outputPath)
    : path.resolve(generatedDir, "contracts.ts");

  const normalizedMetaPath = options.normalizedMetaPath
    ? path.resolve(rootDir, options.normalizedMetaPath)
    : path.resolve(generatedDir, "deployment.normalized.json");

  const meta = await readJson<DeploymentMeta>(metaPath);

  const contractEntries: string[] = [];

  for (const [exportName, contract] of Object.entries(meta.contracts)) {
    const artifactPath = await resolveFoundryArtifactPath({
      outDir,
      artifactName: contract.artifactName,
    });

    const artifact = await readJson<FoundryArtifact>(artifactPath);

    contractEntries.push(
      toConstExport(normalizeAddressExportName(exportName), contract.address),
    );

    contractEntries.push("");

    contractEntries.push(
      toConstExport(normalizeAbiExportName(exportName), artifact.abi),
    );

    contractEntries.push("");
  }

  contractEntries.push(
    toConstExport("deploymentMeta", {
      deploymentId: meta.deploymentId,
      chainId: meta.chainId,
      networkName: meta.networkName,
      contracts: meta.contracts,
      exportedAt: new Date().toISOString(),
    }),
  );

  const contractsTs = `/* eslint-disable */\n\n${contractEntries.join("\n")}\n`;

  await fs.mkdir(path.dirname(outputPath), { recursive: true });

  await fs.writeFile(outputPath, contractsTs, "utf8");

  if (options.writeNormalizedMeta) {
    await fs.mkdir(path.dirname(normalizedMetaPath), { recursive: true });

    await fs.writeFile(
      normalizedMetaPath,
      JSON.stringify(
        {
          ...meta,
          exportedAt: new Date().toISOString(),
        },
        null,
        2,
      ),
      "utf8",
    );
  }

  return {
    meta,
    outputPath,
    metaPath,
    outDir,
    contractNames: Object.keys(meta.contracts),
  };
}
