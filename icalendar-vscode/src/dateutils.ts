
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