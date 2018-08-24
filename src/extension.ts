"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { workspaceCheck } from "./utils/workspace";
import { execCMD } from "./utils/cmd";
import { mkDirByPathSync, writeTpl } from "./utils/fsExtra";
import * as path from "path";
import { blankPageTpl } from "./utils/templates";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  //   console.log('Congratulations, your extension "tal-fe" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let initProjectDisposable = vscode.commands.registerCommand(
    "extension.initProject",
    async () => {
      // The code you place here will be executed every time your command is executed
      const rootPath = workspaceCheck();
      if (!rootPath) {
        return;
      }
      console.log(rootPath);
      const gitPath = "http://gitlab.zhiyinlou.com/bpit/FETeam/FE-standard.git";
      try {
        await execCMD(`git clone ${gitPath} ${rootPath}`);
        const rmGit = `rm -rf ${rootPath}/.git`;
        const { stdout, stderr } = await execCMD(rmGit);
        if (stdout || stderr) {
          vscode.window.showErrorMessage(stdout || stderr);
          return;
        }
      } catch (error) {
        vscode.window.showErrorMessage(error);
        return;
      }

      vscode.window.showInformationMessage("Project initialized successfully!");
    }
  );

  context.subscriptions.push(initProjectDisposable);

  let newPageDisposable = vscode.commands.registerCommand(
    "extension.newPage",
    async () => {
      // The code you place here will be executed every time your command is executed
      const rootPath = workspaceCheck();
      if (!rootPath) {
        return;
      }
      console.log(rootPath);
      const inputPath = await vscode.window.showInputBox({
        value: "./views/",
        prompt: "please input the page path",
        ignoreFocusOut: true
      });
      if (!inputPath) {
        return;
      }
      // create path for the page
      try {
        await mkDirByPathSync(path.resolve(rootPath, "./src", inputPath));
      } catch (error) {
        vscode.window.showErrorMessage(JSON.stringify(error));
        return;
      }
      // select the page type
      vscode.window.showQuickPick(["blank", "form", "list"], {
        onDidSelectItem: async item => {
          const filePath = path.resolve(
            rootPath,
            "./src",
            inputPath,
            "./index.vue"
          );
          switch (item) {
            // inject the tpl
            case "blank":
              try {
                const pageName = path.parse(inputPath).name;
                await writeTpl(filePath, blankPageTpl(pageName));
              } catch (error) {
                vscode.window.showErrorMessage(JSON.stringify(error));
                return;
              }
              break;
          }
        }
      });

      vscode.window.showInformationMessage("Page initialized successfully!");
    }
  );

  context.subscriptions.push(newPageDisposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
