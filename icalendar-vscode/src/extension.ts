// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ICalendar } from './icalendar';

let iCalendar: ICalendar;

// this method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "iCalendar" is now active!');
	iCalendar = new ICalendar(context.globalState);

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	context.subscriptions.push(
		vscode.commands.registerCommand('iCalendar.helloWorld', () => {
			// The code you place here will be executed every time your command is executed

			// Display a message box to the user
			vscode.window.showInformationMessage('Hello World from iCalendar plugin!');
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('iCalendar.config_file', () => {
			iCalendar.openConfigFile();
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('iCalendar.token', function () {
			iCalendar.promptConfig('token');
		}),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('iCalendar.id', function () {
			iCalendar.promptConfig('id');
		}),
	);
}

// this method is called when your extension is deactivated
export function deactivate() {
	if (iCalendar) {
		iCalendar.dispose();
	}
}
