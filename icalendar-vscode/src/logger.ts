import * as vscode from 'vscode';
import { formatTime } from './dateutils';

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
        
        let formatMsg = this.formatMsg(msg);
        console.log(formatMsg);
        Logger.instance.logger.appendLine(formatMsg);
    }

    // level: info, error, debug
    private static formatMsg(msg: string, level: string='info'): string {
        return formatTime() + " [" + level + "] " + msg;
    }
}