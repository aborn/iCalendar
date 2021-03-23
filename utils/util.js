const timeutil = require('timeutil.js')

// https://flaviocopes.com/rgb-color-codes/
const DayCicleColor = {
  '0h': "#edf7ff", // 0h
  'p0h': "#98FB98", // 0~1h
  '1h': "#90EE90", // 1~2h
  '2h': "#32CD32",
  '3h': "#00FF00",
  '5h': "#228B22",
  '8h': "#008000",
  '12h': "#006400"
}

const getStoregeLastDayInfo = () => {
  var lastDayInfo = wx.getStorageSync('lastdayinfo');
  if (lastDayInfo == null) {
    return null;
  } else {
    var end = lastDayInfo.end;
    if (end == null) {
      return null;
    } else {
      var time = new Date(end);
      var lastDate = new Date();
      var now = new Date();
      lastDate.setDate(now.getDate() - 1);
      var lastDateInfo = timeutil.formatDay(lastDate);
      var storeInfo = timeutil.formatDay(time);
      if (lastDateInfo === storeInfo) {
        return lastDayInfo;
      } else {
        return null;
      }
    }
  }
}

const readTimeDesc = (second) => {
  var hour = Math.floor(second / 3600);
  var minute = second / 60.0;
  if (hour < 1) {
    return minute + '分钟';
  } else {
    var leftMinutes = minute - (hour * 60)
    return hour + '小时' + leftMinutes + '分钟'
  }
}

const transToLevelValue = (value) => {
  if (value <= 0) {
    return 0;
  } else if (value <= 2 * 5) { // 5分钟
    return 1;
  } else if (value <= 2 * 20) {
    return 2;
  } else if (value <= 2 * 40) {
    return 3;
  } else {
    return 4;
  }
}
const stepValue = (value, type) => {
  var time = new Date();
  var hour = time.getHours();
  if (!type || type === 0) {
    return value;
  } else if (type === 1 && value <= hour) {
    return value;
  } else {
    return undefined;
  }
}

// type 不传值或者传0 表示过去, type = 1表示今天, type = 2表示未来
const transToLevel = (dayStaticByHour, type) => {
  return dayStaticByHour.map((item, index) => {
    return {
      value: item,
      level: transToLevelValue(item),
      stepValue: stepValue(index, type)
    }
  })
}

const getCodeDayColor = (second) => {
  var level = 0
  var hour = Math.floor(second / 3600);
  if (hour >= 12) { // 1 2 3 5 8 12
    level = 12
  } else if (hour >= 8) {
    level = 8
  } else if (hour >= 5) {
    level = 5
  } else if (hour >= 3) {
    level = 3
  } else if (hour >= 2) {
    level = 2
  } else if (hour >= 1) {
    level = 1
  } else if (second > 0) {
    level = "p0"
  } else {
    level = 0
  }
  return DayCicleColor[level + "h"];
}

const initCellData = () => {
  return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
}

const isToday = (date) => {
  var today = new Date();
  var dateInput = getDate(date);
  return (dateInput.getFullYear() === today.getFullYear() &&
    dateInput.getMonth() === today.getMonth() &&
    dateInput.getDate() === today.getDate())
}

const isFuture = (date) => {
  var today = new Date();
  var dateInput = getDate(date);
  return dateInput > today;
}

const getDayFullValue = (date, isMonth) => {
  date = getDate(date);

  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();

  if (month < 10) {
    month = '0' + month;
  }
  if (day < 10) {
    day = '0' + day;
  }
  return isMonth ? year + '-' + month : year + '-' + month + '-' + day;
}

const getTime = (date) => (date instanceof Date ? date.getTime() : date);

const getDate = (date) => (date instanceof Date ? date : new Date(date));

const formatHoliday = (holidays) => {
  var holidaysFormatData = {};
  const year = holidays.year;
  holidays.holidays.map((item) => {
    holidaysFormatData[year + "-" + item] = 1   // 工作日
  })
  holidays.workdays.map((item) => {
    holidaysFormatData[year + "-" + item] = 2   // 休息日
  })
  return holidaysFormatData;
}

module.exports = {
  getStoregeLastDayInfo: getStoregeLastDayInfo,
  readTimeDesc: readTimeDesc,
  transToLevel: transToLevel,
  initCellData: initCellData,
  isToday: isToday,
  getDayFullValue: getDayFullValue,
  getCodeDayColor: getCodeDayColor,
  getDate: getDate,
  isFuture: isFuture,
  formatHoliday: formatHoliday,
}