import * as fs from "fs/promises";
import ignore from "ignore";
import * as path from "path";
import * as vscode from "vscode";
import { getConfig } from "./get-config";
import { loadGitignore } from "./load-gitignore";

export async function normalizeUris(uris: vscode.Uri[]) {
  let files: string[] = [];
  let folders: string[] = [];

  // Load gitignore patterns from the workspace root
  const rootDir = vscode.workspace.workspaceFolders
    ? vscode.workspace.workspaceFolders[0].uri.fsPath
    : "";

  const { gitignore: respectGitignore, exclude } = getConfig();
  const ig = ignore();

  if (respectGitignore) {
    const gitignore = await loadGitignore(rootDir);
    ig.add(gitignore);
  }

  ig.add(exclude);

  for (const uri of uris) {
    const relativePath = path.relative(rootDir, uri.fsPath);
    if (ig.ignores(relativePath)) {
      continue; // Skip ignored paths
    }

    const stat = await fs.stat(uri.fsPath);
    if (stat.isDirectory()) {
      folders.push(uri.fsPath);
    } else {
      files.push(uri.fsPath);
    }
  }

  return { files, folders };
}
