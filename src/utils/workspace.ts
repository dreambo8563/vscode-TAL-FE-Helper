import * as vscode from "vscode";
export const workspaceCheck = () => {
  const foldes = vscode.workspace.workspaceFolders;
  if (!foldes) {
    vscode.window.showErrorMessage("please create a workspace first!");
    return;
  }
  return foldes[0].uri.fsPath;
};
