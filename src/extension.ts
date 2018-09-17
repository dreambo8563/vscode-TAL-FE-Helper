"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { workspaceCheck } from "./utils/workspace";
import { execCMD } from "./utils/cmd";
import { mkDirByPathSync, writeTpl, appendText } from "./utils/fsExtra";
import * as path from "path";
import {
  blankPageTpl,
  basicFormPageTpl,
  basicListPageTpl,
  injectComponent
} from "./utils/templates";
import * as os from "os";
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
      // console.log(rootPath);
      const gitPath = "http://gitlab.zhiyinlou.com/bpit/FETeam/FE-standard.git";
      try {
        await execCMD(`git clone ${gitPath} ${rootPath}`);
        const rmGit = `rm -rf ${rootPath}/.git`;
        const { stdout, stderr } = await execCMD(rmGit);
        if (stdout || stderr) {
          await vscode.window.showErrorMessage(stdout || stderr);
          return;
        }
      } catch (error) {
        await vscode.window.showErrorMessage(error);
        return;
      }

      await vscode.window.showInformationMessage(
        "Project initialized successfully!"
      );
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
      // console.log(rootPath);
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
        await vscode.window.showErrorMessage(JSON.stringify(error));
        return;
      }
      // select the page type
      await vscode.window.showQuickPick(["blank", "form", "list"], {
        onDidSelectItem: async item => {
          const filePath = path.resolve(
            rootPath,
            "./src",
            inputPath,
            "./index.vue"
          );
          const pageName = path.parse(inputPath).name;
          switch (item) {
            // inject the tpl
            case "blank":
              try {
                await writeTpl(filePath, blankPageTpl(pageName));
              } catch (error) {
                await vscode.window.showErrorMessage(JSON.stringify(error));
                return;
              }
              break;
            case "form":
              try {
                await writeTpl(filePath, basicFormPageTpl(pageName));
              } catch (error) {
                await vscode.window.showErrorMessage(JSON.stringify(error));
                return;
              }
              break;
            case "list":
              try {
                await writeTpl(filePath, basicListPageTpl(pageName));
              } catch (error) {
                await vscode.window.showErrorMessage(JSON.stringify(error));
                return;
              }
              break;
          }
        }
      });

      await vscode.window.showInformationMessage(
        "Page initialized successfully!"
      );
    }
  );

  context.subscriptions.push(newPageDisposable);

  let extracTEXTDisposable = vscode.commands.registerCommand(
    "extension.extractTEXT",
    async () => {
      let editor = vscode.window.activeTextEditor;
      if (!editor) {
        return; // No open text editor
      }

      let selection = editor.selection;
      let selectedText = editor.document.getText(selection);
      const rootPath = workspaceCheck();
      if (!rootPath) {
        return;
      }

      const varName = await vscode.window.showInputBox({
        prompt: "please input variable name",
        ignoreFocusOut: true
      });
      if (!varName) {
        return;
      }
      const modulePath = path.resolve(rootPath, "./src/constants/TEXT.ts");
      await editor.edit(bd => {
        const dataPath = `constants.${varName.toUpperCase()}`;
        bd.replace(selection, dataPath);
      });
      await appendText(
        modulePath,
        `export const ${varName.toUpperCase()} = "${selectedText}"` + os.EOL
      );

      await vscode.window.showInformationMessage(
        `export const ${varName.toUpperCase()} = "${selectedText}" -> inserted!`
      );
    }
  );

  context.subscriptions.push(extracTEXTDisposable);

  let extracComponentDisposable = vscode.commands.registerCommand(
    "extension.extractComponent",
    async () => {
      let editor = vscode.window.activeTextEditor;
      if (!editor) {
        return; // No open text editor
      }

      let selection = editor.selection;
      let selectedText = editor.document.getText(selection);
      const rootPath = workspaceCheck();
      if (!rootPath) {
        return;
      }

      const componentPath = await vscode.window.showInputBox({
        value: "./components/",
        prompt: "please input the page path",
        ignoreFocusOut: true
      });
      if (!componentPath) {
        return;
      }
      try {
        await mkDirByPathSync(path.resolve(rootPath, "./src", componentPath));
      } catch (error) {
        await vscode.window.showErrorMessage(JSON.stringify(error));
        return;
      }
      const componentName = path.parse(componentPath).name;
      const modulePath = path.resolve(
        rootPath,
        "./src",
        componentPath,
        "./index.vue"
      );

      try {
        await writeTpl(modulePath, injectComponent(componentName, selectedText));
      } catch (error) {
        await vscode.window.showErrorMessage(JSON.stringify(error));
        return;
      }
      for (let index = 0; index < editor.document.lineCount; index++) {
        if (!editor.document.lineAt(index).isEmptyOrWhitespace) {
          const content = editor.document.lineAt(index).text;

          if (content.trim().startsWith("<script>")) {
            const endPos = editor.document.lineAt(index).range.end;
            let selection = editor.selection;
            await editor.edit(bd => {
              bd.insert(
                endPos,
                os.EOL +
                  `import ${componentName} from "@${componentPath.substr(
                    1
                  )}/index.vue"`
              );
              const compTagString = `<${componentName}></${componentName}>`;
              bd.replace(selection, compTagString);
            });

            break;
          }
        }
      }
      await vscode.window.showInformationMessage(`${componentName} created!`);
    }
  );

  context.subscriptions.push(extracComponentDisposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
