import * as vscode from 'vscode';

export class Logger {
    private static instance: Logger;
    private logger: vscode.OutputChannel;

    private constructor() {
        this.logger = vscode.window.createOutputChannel("iCalendarLog");
        this.logger.show();
    }

    public static log(msg: string): void {
        // TODO support multi-args as console.log
        if (!Logger.instance) {
            console.log('init logger');
            Logger.instance = new Logger();
        }

        console.log(msg);
        Logger.instance.logger.appendLine(msg);
    }
}