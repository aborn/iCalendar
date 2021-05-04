import * as vscode from "vscode";
import * as events from "./events";
import { TimeTrace } from "./timetrace";
import { ValidateUtils } from "./validateutils";
import { ConfigHelper } from "./confighelper";
import { Logger } from "./logger";

export class ICalendar {
    private timetrace: TimeTrace;

    constructor(state: vscode.Memento) {
        this.initEventListeners();
        this.timetrace = new TimeTrace();
        ConfigHelper.getInstance();   // init it!
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
        let path = ConfigHelper.getConfigFile();
        if (path) {
            let uri = vscode.Uri.file(path);
            vscode.window.showTextDocument(uri);
        }
    }

    public promptConfig(key: string): void {
        ConfigHelper.getInstance().getConfigAsync(key, (_err, defaultVal) => {
            if (ValidateUtils.validate(key, defaultVal) !== '') {
                defaultVal = '';
            }

            let promptOptions = {
                prompt: `iCalendar ${key}`,
                placeHolder: 'level' === key ?
                    'Enter your log level, as one of: debug, info, error' :
                    `Enter your ${key} from WeChat miniprogram [i极客日历]->我的/账号${key}`,
                value: defaultVal,
                ignoreFocusOut: true,
                validateInput: ValidateUtils.validateFn(key).bind(this),
            };
            vscode.window.showInputBox(promptOptions).then(val => {
                if (val !== undefined) {
                    let validation = ValidateUtils.validate(key, val);
                    if (validation === '') {
                        ConfigHelper.getInstance().set(key, val);
                    } else {
                        vscode.window.setStatusBarMessage(validation);
                    }
                } else {
                    vscode.window.setStatusBarMessage('iCalendar token not provided');
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
        if (events.TEXT_EDITOR_SELECT === eventName) {
            let minute = new Date().getSeconds();
            if (minute % 2 === 0) {
                // control freq
                Logger.debug(eventName);
            }
        } else {
            Logger.debug(eventName);
        }

        this.record();
    }

    private onEdit(e: vscode.TextDocumentChangeEvent) {
        let eventName = events.FILE_EDITED;
        if (e.contentChanges.length > 0) {
            console.log(eventName);
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
        Logger.info('iCalendar disposed.');
    }
}