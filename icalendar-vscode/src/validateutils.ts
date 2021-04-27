export class ValidateUtils {
    public static validateToken(token: string): string {
        const err = 'Invalid token... check WeChat miniprogram [i极客日历] for your key';
        if (!token) {
            return err;
        }

        const re = new RegExp(
            '^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$',
            'i',
        );
        if (!re.test(token)) {
            return err;
        }

        // TODO: token check as webx.
        return '';
    }
}