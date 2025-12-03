import { build as viteBuild } from "vite";
import { rm, cp, mkdir, readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

async function buildGhPages() {
  const docsPath = "docs";
  const assetsPath = "assets";
  
  // Clean docs directory
  await rm(docsPath, { recursive: true, force: true });

  console.log("Building client for GitHub Pages...");
  
  // Read repository name from package.json homepage or use environment variable
  const pkg = JSON.parse(await readFile("package.json", "utf-8"));
  const homepage = pkg.homepage || '';
  const repoNameFromHomepage = homepage.split('/').pop() || '';
  const repoName = process.env.REPO_NAME || repoNameFromHomepage || 'PhasmophobiaBroadsHeadQuarters';
  
  // Set environment for GitHub Pages build
  process.env.GITHUB_PAGES = 'true';
  process.env.REPO_NAME = repoName;
  
  await viteBuild();

  // Copy assets folder contents directly to docs/assets
  if (existsSync(assetsPath)) {
    const destAssetsPath = path.join(docsPath, "assets");
    // Read asset files from source and copy them individually to avoid nested directory
    const { readdir } = await import("fs/promises");
    const files = await readdir(assetsPath);
    for (const file of files) {
      const srcFile = path.join(assetsPath, file);
      const destFile = path.join(destAssetsPath, file);
      await cp(srcFile, destFile, { recursive: true });
    }
    console.log("Copied assets to docs/assets");
  }

  // Create .nojekyll file to prevent GitHub Pages from ignoring files starting with underscore
  const nojekyllPath = path.join(docsPath, ".nojekyll");
  const { writeFile } = await import("fs/promises");
  await writeFile(nojekyllPath, "");
  console.log("Created .nojekyll file");

  // Copy index.html to 404.html for SPA routing support on GitHub Pages
  const indexPath = path.join(docsPath, "index.html");
  const notFoundPath = path.join(docsPath, "404.html");
  await cp(indexPath, notFoundPath);
  console.log("Created 404.html for SPA routing support");

  console.log("GitHub Pages build complete! Output in /docs directory.");
}

buildGhPages().catch((err) => {
  console.error(err);
  process.exit(1);
});
