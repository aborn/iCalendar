export class ValidateUtils {

    public static validate(key: string, value: string) {
        return 'token' === key ? ValidateUtils.validateToken(value) : ValidateUtils.validateId(value);
    }

    public static validateId(id: string): string {
        const err = 'Invalid id... check WeChat miniprogram [i极客日历] for your id';
        if (!id) {
            return err;
        }

        const re = new RegExp(
            // 合法的id：字母、数字、下划线且长度为[3，128]之间
            '^[a-zA-Z0-9]{3,128}$', 'i');
        if (!re.test(id)) {
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

        // TODO: token check as webx.
        return '';
    }
}