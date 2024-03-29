export const ROW_HEIGHT = 64;      // 默认每个有的高（默认为5排）
export const ROW_HEIGHT_6ROW = 53; // 当一个月的date有6排时，每行的高
export function formatMonthTitle(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  return `${date.getFullYear()}年${date.getMonth() + 1}月`;
}
export function compareMonth(date1, date2) {
  if (!(date1 instanceof Date)) {
    date1 = new Date(date1);
  }
  if (!(date2 instanceof Date)) {
    date2 = new Date(date2);
  }
  const year1 = date1.getFullYear();
  const year2 = date2.getFullYear();
  const month1 = date1.getMonth();
  const month2 = date2.getMonth();
  if (year1 === year2) {
    return month1 === month2 ? 0 : month1 > month2 ? 1 : -1;
  }
  return year1 > year2 ? 1 : -1;
}
export function compareDay(day1, day2) {
  if (!(day1 instanceof Date)) {
    day1 = new Date(day1);
  }
  if (!(day2 instanceof Date)) {
    day2 = new Date(day2);
  }
  const compareMonthResult = compareMonth(day1, day2);
  if (compareMonthResult === 0) {
    const date1 = day1.getDate();
    const date2 = day2.getDate();
    return date1 === date2 ? 0 : date1 > date2 ? 1 : -1;
  }
  return compareMonthResult;
}
export function getDayByOffset(date, offset) {
  date = new Date(date);
  date.setDate(date.getDate() + offset);
  return date;
}
export function getPrevDay(date) {
  return getDayByOffset(date, -1);
}
export function getNextDay(date) {
  return getDayByOffset(date, 1);
}
export function calcDateNum(date) {
  const day1 = new Date(date[0]).getTime();
  const day2 = new Date(date[1]).getTime();
  return (day2 - day1) / (1000 * 60 * 60 * 24) + 1;
}
export function copyDates(dates) {
  if (Array.isArray(dates)) {
    return dates.map((date) => {
      if (date === null) {
        return date;
      }
      return new Date(date);
    });
  }
  return new Date(dates);
}
export function getMonthEndDay(year, month) {
  return 32 - new Date(year, month - 1, 32).getDate();
}
export function getMonths(minDate, maxDate) {
  const months = [];
  const cursor = new Date(minDate);
  cursor.setDate(1);
  do {
    months.push(cursor.getTime());
    cursor.setMonth(cursor.getMonth() + 1);
  } while (compareMonth(cursor, maxDate) !== 1);
  return months;
}
export function changeType(preIndex, currentIndex) {
  if ((preIndex + 1) % 3 === currentIndex) {
    return "next"; // 表示右滑，切到下个月
  } else {
    return "prev"; // 表示左滑，切到上个月
  }
}

export function getTargetFrameIndex(currentIndex, eventType) {
  if (eventType === "cur") {
    return currentIndex;
  } else if (eventType === "next") { // 右滑动
    return (currentIndex + 1) % 3
  } else {
    return ((currentIndex -1) + 3) % 3
  }
}

export function getChangeType(currentDate, targetDate) {
  var currentDateD = getDate(currentDate);
  var targetDateD = getDate(targetDate);
  if (currentDateD.getFullYear() === targetDateD.getFullYear() &&
    currentDateD.getMonth() === targetDateD.getMonth()) {
    return "cur" // 表示同一个月，不滑动
  } else if (targetDateD.getTime() > currentDateD.getTime()) {
    return "next" // 表示右滑
  } else {
    return "prev" // 表示左滑
  }
}

export function getPrevMonthInfo(date = {}) {
  const prevMonthInfo =
    Number(date.month) >= 1 ? {
      year: +date.year,
      month: Number(date.month) - 1
    } : {
      year: Number(date.year) - 1,
      month: 11
    }
  return prevMonthInfo
}
export function getNextMonthInfo(date = {}) {
  const nextMonthInfo =
    Number(date.month) < 11 ? {
      year: +date.year,
      month: Number(date.month) + 1
    } : {
      year: Number(date.year) + 1,
      month: 0
    }
  return nextMonthInfo
}

export function getTargetMonthFirstDate(cDate, eventType) {
  var currentDateInfo = {
    year: cDate.getFullYear(),
    month: cDate.getMonth()
  }
  var targetDateInfo = "next" === eventType ? getNextMonthInfo(currentDateInfo) : getPrevMonthInfo(currentDateInfo);
  return new Date(targetDateInfo.year, targetDateInfo.month, 1);
}

export function isToday(d) {
  var today = new Date();
  var date = getDate(d);
  return today.getFullYear() === date.getFullYear() &&
    today.getMonth() === date.getMonth() &&
    today.getDate() === date.getDate()
}

export function getDate(date) {
  return (date instanceof Date ? date : new Date(date))
};

// 获取一个月有几排，传入为当月的任何一天
export function getMonthWeek(d) {
  let date = new Date(getDate(d));
  let currentDate = date.getDate();
  if (currentDate !== 1) {
    date.setDate(1)
  }

  let offset = date.getDay();
  date.setMonth(date.getMonth() + 1)
  date.setDate(0)
  let countOfMonthDays = date.getDate();
  return Math.ceil((countOfMonthDays + offset) /7)
}