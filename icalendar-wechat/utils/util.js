const timeutil = require('timeutil.js')
const app = getApp()

// https://flaviocopes.com/rgb-color-codes/
const DayCicleColor = {
  '0': "#FAF5E6", // 0h
  '1': "#FFD400", // 0~1h
  '2': "#FBC900", // 1~2h
  '3': "#FAB32A", // 2~4h
  '4': "#262626", // 4~6h
  '5': "#000000", // >6h
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

// 每个小时的阶梯分布，css见webx-hcell
const transToLevelValue = (value) => {
  if (value == 0) {
    return 0;
  } else if (value <= 2 * 5) { // 0～5分钟
    return 1;
  } else if (value <= 2 * 10) { // 5～10分钟
    return 2;
  } else if (value <= 2 * 30) { // 10～30分钟
    return 3;
  } else { // 30分钟以上
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
  if (second == 0) {
    level = 0;
  } else if (second > 0 && second < 3600) {
    level = 1;
  } else if (hour < 2) {
    level = 2;
  } else if (hour < 4) {
    level = 3
  } else if (hour < 6) {
    level = 4
  } else if (hour >= 6) {
    level = 5;
  } else {
    level = 0
  }
  return DayCicleColor[level];
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

export function getDate(date) {
  return (date instanceof Date ? date : new Date(date))
};

const formatHoliday = (holidays) => {
  var holidaysFormatData = {};
  const year = holidays.year;
  holidays.holidays.map((item) => {
    holidaysFormatData[year + "-" + item] = 1 // 工作日
  })
  holidays.workdays.map((item) => {
    holidaysFormatData[year + "-" + item] = 2 // 休息日
  })
  return holidaysFormatData;
}

const updateTabBarTipsInfo = () => {
  var id = app.globalData.config.id;
  var token = app.globalData.config.token;
  var testConfig = app.globalData.TestConfig;
  if (id === testConfig.id && token === testConfig.token) {
    console.log('is test account, show dot...')
    wx.showTabBarRedDot({
      index: 1
    })
  } else {
    console.log('not test account, hide dot...')
    wx.hideTabBarRedDot({
      index: 1
    })
  }
}

module.exports = {
  readTimeDesc: readTimeDesc,
  transToLevel: transToLevel,
  initCellData: initCellData,
  isToday: isToday,
  getDayFullValue: getDayFullValue,
  getCodeDayColor: getCodeDayColor,
  getDate: getDate,
  isFuture: isFuture,
  formatHoliday: formatHoliday,
  updateTabBarTipsInfo: updateTabBarTipsInfo
}