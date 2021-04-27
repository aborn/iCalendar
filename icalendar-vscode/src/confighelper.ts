import * as fs from "fs";
import * as os from 'os';
import * as path from 'path';
import { UserInfo } from "./userinfo";

export class ConfigHelper {
    private static insance: ConfigHelper;

    private configFile: string;
    private userInfo: UserInfo;

    private constructor() {
        this.configFile = ConfigHelper.getConfigFile();
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
        console.log(`key = ${key}, value = ${value}`);

        // update memo instance first.
        if ('token' === key) {
            this.userInfo.setToken(value);
        } else if ('id' === key) {
            this.userInfo.setId(value);
        }

        // TODO than update config file.
    }

    public getTokenAsync(callback: (_err: string, defaultVal: string) => void) {
        let token = this.getToken();
        if (token === null) {
            this.updateIdAndTokenFromConfigFile();
            token = '';
        }
        callback('', token);
    }

    public getToken(): string | null {
        return this.userInfo.getToken();
    }

    public isLegal(): boolean {
        return true;
    }

    // TODO: User command setting for token config.
    public config(id: string, token: string): void {
        let contents: string[] = [];
        if (id && id.trim.length > 0 && token && token.trim.length > 0) {
            contents.push("id = " + id);
            contents.push("token = " + token);

            fs.writeFile(ConfigHelper.getConfigFile(), contents.join('\n'), err => {
                if (err) {
                    throw err;
                };
            });
        }
    }

    private read(callback: (id: string, token: string) => void): void {
        fs.readFile(ConfigHelper.getConfigFile(), function (err, data) {
            if (err) {
                return console.error(err);
            }
            //console.log("Asynchronous read: " + data.toString());

            var id = null;
            var token = null;

            let lines = data.toString().split('\n');
            for (var i = 0; i < lines.length; i++) {
                let line = lines[i];

                if (line.indexOf('=') >= 0) {
                    let parts = line.split('=');
                    let key = parts[0].trim();
                    let value = parts[1].trim();
                    if (key === 'token') {
                        token = value;
                    }
                    if (key === 'id') {
                        id = value;
                    }
                }
            }

            if (id !== null && token !== null) {
                callback(id, token);
                console.log(`init id and token success. [id: ${id}, token: ${token}]`);
            } else {
                console.log('init id and token failed.');
            }
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