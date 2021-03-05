// pages/read/home/home.js
const util = require('../../utils/util.js')
const timeUtil = require('../../utils/timeutil.js')
import convertSolarLunar from '../../utils/lunar'

Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    frameIndex: 1,
    minDate: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    ).getTime(),
    maxDate: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    ).getTime(),
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
    }
  },
  methods: {
    hcellClickEvent(e) {
      const {
        value,
        hour
      } = e.currentTarget.dataset
      console.log('hour:' + hour + "，编程时间:" + (value * 0.5) + "分钟");
    },
    showCodingTime(date) {
      var self = this;
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();

      var isToday = util.isToday(date);
      
      if (month < 10) {
        month = '0' + month;
      }

      if (day < 10) {
        day = '0' + day;
      }
      var dayInfo = year + '-' + month + '-' + day;
      var url = 'https://aborn.me/webx/getUserAction?token=8ba394513f8420e&day=' + dayInfo
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
              dayStaticByHour: util.transToLevel(res.data.data.dayStaticByHour, isToday),
              codeTime: util.readTimeDesc(codeTimeSecond)
            })
            // 接入来获取最新列表
          } else if (res.data.code === 201) {
            self.setData({
              codeTime: '0分钟',
              dayStaticByHour: util.transToLevel(util.initCellData())
            })
            console.log('暂无编程数据。')
          } else {
            self.setData({
              codeTime: '未知-501',
              dayStaticByHour: util.transToLevel(util.initCellData())
            })
            console.log('获取数据失败。')
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
      const {
        type
      } = e.currentTarget.dataset
      console.log('切换到上个月' + type)

      var currentDate = new Date(this.data.defaultDate);
      var lastDayOfMonth = timeUtil.getMonthEndDay(currentDate.getFullYear(), currentDate.getMonth());
      console.log("当前日期：" + timeUtil.formatTime(currentDate) + '最后一天' + lastDayOfMonth)
      var currentDateInfo = {
        year: currentDate.getFullYear(),
        month: currentDate.getMonth()
      }
      var targetMonthInfo = "next_month" === type ?
        timeUtil.getNextMonthInfo(currentDateInfo) : timeUtil.getPrevMonthInfo(currentDateInfo);
      //console.log(targetMonthInfo)

      var targetMonthDate = new Date(targetMonthInfo.year, targetMonthInfo.month, 1)
      var targetMonthLastDate = new Date(targetMonthInfo.year, targetMonthInfo.month,
        timeUtil.getMonthEndDay(targetMonthInfo.year, targetMonthInfo.month))

      //console.log(targetMonthDate)
      this.setData({
        minDate: targetMonthDate.getTime(),
        maxDate: targetMonthLastDate.getTime(),
        subtitle: targetMonthInfo.year + "年" + (targetMonthInfo.month + 1) + "月",
        defaultDate: targetMonthDate
      })
      var currentDate = new Date(this.data.defaultDate);
      var lastDayOfMonth = timeUtil.getMonthEndDay(currentDate.getFullYear(), currentDate.getMonth());
      console.log("当前日期after：" + timeUtil.formatTime(currentDate) + ", lastday" + lastDayOfMonth)

      const calender = this.selectComponent('.calendar');
      calender.reset();
    }
  },

  /**
   * 页面加载完成执行
   */
  lifetimes: {
    ready() {
      console.log('ready in component') // 这个在最后
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      this.setData({
        subtitle: year + "年" + month + "月"
      })
      this.showCodingTime(date);
    }
  },
  attached() {
    // 第二种方式通过组件的生命周期函数执行代码
    console.log('component attached')
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