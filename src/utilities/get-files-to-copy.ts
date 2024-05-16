import ignore from "ignore";
import * as path from "path";
import * as vscode from "vscode";
import { getAllFiles } from "./get-all-files";
import { loadGitignore } from "./load-gitignore";
import { getConfig } from "./get-config";

export type GetFilesToCopyProps = {
  files?: string[];
  folders?: string[];
};

export async function getFilesToCopy({
  files = [],
  folders = [],
}: GetFilesToCopyProps): Promise<string[]> {
  const { include, exclude, gitignore: respectGitignore } = getConfig();

  // Initialize ignore instance with exclude patterns
  const ig = ignore().add(exclude);

  // Combine include and exclude patterns in a single pass
  const processFolder = async (folder: string) => {
    const folderFiles = await getAllFiles({
      dirPath: folder,
      patterns: include,
    });
    return folderFiles.filter(
      (file) => !ig.ignores(path.relative(folder, file))
    );
  };

  // Read and filter all files in parallel
  const fileProcessingPromises = folders.map(processFolder);
  const processedFilesFromFolders = await Promise.all(fileProcessingPromises);
  files = files.concat(...processedFilesFromFolders);

  // Filter files based on exclude patterns
  files = files.filter(
    (file) =>
      !ig.ignores(
        path.relative(
          vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || "",
          file
        )
      )
  );

  // Respect .gitignore if enabled
  if (respectGitignore) {
    const rootDir = vscode.workspace.workspaceFolders
      ? vscode.workspace.workspaceFolders[0].uri.fsPath
      : "";
    const gitignore = await loadGitignore(rootDir);
    files = files.filter(
      (file) => !gitignore.ignores(path.relative(rootDir, file))
    );
  }

  return files;
}
