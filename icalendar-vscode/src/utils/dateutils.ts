
export function getSlotIndex(date: Date = new Date()): number {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    return hours * 60 * 2 + minutes * 2 + Math.floor(seconds / 30);
}

export function getDayInfo(date: Date = new Date()): string {
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let arr = [date.getFullYear(), ('0' + month).slice(-2), ('0' + day).slice(-2)];
    return arr.join("-");
}

export function isToday(dayInfo: string): boolean {
    let todayInfo = getDayInfo();
    return todayInfo === dayInfo;
}

export function formatTime(date: Date = new Date()): string {
    let arr = [('0' + date.getHours()).slice(-2), ('0' + date.getMinutes()).slice(-2), ('0' + date.getSeconds()).slice(-2)];
    return '[' + getDayInfo(date) + ' ' + arr.join(":") + "." + date.getMilliseconds() + "]";
}

export function timeSpent(startTime: number): any {
    let tMS = (Date.now() - startTime);  // millisecond (ms)
    let humanReadable;
    let tS = 0;
    let tM = 0;
    let tH = 0;
    let tD = 0;

    if (tMS < 1000) {
        humanReadable = `${tMS}ms`;
    } else {
        tS = Math.floor(tMS / 1000);   // seconds (s)
        if (tS < 60) {
            humanReadable = tS + 's';
        } else {
            tM = Math.floor(tS / 60); // minutes (m)
            if (tM < 60) {
                let leftSecond = tS - (tM * 60);
                humanReadable = tM + 'm' + leftSecond + 's';
            } else {
                tH = Math.floor(tM / 60);   // hours (h)
                let leftMinute = tM - tH * 60;                
                if (tH < 24) {
                    humanReadable = tH + 'h' + leftMinute + 'm';
                } else {
                    tD = Math.floor(tH / 24);
                    humanReadable = tD + 'd';
                }
            }
        }
    }

    return {
        humanReadable,
        tMS,          // ms
        tS,           // s
        tM,           // m
    };
}