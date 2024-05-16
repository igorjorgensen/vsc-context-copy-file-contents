import * as fs from "fs/promises";
import ignore from "ignore";
import * as path from "path";

export async function loadGitignore(dirPath: string) {
  try {
    const gitignorePath = path.join(dirPath, ".gitignore");
    const gitignoreContent = await fs.readFile(gitignorePath, "utf8");
    return ignore().add(gitignoreContent);
  } catch {
    // Return an empty ignore instance if .gitignore not found
    return ignore();
  }
}
