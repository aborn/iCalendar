
export class ConfigHelper {
    private static insance: ConfigHelper;

    private constructor() { }

    static getInstance(): ConfigHelper {
        if (!ConfigHelper.insance) {
            ConfigHelper.insance = new ConfigHelper();
        }

        return ConfigHelper.insance;
    }


    public set(key: string, value: string): void {

    }

    public get(key: string, callback: (id: string, token: string) => void) {

    }
}