import { exec } from "child_process";
import * as path from "path";
import * as fs from "fs";

// Function to recursively get all VSIX files in a directory
function getVSIXFiles(dir: string, filesList: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getVSIXFiles(filePath, filesList);
    } else if (file.endsWith(".vsix")) {
      filesList.push(filePath);
    }
  });
  return filesList;
}

// Function to compare two version strings
function compareVersions(version1: string, version2: string): number {
  const v1Parts = version1.split(".").map(Number);
  const v2Parts = version2.split(".").map(Number);

  for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
    const v1 = v1Parts[i] || 0;
    const v2 = v2Parts[i] || 0;
    if (v1 > v2) {
      return 1;
    }
    if (v1 < v2) {
      return -1;
    }
  }
  return 0;
}

// Function to get the version from a filename
function getVersionFromFilename(filename: string): string | null {
  const match = filename.match(/^(.+?)-(\d+\.\d+\.\d+)\.vsix$/);
  return match ? match[2] : null;
}

// Function to get the highest versioned VSIX files for each namespace
function getHighestVersionVSIXFiles(files: string[]): string[] {
  const namespaceToFile: { [namespace: string]: string } = {};

  files.forEach((file) => {
    const fileName = path.basename(file);
    const match = fileName.match(/^(.+?)-(\d+\.\d+\.\d+)\.vsix$/);
    if (match) {
      const namespace = match[1];
      const version = match[2];

      const existingFile = namespaceToFile[namespace];
      const existingVersion = existingFile
        ? getVersionFromFilename(path.basename(existingFile))
        : null;

      if (
        !existingFile ||
        (existingVersion && compareVersions(version, existingVersion) > 0)
      ) {
        namespaceToFile[namespace] = file;
      }
    }
  });

  return Object.values(namespaceToFile);
}

// Function to install VSIX extension
function installVSIX(vsixPath: string) {
  exec(`code --install-extension ${vsixPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error installing extension: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Error output: ${stderr}`);
      return;
    }
    console.log(`${stdout}`);
  });
}

// Main script
function main() {
  const args = process.argv.slice(2);
  const relativeDir = args[0] || ".extensions";
  const extensionsDir = path.resolve(process.cwd(), relativeDir);

  console.log(`VSC Extensions Installer\n`);

  if (
    !fs.existsSync(extensionsDir) ||
    !fs.statSync(extensionsDir).isDirectory()
  ) {
    console.error(
      `The directory "${extensionsDir}" does not exist or is not a directory.`
    );
    process.exit(1);
  }

  const vsixFiles = getVSIXFiles(extensionsDir);
  const highestVersionVSIXFiles = getHighestVersionVSIXFiles(vsixFiles);

  if (highestVersionVSIXFiles.length === 0) {
    console.log("No VSIX files found to install.");
    return;
  }

  highestVersionVSIXFiles.forEach(installVSIX);
}

// Run the script
main();
