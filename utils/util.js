const timeutil = require('timeutil.js')

const StatusBackground = {
  'm': "grey",
  's': "white",
  'e': "black"
}

const StatusDesc = {
  'm': "进行中...",
  's': "开始",
  'e': "结束"
}

const TimeSegDesc = {
  "t0": '持续中...',
  "t15": '花费15分钟',
  "t30": '花费半个小时',
  "t60": '花费1个小时',
  "t120": '花费2个小时',
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
const stepValue = (value, isToday) => {
  var time = new Date();
  var hour = time.getHours();
  if (!isToday) {
    return value;
  } else if (value <= hour) {
    return value;
  } else {
    return undefined;
  }
}
const transToLevel = (dayStaticByHour, isToday) => {
  return dayStaticByHour.map((item, index) => {
    return {
      value: item,
      level: transToLevelValue(item),
      stepValue: stepValue(index, isToday)
    }
  })
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

const getTime = (date) => (date instanceof Date ? date.getTime() : date);

const getDate = (date) => (date instanceof Date ? date : new Date(date));

module.exports = {
  getStoregeLastDayInfo: getStoregeLastDayInfo,
  readTimeDesc: readTimeDesc,
  transToLevel: transToLevel,
  initCellData: initCellData,
  isToday: isToday
}