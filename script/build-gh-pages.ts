import { build as viteBuild } from "vite";
import { rm, cp, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

async function buildGhPages() {
  const docsPath = "docs";
  const assetsPath = "assets";
  
  // Clean docs directory
  await rm(docsPath, { recursive: true, force: true });

  console.log("Building client for GitHub Pages...");
  
  // Set environment for GitHub Pages build
  process.env.GITHUB_PAGES = 'true';
  process.env.REPO_NAME = 'PhasmophobiaBroadsHeadQuarters';
  
  await viteBuild();

  // Copy assets folder to docs/assets for static serving
  if (existsSync(assetsPath)) {
    const destAssetsPath = path.join(docsPath, "assets");
    await mkdir(destAssetsPath, { recursive: true });
    await cp(assetsPath, destAssetsPath, { recursive: true });
    console.log("Copied assets to docs/assets");
  }

  // Create .nojekyll file to prevent GitHub Pages from ignoring files starting with underscore
  const nojekyllPath = path.join(docsPath, ".nojekyll");
  const { writeFile } = await import("fs/promises");
  await writeFile(nojekyllPath, "");
  console.log("Created .nojekyll file");

  console.log("GitHub Pages build complete! Output in /docs directory.");
}

buildGhPages().catch((err) => {
  console.error(err);
  process.exit(1);
});
