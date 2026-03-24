import { build as viteBuild } from "vite";
import { execSync } from "child_process";
import { rm } from "fs/promises";
import path from "path";

const ROOT = process.cwd();

async function buildAll() {
  console.log("Cleaning dist...");
  await rm(path.join(ROOT, "dist"), { recursive: true, force: true });

  console.log("\nGenerating content data and syncing public assets...");
  execSync("npx tsx script/generate-content.ts", { stdio: "inherit" });

  console.log("\nBuilding client...");
  await viteBuild();

  console.log("\nBuild complete. Output: dist/public");
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});