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

  const rootDir = vscode.workspace.workspaceFolders
    ? vscode.workspace.workspaceFolders[0].uri.fsPath
    : "";

  const { removeComments, includeMetadata, minimize } = getConfig();

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
      processedContent = processedContent.replace(/\n+/g, "");
    }

    const relativePath = path.relative(rootDir, file);
    const extension = path.extname(file).slice(1);
    const syntax = extensionToSyntax({ extension });

    content += `\`\`\`${syntax}\n`;

    if (includeMetadata) {
      content += `File: ${relativePath}\nSize: ${stats.size} bytes\nLast Modified: ${stats.mtime.toISOString()}\n`;
    }

    content += `${processedContent}\n\`\`\``;

    if (i < fileContents.length - 1) {
      content += "\n\n";
    }
  }

  return content;
}
