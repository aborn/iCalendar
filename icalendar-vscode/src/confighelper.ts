import * as fs from "fs";
import * as os from 'os';
import * as path from 'path';
import * as vscode from 'vscode';
import { Logger } from "./logger";
import { UserInfo } from "./userinfo";

export class ConfigHelper {
    private static insance: ConfigHelper;

    private userInfo: UserInfo;
    private config: any;

    private constructor() {
        this.userInfo = new UserInfo();
        this.updateIdAndTokenFromConfigFile();
    }

    public updateIdAndTokenFromConfigFile() {
        this.read((id, token, config) => {
            if (token !== null) {
                this.userInfo.update(id, token);
            }
            this.config = config;
        });
    }

    static getInstance(): ConfigHelper {
        if (!ConfigHelper.insance) {
            ConfigHelper.insance = new ConfigHelper();
        }

        return ConfigHelper.insance;
    }

    public set(key: string, value: string): void {
        // update memo instance first.
        if ('token' === key) {
            this.userInfo.setToken(value);
        } else if ('id' === key) {
            this.userInfo.setId(value);
        } else if ('level' === key) {
            Logger.setLevel(value);
        }

        // update key/value to config file.
        let contents: string[] = [];
        this.readConfigFile().then(result => {
            let found = false;
            Object.keys(result).map(k => {
                let val = result[k];
                if (key === k) {
                    found = true;
                    contents.push(k + ' = ' + value);
                } else {
                    contents.push(k + ' = ' + val);
                }
            });

            if (!found) {
                contents.push(key + ' = ' + value);
            }

            return contents;
        }, error => {
            Logger.error(error.message);
            if (error.errno === -2 && error.code === 'ENOENT') {
                contents.push(key + ' = ' + value);
                return contents;
            } else {
                vscode.window.showInformationMessage(`Config ${key} (value:${value}) failed. file (${error.path}) dealing failed.`);
                return null;
            }
        }).then(contents => {
            if (contents === null) {
                Logger.error(`set key=${key}, value=${value} failed. reason: read file failed.`);
            } else {
                this.writeConfigFile(contents.join('\n'));
            }
        }).catch(error => {
            Logger.error(`set key=${key}, value=${value} failed.`, error);
            vscode.window.showInformationMessage(`Config ${key} (value:${value}) failed. file (${error.path}) dealing failed.`);
        });
    }

    public getConfigAsync(key: string, callback: (_err: string, defaultVal: string) => void) {
        let token = this.getToken();
        if (token === null) {
            this.updateIdAndTokenFromConfigFile();
            token = '';
        }

        let id = this.getId();
        if (id === null) {
            id = '';
        }

        let level = Logger.getLevel();

        let configLocal: { [key: string]: any } = {};
        configLocal['id'] = id;
        configLocal['token'] = token;
        configLocal[key] = level || this.config[key];

        callback('', configLocal[key]);
    }

    public getToken(): string | null {
        return this.userInfo.getToken();
    }

    public getId(): string | null {
        return this.userInfo.getId();
    }

    public isLegal(): boolean {
        return true;
    }

    private writeConfigFile(contents: string): Promise<any> {
        return new Promise((resolve, reject) => {
            fs.writeFile(ConfigHelper.getConfigFile(), contents, err => {
                if (err) {
                    reject(err);
                } else {
                    Logger.info('Promise writheConfigFile success.');
                    resolve("success");
                }
            });
        });
    }

    private readConfigFile(): Promise<any> {
        return new Promise((resolve, reject) => {
            fs.readFile(ConfigHelper.getConfigFile(), function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    let result: any = {};
                    let lines = data.toString().split('\n');
                    for (let i = 0; i < lines.length; i++) {
                        let line = lines[i];
                        if (line.indexOf('=') >= 0) {
                            let parts = line.split('=');
                            let key = parts[0].trim();
                            let value = parts[1].trim();
                            result[key] = value;
                        }
                    }
                    resolve(result);
                }
            });
        });
    }

    private read(callback: (id: string, token: string, config: {}) => void): void {
        this.readConfigFile().then(result => {
            let id = result['id'];
            let token = result['token'];
            let level = result['level']; // log level
            Logger.setLevel(level);
            Logger.info(`Promise init id and token finished. { id: ${id}, token: ${token}, level: ${level} }`);

            callback(id, token, result);
        }).catch(error => {
            Logger.error('Promise error, ', error);
        });
    }

    private static isPortable(): boolean {
        return !!process.env['VSCODE_PORTABLE'];
    }

    private static getUserHomeDir(): string {
        if (ConfigHelper.isPortable()) {
            return process.env['VSCODE_PORTABLE'] as string;
        }

        return process.env[os.platform() === 'win32' ? 'USERPROFILE' : 'HOME'] || '';
    }

    public static getConfigFile(): string {
        let homePath = ConfigHelper.getUserHomeDir();
        let fileWebx = path.join(homePath, '.webx.cfg');
        let fileICalendar = path.join(homePath, '.iCalendar.cfg');
        return fileWebx;
    }
}