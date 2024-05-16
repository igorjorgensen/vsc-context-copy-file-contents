import fg from "fast-glob";
import * as path from "path";
import { loadGitignore } from "./load-gitignore";

export type GetAllFilesProps = {
  dirPath?: string;
  patterns?: string[];
};

// Use fast-glob to get all files matching the glob patterns
export async function getAllFiles({ dirPath, patterns }: GetAllFilesProps) {
  if (!dirPath || !patterns) {
    throw new Error("Both dirPath and patterns are required");
  }

  try {
    const ig = await loadGitignore(dirPath);
    const absolutePatterns = patterns.map((pattern) =>
      path.join(dirPath, pattern)
    );

    const files = await fg(absolutePatterns, { onlyFiles: true });

    return files.filter((file) => !ig.ignores(path.relative(dirPath, file)));
  } catch (error: any) {
    throw new Error(`Error reading directory: ${error.message}`);
  }
}
