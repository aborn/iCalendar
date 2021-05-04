
export class UserInfo {

    // private logFile: string;
    private token: string | null;
    private id: string | null;

    constructor() {
        this.token = null;
        this.id = null;
    }

    public getToken(): string | null {
        return this.token;
    }

    public getId(): string | null {
        return this.id;
    }

    public print(): void {
        console.log(`[id = ${this.id}, token = ${this.token}]`);
    }

    public update(id: string, token: string): void {
        this.id = id;
        this.token = token;
    }

    public setToken(token: string): void {
        this.token = token;
    }

    public setId(id: string) :void {
        this.id = id;
    }
}