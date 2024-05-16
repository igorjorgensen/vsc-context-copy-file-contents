import * as fs from "fs/promises";
import * as path from "path";
import * as vscode from "vscode";
import { extensionToSyntax } from "./extension-to-syntax";
import { getConfig } from "./get-config";
import { removeCommentsFromCode } from "./remove-comments";

export type ConcatenateFilesContentProps = {
  files?: string[];
};

export async function concatenateFilesContent({
  files,
}: ConcatenateFilesContentProps) {
  if (!files) {
    throw new Error("Files are required");
  }

  // Get the root directory of the workspace
  const rootDir = vscode.workspace.workspaceFolders
    ? vscode.workspace.workspaceFolders[0].uri.fsPath
    : "";

  // Check if comments should be removed
  const { removeComments, includeMetadata, minimize } = getConfig();

  // Read all files in parallel
  const fileReadPromises = files.map(async (file) => {
    const [fileContent, stats] = await Promise.all([
      fs.readFile(file, "utf8"),
      fs.stat(file),
    ]);
    return { file, fileContent, stats };
  });

  const fileContents = await Promise.all(fileReadPromises);

  let content = "";

  for (let i = 0; i < fileContents.length; i++) {
    const { file, fileContent, stats } = fileContents[i];
    let processedContent = fileContent;

    if (removeComments) {
      processedContent = removeCommentsFromCode(fileContent);
    }

    if (minimize) {
      processedContent = processedContent.replace(/\s+/g, "");
    }

    const relativePath = path.relative(rootDir, file);
    const extension = path.extname(file).slice(1); // Get the file extension without the dot
    const syntax = extensionToSyntax({ extension });

    content += `\`\`\`${syntax}\n// File: ${relativePath}\n`;

    if (includeMetadata) {
      content += `// Size: ${(stats.size / 1024).toFixed(1)} KB\n`;
      content += `// Last Modified: ${stats.mtime.toISOString()}\n`;
    }

    content += `${processedContent}\n\`\`\``;

    // Add a line break between file blocks, except for the last one
    if (i < fileContents.length - 1) {
      content += "\n\n";
    }
  }

  return content;
}
