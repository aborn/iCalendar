import { LEVELMAP } from '../common/consts';
export class ValidateUtils {

    public static isLegalFileName(fileName: string): boolean {
        if (fileName
            && fileName.trim().startsWith("extension-output")
            && (!fileName.trim().includes("."))) {
            return false;
        }

        return true;
    }

    public static validate(key: string, value: string) {
        return 'token' === key ? ValidateUtils.validateToken(value) :
            ValidateUtils.validateOthers(key, value);
    }

    public static validateFn(key: string): any {
        if (key === 'token') {
            return ValidateUtils.validateToken;
        } else {
            return (value: string) => {
                return ValidateUtils.validateOthers(key, value);
            };
        }
    }

    public static validateOthers(key: string, value: string): string {
        const err = 'level' === key ?
            `Invalid ${key}, log level can only be one of: ${Object.keys(LEVELMAP).join(',')}` :
            `Invalid ${key}... check WeChat miniprogram [i极客日历] for your ${key}`;
        if (!value) {
            return err;
        }

        const re = new RegExp(
            // 合法的id：字母、数字、下划线且长度为[3，128]之间
            '^[a-zA-Z0-9]{3,128}$', 'i');
        if (!re.test(value)) {
            return err;
        }

        if ('level' === key && LEVELMAP[value] === undefined) {
            return err;
        }

        return '';
    }

    public static validateToken(token: string): string {
        const err = 'Invalid token... check WeChat miniprogram [i极客日历] for your token';
        if (!token) {
            return err;
        }

        const re = new RegExp(
            // 字母、数字、下划线且长度为10
            '^[a-zA-Z0-9]{10,10}$', 'i');
        if (!re.test(token)) {
            return err;
        }

        // 以0x开头
        const re2 = new RegExp('^0x', 'i');
        if (!re2.test(token)) {
            return err;
        }

        return '';
    }
}