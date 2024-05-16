import * as vscode from "vscode";
import { concatenateFilesContent } from "./utilities/concatenate-files-content";
import { copyToClipboard } from "./utilities/copy-to-clipboard";
import { getFilesToCopy } from "./utilities/get-files-to-copy";
import { getMaxContentSize } from "./utilities/get-max-content-size";
import { handleError } from "./utilities/handle-error";
import { handleInfo } from "./utilities/handle-info";
import { normalizeUris } from "./utilities/normalize-uris";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "extension.copyFolderContent",
    async (uri: vscode.Uri, _uris?: vscode.Uri[]) => {
      const uris = _uris || [uri];
      const maxContentSize = getMaxContentSize({}); // Get the max content size from config

      try {
        // Normalize URIs to file and folder paths
        const { files, folders } = await normalizeUris(uris);

        // Check if there are no files or folders to process
        if (files.length === 0 && folders.length === 0) {
          vscode.window.showErrorMessage(
            "No files or folders to copy. The selected items may be ignored by .gitignore or exclude patterns."
          );
          return;
        }

        // Get all files to copy based on the selected resources
        const filesToCopy = await getFilesToCopy({ files, folders });

        // Concatenate contents of all collected files
        let content = await concatenateFilesContent({
          files: filesToCopy,
        });

        // Check and handle content size limit
        if (Buffer.byteLength(content, "utf8") > maxContentSize) {
          vscode.window.showErrorMessage(
            "Content exceeds maximum size. Only partial content copied."
          );
          content = content.slice(0, maxContentSize); // Trim content to max size
        }

        // Copy the content to the clipboard
        await copyToClipboard({ content });

        handleInfo(
          `Content from ${filesToCopy.length} files copied to clipboard.`
        );
      } catch (error: any) {
        handleError({ error });
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
