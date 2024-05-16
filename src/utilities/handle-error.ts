import * as vscode from "vscode";

export type HandleErrorProps = {
  error?: any;
};

export function handleError({ error }: HandleErrorProps) {
  vscode.window.showErrorMessage(`Error: ${error.message}`);
}
