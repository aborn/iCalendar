
export function getSlotIndex(date: Date = new Date()): number {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    return hours * 60 * 2 + minutes * 2 + Math.floor(seconds / 30);
}

export function getDayInfo(date: Date = new Date()): string {
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let arr = [date.getFullYear(), month < 10 ? '0' + month : month, day < 10 ? '0' + day : day];
    return arr.join("-");
}

export function isToday(dayInfo: string): boolean {
    let todayInfo = getDayInfo();
    return todayInfo === dayInfo;
}