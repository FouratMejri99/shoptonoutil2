#!/usr/bin/env node
// Cross-platform script to fix esbuild permissions
import { chmodSync, existsSync, lstatSync, readdirSync } from "fs";
import { join, resolve } from "path";

function walkDir(dir, callback) {
  if (!existsSync(dir)) return;
  const items = readdirSync(dir);
  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = lstatSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath, callback);
    } else {
      callback(fullPath, stat);
    }
  }
}

const platform = process.platform;
const nodeModulesPath = resolve("node_modules");
const esbuildPattern = /esbuild$/;
const esbuildExePattern = /esbuild\.exe$/;

let fixed = 0;
let failed = 0;

walkDir(nodeModulesPath, file => {
  const filename = file.split(/[/\\]/).pop();
  if (esbuildPattern.test(filename) || esbuildExePattern.test(filename)) {
    try {
      if (platform === "win32") {
        // On Windows, just try chmod which handles read-only files
        chmodSync(file, 0o755);
      } else {
        chmodSync(file, 0o755);
      }
      console.log(`Fixed: ${file}`);
      fixed++;
    } catch (err) {
      // Ignore errors on Windows for some protected files
      if (platform !== "win32") {
        console.log(`Failed: ${file} - ${err.message}`);
        failed++;
      }
    }
  }
});

console.log(
  `\nDone! Fixed ${fixed} esbuild binaries${failed > 0 ? `, ${failed} failures` : ""}`
);
