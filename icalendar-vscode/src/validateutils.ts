export class ValidateUtils {
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