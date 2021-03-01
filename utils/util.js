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

const getLastDayInfo = todayinfo => {
  const start = todayinfo.start;
  const end = todayinfo.end;
  const now = new Date();
  const current = timeutil.formatDay(now);
  var lastDate = new Date();
  lastDate.setDate(now.getDate() - 1);
  console.log('lastinfo ' + lastDate + 'end' + end)
  if (!start) {
    return null;
  } else {
    var startInfo = timeutil.formatDay(new Date(start));
    var lastDateInfo = timeutil.formatDay(lastDate);
    if (current === startInfo) {
      return null;
    } else if (lastDateInfo === startInfo) {
      // 说明是今天第一次打开
      return {
        "end": end,
        "start": start,
      }
    } else {
      return null;
    }
  }
}

const updateTodayInfo = todayinfo => {
  const start = todayinfo.start;
  const now = new Date();
  const current = timeutil.formatDay(now);

  if (!start) {
    return {
      "start": now,
      "end": now
    }
  } else {
    var startInfo = timeutil.formatDay(new Date(start));
    if (current === startInfo) {
      return {
        "start": new Date(start),
        "end": now
      }
    } else {
      return {
        "start": now,
        "end": now
      }
    }
  }
}

const getTimeSegType = segTye => {
  return segTye ? (TimeSegDesc[segTye] || '未知') : null;
}

const getColor = (type, action) => {
  var color = 'grey';
  if ('工作' === type) {
    color = 'brown';
    if ('写代码' === action) {
      color = 'green';
    }
  } else if ('生活' === type) {
    color = 'cyan';
  } else if ('其他' === type && '玩手机' === action) {
    color = 'orange';
  }
  return color;
}

const searchStart = (record, index, originArray) => {
  var result = null;
  if (!originArray) {
    return null;
  }

  var length = originArray.length;
  if (record.status == 'e') {
    for (var i = index + 1; i < length; i++) {
      if (originArray[i].type == record.type &&
        originArray[i].action == record.action) {
        if (originArray[i].status == 's') {
          return originArray[i];
        }
      } else {
        return null;
      }
    }
  }
  return result;
}

const getRecordItem = (record, index, originArray) => {
  var timeStr = timeutil.formatHourMinutes(new Date(record.time));
  var color = getColor(record.type, record.action);
  var previousRecord = searchStart(record, index, originArray);
  /**if (previousRecord) {
    console.log("### start")
    console.log(record);
    console.log(previousRecord)
    console.log("### end")
  }**/
  return {
    "time": timeStr,
    "event": buildEvent(record, previousRecord),
    "color": color,
    "status": record.status,
    "statusDesc": StatusDesc[record.status],
    "statusBg": StatusBackground[record.status],
  }
}

const buildEvent = (record, previousRecord) => {
  var desc = getTimeSegType(record.timeSegType);
  if (record.status === 's') {desc = '';}  // 如果只是开始事件，那就不显示时间
  desc = (desc == null || desc == '' || '未知' === desc) ? '' : ' : ' + desc;
  var event = record.type + '-' + record.action + desc;
  if (previousRecord && record.status == 'e') {
    var cTime = new Date(record.time);
    var pTime = new Date(previousRecord.time)
    event = event + '，耗时：' + timeutil.convertToReadable(timeutil.diffBetweenDate(pTime, cTime, 'minute'));
  }
  return event;
}

const humanReadable = (time) => {
  var lastDate = new Date();
  lastDate.setDate(lastDate.getDate() - 1);
  var formatLastDay = timeutil.formatDay(lastDate);
  lastDate.setDate(lastDate.getDate() - 1);
  var formatDayBeforeYestday = timeutil.formatDay(lastDate);
  var formatTime = timeutil.formatDay(time);
  if (formatLastDay === formatTime) {
    return "昨天";
  } else if (formatDayBeforeYestday === formatTime) {
    return "前天";
  } else {
    return timeutil.formatDay(time, '-');
  }
}
const formatTimeLineTodayBefore = records => {
  // 显示今天以前的，不包括今天
  var filterRecords = filterRecordsTodayOrOld(records, false);
  var result = {};
  filterRecords.map((item, index) => {
    var recordTime = timeutil.formatDay(new Date(item.time), '-');
    var current = result[recordTime] || {};
    current.dateInfo = humanReadable(new Date(item.time));
    if (!current.data) {
      current.data = [];
    }
    current.data.push(getRecordItem(item, index, filterRecords));
    result[recordTime] = current;
  })

  var resultArr = [];
  for (var i = 1; i < 8; i++) {
    var varDate = new Date();
    varDate.setDate(varDate.getDate() - i);
    var current = result[timeutil.formatDay(varDate, '-')]
    if (current) {
      resultArr.push(current);
    }
  }
  return resultArr;
}

// 过滤
const filterRecordsTodayOrOld = (records, onlytoday) => {
  return records.filter(item => {
    var nowDate = new Date();
    var days = dateDiffIndays(item.time, nowDate);
    return onlytoday ? days === 0 : days !== 0;
  })
}

const formatTimeLine = records => {
  var filterRecords = filterRecordsTodayOrOld(records, true);
  return filterRecords.map((record, index) => {
    return getRecordItem(record, index, filterRecords);
  })
}

const dateDiffIndays = (date1, date2) => {
  var dt1 = new Date(date1);
  var dt2 = new Date(date2);
  return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24));
}

const readTimeDesc = (second) => {
  var hour = Math.floor(second / 3600);
  var minute = second / 60.0;
  console.log('hour:' + hour + ', minute:' + minute)
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
  } else if (value <= 2*5) {   // 5分钟
    return 1;
  } else if (value <= 2*20) {
    return 2;
  } else if (value <= 2*40) {
    return 3;
  } else {
    return 4;
  }
}
const transToLevel = (dayStaticByHour) => {
  return dayStaticByHour.map((item, _) => {
    return {value: item, level: transToLevelValue(item)}
  })
}

const initCellData = () => {
  return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
}

module.exports = {
  updateTodayInfo: updateTodayInfo,
  getTimeSegType: getTimeSegType,
  formatTimeLine: formatTimeLine,
  getLastDayInfo: getLastDayInfo,
  getStoregeLastDayInfo: getStoregeLastDayInfo,
  dateDiffIndays: dateDiffIndays,
  formatTimeLineTodayBefore: formatTimeLineTodayBefore,
  readTimeDesc: readTimeDesc,
  transToLevel: transToLevel,
  initCellData: initCellData
}