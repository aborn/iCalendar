import { log } from 'node:util';
import * as vscode from 'vscode';
import { formatTime } from './dateutils';

const LEVELMAP: { [key: string]: number } = { "debug": 0, "info": 1, "error": 2 };
export class Logger {
    private static instance: Logger;

    private logger: vscode.OutputChannel;
    private level: string;

    private constructor() {
        this.logger = vscode.window.createOutputChannel("iCalendarLog");
        this.level = "debug";
        this.logger.show();
    }

    public static info(...optionalParams: any[]) {
        Logger.log("info", optionalParams);
    }

    public static error(...optionalParams: any[]) {
        Logger.log("error", optionalParams);
    }

    public static debug(...optionalParams: any[]) {
        Logger.log("debug", optionalParams);
    }

    public static setLevel(level: string): void {
        if (LEVELMAP[level]) {
            Logger.init();
            Logger.instance.level = level;
        }
    }

    private static init() {
        if (!Logger.instance) {
            console.log('init logger');
            Logger.instance = new Logger();
        }
    }

    private static log(level: string, ...optionalParams: any[]): void {
        Logger.init();
        Logger.instance.ilog(level, optionalParams);
    }

    private ilog(level: string, ...optionalParams: any[]): void {
        let msg = this.formatMsg(optionalParams.join(' '), level);
        let levelV = LEVELMAP[level];
        let envLevel = LEVELMAP[this.level];

        if (envLevel > levelV) {
            return;
        }

        console.log(msg);
        this.logger.appendLine(msg);
    }

    // level: info, error, debug
    private formatMsg(msg: string, level: string = 'info'): string {
        return formatTime() + " [" + level + "] " + msg;
    }
}