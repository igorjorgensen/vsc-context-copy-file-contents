import { exec } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import * as semver from 'semver';

// Function to recursively get all VSIX files in a directory
function getVSIXFiles(dir: string, filesList: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getVSIXFiles(filePath, filesList);
    } else if (file.endsWith('.vsix')) {
      filesList.push(filePath);
    }
  });
  return filesList;
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

      if (
        !namespaceToFile[namespace] ||
        semver.gt(version, namespaceToFile[namespace])
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
  const relativeDir = args[0] || '.extensions';
  const extensionsDir = path.resolve(process.cwd(), relativeDir);

  console.log(`VSC Extensions Installer\n`);

  if (
    !fs.existsSync(extensionsDir) ||
    !fs.statSync(extensionsDir).isDirectory()
  ) {
    console.error(
      `The directory "${extensionsDir}" does not exist or is not a directory.`,
    );
    process.exit(1);
  }

  const vsixFiles = getVSIXFiles(extensionsDir);
  const highestVersionVSIXFiles = getHighestVersionVSIXFiles(vsixFiles);

  if (highestVersionVSIXFiles.length === 0) {
    console.log('No VSIX files found to install.');
    return;
  }

  highestVersionVSIXFiles.forEach(installVSIX);
}

// Run the script
main();
