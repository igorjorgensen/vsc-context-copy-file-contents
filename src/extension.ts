import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { exec } from "child_process";

// Function to get all JavaScript and TypeScript files in a directory recursively
function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else if (file.endsWith(".js") || file.endsWith(".ts")) {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
}

// Function to read the content of all files and concatenate them with their paths
function concatenateFilesContent(files: string[]): string {
  return files
    .map((file) => {
      const fileContent = fs.readFileSync(file, "utf8");
      return `// ${file}\n${fileContent}\n`;
    })
    .join("\n");
}

// Function to copy content to clipboard
function copyToClipboard(content: string): void {
  const platform = process.platform;
  const copyCommand = platform === "win32" ? "clip" : "pbcopy";
  const proc = exec(copyCommand);
  proc.stdin?.write(content);
  proc.stdin?.end();
}

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "extension.copyFolderContent",
    (uri: vscode.Uri) => {
      const dirPath = uri.fsPath;

      if (!fs.existsSync(dirPath)) {
        vscode.window.showErrorMessage("Directory does not exist.");
        return;
      }

      const files = getAllFiles(dirPath);
      const concatenatedContent = concatenateFilesContent(files);
      copyToClipboard(concatenatedContent);
      vscode.window.showInformationMessage("Content copied to clipboard.");
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
