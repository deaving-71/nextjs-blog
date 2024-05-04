import { copyFile } from "node:fs/promises";
import { mkdir } from "node:fs/promises";

console.log("Building project...");
/**
 * create build directory
 */
try {
  const projectFolder = new URL("./build/", import.meta.url);
  await mkdir(projectFolder, { recursive: true });
} catch (err) {
  console.error(err.message);
}

try {
  await copyFile("package.json", "./build/package.json");
  await copyFile("package-lock.json", "./build/package-lock.json");
  await copyFile(".env", "./build/.env");
} catch (err) {
  console.error(err.message);
}
