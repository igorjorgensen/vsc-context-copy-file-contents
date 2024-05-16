import * as vscode from "vscode";

export function getConfig() {
  const config = vscode.workspace.getConfiguration("copyFolderContent");
  return {
    include: config.get<string[]>("include", ["**/*.{js,ts,jsx,tsx}"]),
    exclude: config.get<string[]>("exclude", ["node_modules"]),
    maxContentSize: config.get<number>("maxContentSize", 1048576),
    removeComments: config.get<boolean>("removeComments", false),
    gitignore: config.get<boolean>("gitignore", true),
    includeMetadata: config.get<boolean>("includeMetadata", false),
  };
}
