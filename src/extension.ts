import * as vscode from "vscode";
import * as fs from "fs/promises";
import * as path from "path";
import { spawn } from "child_process";

// Function to get all files with specified extensions in a directory recursively
async function getAllFiles(
  dirPath: string,
  extensions: string[],
  arrayOfFiles: string[] = []
): Promise<string[]> {
  try {
    const files = await fs.readdir(dirPath);

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stat = await fs.stat(filePath);

      if (stat.isDirectory()) {
        arrayOfFiles = await getAllFiles(filePath, extensions, arrayOfFiles);
      } else if (extensions.some((ext) => file.endsWith(ext))) {
        arrayOfFiles.push(filePath);
      }
    }
  } catch (error: any) {
    vscode.window.showErrorMessage(`Error reading directory: ${error.message}`);
  }

  return arrayOfFiles;
}

// Function to read the content of all files and concatenate them with their paths
async function concatenateFilesContent(
  rootDir: string,
  files: string[]
): Promise<string> {
  let content = "";

  for (const file of files) {
    try {
      const fileContent = await fs.readFile(file, "utf8");
      const relativePath = path.relative(rootDir, file);
      content += `// ${relativePath}\n${fileContent}\n`;
    } catch (error: any) {
      vscode.window.showErrorMessage(
        `Error reading file: ${file} - ${error.message}`
      );
    }
  }

  return content;
}

// Function to copy content to clipboard
async function copyToClipboard(content: string): Promise<void> {
  try {
    const platform = process.platform;
    const copyCommand =
      platform === "win32"
        ? "clip"
        : platform === "darwin"
          ? "pbcopy"
          : "xclip -selection clipboard";
    const proc = spawn(copyCommand, { shell: true });

    proc.stdin.write(content);
    proc.stdin.end();
  } catch (error: any) {
    vscode.window.showErrorMessage(
      `Error copying to clipboard: ${error.message}`
    );
  }
}

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "extension.copyFolderContent",
    async (uri: vscode.Uri) => {
      const dirPath = uri.fsPath;
      const config = vscode.workspace.getConfiguration("copyFolderContent");
      const extensions = config.get<string[]>("fileExtensions", [".js", ".ts"]);

      try {
        const stat = await fs.stat(dirPath);

        if (!stat.isDirectory()) {
          vscode.window.showErrorMessage("Selected path is not a directory.");
          return;
        }

        const files = await getAllFiles(dirPath, extensions);
        const concatenatedContent = await concatenateFilesContent(
          dirPath,
          files
        );
        await copyToClipboard(concatenatedContent);

        const folderName = path.basename(dirPath);
        vscode.window.showInformationMessage(
          `Content from ${files.length} files in folder '${folderName}' copied to clipboard.`
        );
      } catch (error: any) {
        vscode.window.showErrorMessage(`Error: ${error.message}`);
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
