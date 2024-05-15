import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';

// Function to get all JavaScript and TypeScript files in a directory recursively
function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else if (file.endsWith('.js') || file.endsWith('.ts')) {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
}

// Function to read the content of all files and concatenate them with their paths
function concatenateFilesContent(files: string[]): string {
  return files.map((file) => {
    const fileContent = fs.readFileSync(file, 'utf8');
    return `// ${file}\n${fileContent}\n`;
  }).join('\n');
}

// Function to copy content to clipboard
function copyToClipboard(content: string): void {
  const platform = process.platform;
  const copyCommand = platform === 'win32' ? 'clip' : 'pbcopy';
  const proc = exec(copyCommand);
  proc.stdin?.write(content);
  proc.stdin?.end();
}

// Main function
function main(): void {
  if (process.argv.length < 3) {
    console.error('Please provide a directory path as an argument.');
    process.exit(1);
  }

  const dirPath = process.argv[2];

  if (!fs.existsSync(dirPath)) {
    console.error('Directory does not exist.');
    process.exit(1);
  }

  const files = getAllFiles(dirPath);
  const concatenatedContent = concatenateFilesContent(files);
  copyToClipboard(concatenatedContent);
  console.log('Content copied to clipboard.');
}

main();
