// pages/read/home/home.js
const util = require('../../utils/util.js')
const timeUtil = require('../../utils/timeutil.js')
import convertSolarLunar from '../../utils/lunar'
const app = getApp()

Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    codeDayColor: "#07c160",
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
      if (dateInfo.Term) {
        day.bottomStyle = 'lunar-term'
      }
      if (day.date.getTime() > new Date().getTime()) {
        day.type = 'disabled'
      }
      day.bottomInfo = dateInfo.Term ? dateInfo.Term : lunaDetail; // term为24节气
      return day;
    },
    tips: {}
  },
  methods: {
    hcellClickEvent(e) {
      const {
        value,
        hour
      } = e.currentTarget.dataset
      var title = "编程时间" + (value * 0.5) + "分钟";
      if (value > 0) {
        wx.showToast({
          title,
          icon: 'none'
        });
      }
    },
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

      console.log('isFuture=' + isFuture + ', type=' + type)
      // var tips = this.data.tips;
      // var day = util.getDate(date).getDate();
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
    showTips(month) {
      var self = this;
      var url = 'https://aborn.me/webx/getMonthActionStatus?token=' + app.getToken() + '&month=' + month
      console.log('url=' + url);

      // 获取每个月的代码提示信息
      wx.request({
        url: url,
        data: {},
        success: function (res) {
          console.log(res);
          if (res.data.code === 200) {
            var tips = {};
            var dayStatic = res.data.data.dayStatic;
            dayStatic.map((item, index) => {
              tips[index] = item;
              if (item.type === 1) {
                tips[index].text = '休'
                tips[index].class = 'van-calendar_text-holidays'
              } else if (item.type === 2) {
                tips[index].text = '班'
                tips[index].class = 'van-calendar_text-workdays'
              }
            })
            self.setData({
              tips
            })
            // 接入来获取最新列表
          } else if (res.data.code === 201) {
            console.log('暂无本月提示数据。')
          } else {
            console.log('获取月度提示数据失败。')
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
      var month = util.getDayFullValue(date, true);
      this.showCodingTime(date);
      this.showTips(month);
    }
  },
  attached() {
    // 第二种方式通过组件的生命周期函数执行代码
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {},

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})