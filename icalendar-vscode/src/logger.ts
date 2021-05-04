import * as vscode from 'vscode';
import { formatTime } from './dateutils';

export const LEVELMAP: { [key: string]: number } = { "debug": 0, "info": 1, "error": 2 };
export class Logger {
    private static instance: Logger;

    private logger: vscode.OutputChannel;
    private level: string;

    private constructor() {
        this.logger = vscode.window.createOutputChannel("iCalendarLog");
        this.level = "info";
        this.logger.show();
    }

    public static info(...optionalParams: any[]) {
        Logger.log("info", ...optionalParams);
    }

    public static error(...optionalParams: any[]) {
        Logger.log("error", ...optionalParams);
    }

    public static debug(...optionalParams: any[]) {
        Logger.log("debug", ...optionalParams);
    }

    public static setLevel(level: string): void {
        if (LEVELMAP[level] !== undefined) {
            Logger.init();
            Logger.instance.level = level;
            Logger.instance.ilog("info", "log level changed to: ", Logger.instance.level);
        }
    }

    private static init() {
        if (!Logger.instance) {
            Logger.instance = new Logger();
            Logger.instance.ilog("info", "init logger. log level: ", Logger.instance.level);
        }
    }

    private static log(level: string, ...optionalParams: any[]): void {
        Logger.init();
        Logger.instance.ilog(level, ...optionalParams);
    }

    private ilog(level: string, ...optionalParams: any[]): void {
        let paramArr = optionalParams.map((item) => {
            if (item instanceof Object) {
                return JSON.stringify(item);
            } else {
                return item;
            }
        });

        let msg = this.joinMsg(paramArr.join(' '), level);
        let levelV = LEVELMAP[level];
        let envLevel = LEVELMAP[this.level];

        if (envLevel > levelV) {
            return;
        }

        if (levelV === 2) {
            console.error(msg);
        } else {
            console.log(msg);
        }
        this.logger.appendLine(msg);
    }

    // level: info, error, debug
    private joinMsg(msg: string, level: string = 'info'): string {
        return formatTime() + " [" + level + "] " + msg;
    }
}