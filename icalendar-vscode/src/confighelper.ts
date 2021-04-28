import * as fs from "fs";
import { resolve } from "node:path";
import * as os from 'os';
import * as path from 'path';
import { UserInfo } from "./userinfo";

export class ConfigHelper {
    private static insance: ConfigHelper;

    private userInfo: UserInfo;

    private constructor() {
        this.userInfo = new UserInfo();
        this.updateIdAndTokenFromConfigFile();
    }

    public updateIdAndTokenFromConfigFile() {
        this.read((id, token) => {
            this.userInfo.update(id, token);
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
        }).then(contents =>{
            this.writeConfigFile(contents.join('\n'));
        }).catch(err => {
            console.log(`set key=${key}, value=${value} failed.`, err);
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
        callback('', 'token' === key ? token : id);
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

    private writeConfigFile(contents:string): Promise<any> {
        return new Promise((resolve, reject) => {
            fs.writeFile(ConfigHelper.getConfigFile(), contents, err => {
                if (err) {
                    reject(err);
                } else {
                    console.log('Promise writheConfigFile success.');
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
                    for (var i = 0; i < lines.length; i++) {
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

    private read(callback: (id: string, token: string) => void): void {
        this.readConfigFile().then(result => {
            let id = result['id'];
            let token = result['token'];
            if (id !== null && token !== null) {
                callback(id, token);
                console.log(`Promise init id and token success. [id: ${id}, token: ${token}]`);
            } else {
                console.log('Promise init id and token failed.');
            }
        }).catch(error => {
            console.log('Promise error, ', error);
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