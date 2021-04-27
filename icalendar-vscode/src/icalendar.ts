import * as vscode from "vscode";
import * as events from "./events";
import { TimeTrace } from "./timetrace";
import { UserInfo } from "./userinfo";
import { ValidateUtils } from "./validateutils";
import { ConfigHelper } from "./confighelper";

export class ICalendar {
    private timetrace: TimeTrace;

    constructor(state: vscode.Memento) {
        this.initEventListeners();
        this.timetrace = new TimeTrace();
    }

    private initEventListeners(): void {
        let events: vscode.Disposable[] = [];

        vscode.window.onDidChangeWindowState(this.onFocus, this, events);
        vscode.window.onDidChangeTextEditorSelection(this.onTextEditorSelect, this, events);
        vscode.window.onDidChangeTextEditorViewColumn(this.onTextEditorViewChange, this, events);
        vscode.window.onDidChangeActiveTextEditor(this.onTextEditorActive, this, events);

        vscode.workspace.onDidChangeTextDocument(this.onEdit, this, events);
        vscode.workspace.onDidSaveTextDocument(this.onSave, this, events);
        vscode.workspace.onDidCreateFiles(this.onCreate, this, events);
    }

    public openConfigFile(): void {
        let path = UserInfo.getConfigFile();
        if (path) {
            let uri = vscode.Uri.file(path);
            vscode.window.showTextDocument(uri);
        }
    }

    public promptForToken(): void {
        ConfigHelper.getInstance().get('token', (_err, defaultVal) => {

            if (ValidateUtils.validateToken(defaultVal) !== '') {
                defaultVal = '';
            }

            let promptOptions = {
                prompt: 'iCalendar Token',
                placeHolder: 'Enter your token from WeChat miniprogram [i极客日历]->我的/账号token',
                value: defaultVal,
                ignoreFocusOut: true,
                validateInput: ValidateUtils.validateToken.bind(this),
            };
            vscode.window.showInputBox(promptOptions).then(val => {
                if (val !== undefined) {
                    let validation = ValidateUtils.validateToken(val);
                    if (validation === '') {
                        ConfigHelper.getInstance().set('token', val);
                    }
                    else {
                        vscode.window.setStatusBarMessage(validation);
                    }
                } else {
                    vscode.window.setStatusBarMessage('WakaTime api key not provided');
                }
            });
        });
    }

    private onTextEditorActive() {
        this.onChange(events.TEXT_EDITOR_ACTIVE);
    }

    private onTextEditorViewChange() {
        this.onChange(events.TEXT_EDITOR_VIEW_CHANGE);
    }

    private onTextEditorSelect() {
        this.onChange(events.TEXT_EDITOR_SELECT);
    }

    private onCreate() {
        this.onChange(events.FILE_CREATED);
    }

    private onSave(e: vscode.TextDocument) {
        this.onChange(events.FILE_SAVED);
    }

    private onChange(eventName = "unknown") {
        console.log(eventName);
        this.record();
    }

    private onEdit(e: vscode.TextDocumentChangeEvent) {
        let eventName = events.FILE_EDITED;
        console.log(eventName);
        if (e.contentChanges.length > 0) {
            this.record();
        }
    }

    private onFocus(e: vscode.WindowState) {
        this.timetrace.setVSCodeWindowState(e.focused);
    }

    private record() {
        this.timetrace.record();
    }

    public dispose() {
        this.timetrace.dispose();
        console.log('iCalendar disposed.');
    }
}