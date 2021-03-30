// pages/read/home/home.js
const util = require('../../utils/util.js')
const timeUtil = require('../../utils/timeutil.js')
import convertSolarLunar from '../../utils/lunar'
const app = getApp()

Component({
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
    holidayTips: {}
  },
  methods: {
    showCodingTime(date) {
      var self = this;
      var isToday = util.isToday(date);
      var dayInfo = util.getDayFullValue(date);
      var isFuture = util.isFuture(date);
      var type = isToday ? 1 : (isFuture ? 2 : 0);
      if (isFuture) {
        self.setData({
          codeTime: '',
          dayStaticByHour: util.transToLevel(util.initCellData(), type),
          codeDayColor: util.getCodeDayColor(0)
        })
        return
      }

      var url = 'https://aborn.me/webx/getUserAction?token=' + app.getToken() + '&day=' + dayInfo
      console.log('url=' + url);

      // 获取写代码的时间信息
      wx.request({
        url: url,
        data: {},
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
            console.log('暂无编程数据。')
          } else {
            self.setData({
              codeTime: '未知-501',
              dayStaticByHour: util.transToLevel(util.initCellData(), type),
              codeDayColor: util.getCodeDayColor(0)
            })
            console.log('获取数据失败。')
          }
        }
      })
    },
    showMonthHolidays(month, yearCache) {
      // month的格式为：2021-02
      const holidaysTypeCache = yearCache || wx.getStorageSync("year-" + month.substring(0, 4))
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

      if (util.isFuture(date)) {
        return;
      }
      var url = 'https://aborn.me/webx/getMonthActionStatus?token=' + app.getToken() + '&month=' + month
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
    loadYearHolidays(year, month) {
      var self = this;
      // 获取这一年的假日信息并缓存下来 （每次页面加载的时候请求一次，每天请求一次）      
      const key = "year-" + year;
      var dataCache = wx.getStorageSync(key);
      if (dataCache) {
        var today = new Date();
        const todayStr = today.getFullYear() + "-" + today.getMonth() + "-" + today.getDate();
        const cacheTime = util.getDate(dataCache.time)
        const cacheDayStr = cacheTime.getFullYear() + "-" + cacheTime.getMonth() + "-" + cacheTime.getDate()
        if (month) {
          self.showMonthHolidays(month, dataCache)
        }

        if (cacheDayStr === todayStr) {
          // 同一天不需要重新请求
          return;
        }
      }

      var url = 'https://aborn.me/webx/conf/loadYearHolidays?token=' + app.getToken() + '&year=' + year
      console.log('url=' + url);
      wx.request({
        url: url,
        data: {},
        success: function (res) {
          console.log(res);
          if (res.data.code === 200) {
            console.log(year + '有假期数据。')
            var data = res.data.data;
            data.time = new Date();

            wx.setStorage({
              key: key,
              data: data,
            })

            self.showMonthHolidays(month, data)
          } else if (res.data.code === 201) {
            console.log('暂无这年的假期数据。')
          } else {
            console.log('服务器异常。')
          }
        }
      })
    },
    afterSelectDate(e) {
      // 详情数据对象
      var date = e.detail;
      this.showCodingTime(date);
    },
    changeMonth(e) {
      this.setData({
        tips: {}
      })
      var date = new Date(e.detail);
      var month = util.getDayFullValue(date, true)
      this.showTips(month)
      this.showMonthHolidays(month)
    }
  },

  /**
   * 页面加载完成执行
   */
  lifetimes: {
    ready() {
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      this.setData({
        subtitle: year + "年" + month + "月"
      })
      var monthFormat = util.getDayFullValue(date, true);
      this.showCodingTime(date);
      this.showTips(monthFormat);
      this.loadYearHolidays(year, monthFormat);      
    }
  },
  attached() {
    // 第二种方式通过组件的生命周期函数执行代码
  },
})