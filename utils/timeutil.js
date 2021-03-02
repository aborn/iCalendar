import {
  holidays,
  festival
} from './holidays'

const formatDay = (date, joinCons) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  var joinCons = joinCons;
  if (!joinCons) {
    joinCons = '/'; // 默认值
  }
  return [year, month, day].map(formatNumber).join(joinCons);
}

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatHourMinutes = date => {
  var date = new Date(date)
  const hour = date.getHours()
  const minute = date.getMinutes()
  return [hour, minute].map(formatNumber).join(":");
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const leftDayOfThisYear = () => {
  var now = new Date();
  var oneDay = 1000 * 60 * 60 * 24;
  var nextYearDay = new Date(now.getFullYear() + 1, 0, 1);
  var diffNextYear = (nextYearDay - now) + ((now.getTimezoneOffset() - nextYearDay.getTimezoneOffset()) * 60 * 1000);
  return Math.floor(diffNextYear / oneDay);
}

const dayOfThisYear = () => {
  var now = new Date();
  var start = new Date(now.getFullYear(), 0, 0);
  var diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
  var oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

const diffBetweenDate = (date1, date2, type) => {
  var dt1 = new Date(date1);
  var dt2 = new Date(date2);
  var unit = (1000 * 60 * 60 * 24);

  var diffValue = (Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()));
  var diffValueMinutes = dt2.getTime() - dt1.getTime();
  if (type == 'minute') {
    var result = Math.round(diffValueMinutes / 60000);
    return result;
  }
  return Math.floor(diffValue / unit);
}

const convertToReadable = (minutes) => {
  if (minutes < 60) {
    return minutes + '分钟';
  } else {
    var hour = Math.floor(minutes / 60);
    if (hour * 60 === minutes) {
      return hour + '小时'
    } else {
      var leftMinutes = minutes - (hour * 60);
      return hour + '小时' + leftMinutes + '分钟';
    }
  }
}

const getFestival = (lunarDate) => {
  var festivalLunar = festival.lunar[lunarDate.lMonth] && festival.lunar[lunarDate.lMonth][lunarDate.lDay]
  if (festivalLunar) {
    return festivalLunar.name;
  }
  var festivalSonar = festival.solar[lunarDate.cMonth] && festival.solar[lunarDate.cMonth][lunarDate.cDay]
  if (festivalSonar) {
    return festivalSonar.name;
  }
}

const lunarToReadable = (lunarDate) => {
  var fest = getFestival(lunarDate);
  if (fest) {
    return fest;
  }

  if (lunarDate.lDay === 1) {
    return lunarDate.IMonthCn;
  } else {
    return lunarDate.IDayCn;
  }
}

module.exports = {
  formatDay: formatDay,
  formatTime: formatTime,
  formatHourMinutes: formatHourMinutes,
  leftDayOfThisYear: leftDayOfThisYear,
  dayOfThisYear: dayOfThisYear,
  diffBetweenDate: diffBetweenDate,
  convertToReadable: convertToReadable,
  lunarToReadable: lunarToReadable
}