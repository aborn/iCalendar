// pages/read/home/home.js
const util = require('../../utils/util.js')
const timeUtil = require('../../utils/timeutil.js')
import {
  nationalholidays
} from '../../cache/nationalholidays.js'
import convertSolarLunar from '../../utils/lunar'
import {
  isToday
} from '../../components/icalendar/utils'
const app = getApp()

Page({
  data: {
    codeDayColor: "#FAF5E6",
    color: '#FFD400',
    frameIndex: 1,
    token: app.globalData.config.token,
    defaultDate: new Date().getTime(), // 默认选中为今天
    dayStaticByHour: [{
        value: 0,
        level: 0
      },
      {
        value: 0,
        level: 0
      },
      {
        value: 0,
        level: 0
      },
      {
        value: 0,
        level: 0
      },
      {
        value: 0,
        level: 0
      },
      {
        value: 0,
        level: 0
      },
      {
        value: 0,
        level: 0
      },
      {
        value: 0,
        level: 0
      },
      {
        value: 0,
        level: 0
      },
      {
        value: 0,
        level: 0
      },
      {
        value: 0,
        level: 0
      },
      {
        value: 0,
        level: 0
      },
      {
        value: 0,
        level: 0
      },
      {
        value: 0,
        level: 0
      },
      {
        value: 0,
        level: 0
      },
      {
        value: 0,
        level: 0
      },
      {
        value: 0,
        level: 0
      },
      {
        value: 0,
        level: 0
      },
      {
        value: 0,
        level: 0
      },
      {
        value: 0,
        level: 0
      },
      {
        value: 0,
        level: 0
      },
      {
        value: 0,
        level: 0
      },
      {
        value: 0,
        level: 0
      },
      {
        value: 0,
        level: 0
      },
    ],
    dayStaticHint: [{
        value: 0
      },
      {
        value: 3
      },
      {
        value: 6
      },
      {
        value: 9
      },
      {
        value: 12
      },
      {
        value: 15
      },
      {
        value: 18
      },
      {
        value: 21
      },
      {
        value: 23
      },
    ],
    formatter: (day) => {
      const year = day.date.getFullYear();
      const month = day.date.getMonth() + 1;
      const date = day.date.getDate();
      var dateInfo = convertSolarLunar.solar2lunar(year, month, date);
      var lunaDetail = timeUtil.lunarToReadable(dateInfo);

      if (day.date.getTime() > new Date().getTime()) {
        day.type = 'disabled'
      }

      const dayInWeek = util.getDate(day.date).getDay();
      if (dayInWeek == 6 || dayInWeek == 0) {
        day.dayType = 'holiday'
      }

      if (dateInfo.Term) {
        day.bottomStyle = 'lunar-term'
      } else if (day.type !== 'disabled') {
        day.bottomStyle = 'normal-term'
      }

      day.bottomInfo = dateInfo.Term ? dateInfo.Term : lunaDetail; // term为24节气
      return day;
    },
    tips: {},
    holidayTips: {},
    isToday: true,
  },
  showCodingTime(date) {
    var self = this;
    var isToday = util.isToday(date);
    var dayInfo = util.getDayFullValue(date);
    var isFuture = util.isFuture(date);
    var type = isToday ? 1 : (isFuture ? 2 : 0);
    self.setData({
      codeTime: isFuture ? '' : '加载中...',
      dayStaticByHour: util.transToLevel(util.initCellData(), type),
      codeDayColor: util.getCodeDayColor(0),
      isToday
    })

    if (isFuture) {
      return
    }
    var url = 'https://cp.popkit.org/api/v1/codepulse/admin/getUserAction?token=' + app.getToken() + '&day=' + dayInfo
    console.log('url=' + url);

    // 获取写代码的时间信息
    wx.request({
      url: url,
      data: {},
      timeout: 5000,
      success: function (res) {
        console.log(res);
        if (res.data.code === 200) {
          var codeTimeSecond = res.data.data.codeTime;
          self.setData({
            codeTimeDesc: res.data.data.desc,
            dayStaticByHour: util.transToLevel(res.data.data.dayStaticByHour, type),
            codeTime: util.readTimeDesc(codeTimeSecond),
            codeDayColor: util.getCodeDayColor(codeTimeSecond),
          })
        } else if (res.data.code === 201) {
          self.setData({
            codeTime: '0分钟',
            dayStaticByHour: util.transToLevel(util.initCellData(), type),
            codeDayColor: util.getCodeDayColor(0)
          })
        } else if (res.data.code === 204 || res.data.code === 205) {
          self.setData({
            codeTime: res.data.code === 204 ? 'token非法!' : 'token已过期!',
            dayStaticByHour: util.transToLevel(util.initCellData(), type),
            codeDayColor: util.getCodeDayColor(0)
          })
        } else {
          self.setData({
            codeTime: res.data.code === 501 ? '用户不存在' : '未知错误',
            dayStaticByHour: util.transToLevel(util.initCellData(), type),
            codeDayColor: util.getCodeDayColor(0)
          })
          console.log('获取数据失败。')
        }
      },
      fail: function () {
        self.setData({
          codeTime: '无网络服务！',
          dayStaticByHour: util.transToLevel(util.initCellData(), type),
          codeDayColor: util.getCodeDayColor(0)
        })
      },
      complete(e) {
        wx.stopPullDownRefresh();
      }
    })
  },
  showMonthHolidays(month, yearCache) {
    // month的格式为：2021-02
    const year = month.substring(0, 4);
    const holidaysTypeCache = nationalholidays[year];
    var holidayTips = {};

    if (holidaysTypeCache) {
      const holidaysType = util.formatHoliday(holidaysTypeCache)
      for (var i = 0; i < 31; i++) {
        var j = i + 1;
        var dayinfo = month + '-' + (j < 10 ? '0' + j : j);
        var type = holidaysType[dayinfo];
        if (type && type > 0) {
          holidayTips[i] = type;
        }
      }
    }

    this.setData({
      holidayTips
    })
  },
  showTips(month) {
    var self = this;
    var date = new Date();
    date.setFullYear(month.substring(0, 4))
    date.setMonth(month.substring(5, 7) - 1)
    date.setDate(1)

    // 初始化
    this.setData({
      tips: {}
    })

    if (util.isFuture(date)) {
      return;
    }
    var url = 'https://cp.popkit.org/api/v1/codepulse/admin/getMonthActionStatus?token=' + app.getToken() + '&month=' + month
    console.log('url=' + url);

    // 获取每个月的代码提示信息
    wx.request({
      url: url,
      data: {},
      success: function (res) {
        console.log(res);
        if (res.data.code === 200) {
          self.setData({
            tips: res.data.data.dayStatic
          })
        } else if (res.data.code === 201) {
          console.log('暂无本月提示数据。')
        } else {
          console.log('获取月度提示数据失败。')
        }
      }
    })
  },
  afterSelectDate(e) {
    // 两种情况会触发：1. 手工选种一个日期时； 2. 切换月时
    var date = e.detail;
    this.showCodingTime(date);
  },
  onChangeMonth(e) {
    var date = new Date(e.detail);
    var month = util.getDayFullValue(date, true)
    this.showTips(month)
    this.showMonthHolidays(month)
  },
  onChangeYear(e) {
    const {
      current,
      target
    } = e.detail;
    console.log('changeYear event. current=' + current + ', target=' + target)
  },
  onReady() {
    var date = new Date();
    var month = util.getDayFullValue(date, true)
    this.showMonthHolidays(month)
    util.updateTabBarTipsInfo();
    this.show()
  },
  onTabItemTap(item) {
    if (item.index == 0) {
      this.show()
    }
  },
  onPullDownRefresh() {
    console.log('onPullDownRefresh call')
    this.show();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 500)
  },
  show() {
    const calInstance = this.selectComponent('#calendarinstanace');
    if (calInstance != null) {
      const {
        currentDate
      } = calInstance.data;
      if (isToday(currentDate)) {
        var date = new Date();
        var monthFormat = util.getDayFullValue(date, true);
        this.showCodingTime(date);
        this.showTips(monthFormat);
      }
    }
  }
})