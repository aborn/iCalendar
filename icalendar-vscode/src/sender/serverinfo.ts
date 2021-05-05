
export interface ServerInfo {
    baseURL: string;
    token: string | null;
    timeout: number;
};

export const LOCAL_SERVER: ServerInfo = {
    baseURL: 'http://127.0.0.1:8080/webx/',
    token: '0x4af97337',    // this token only for test.
    timeout: 1000
};

export const REMOTE_SERVER: ServerInfo = {
    baseURL: 'https://aborn.me/webx/',
    token: '0x4af97337',
    timeout: 2000
};