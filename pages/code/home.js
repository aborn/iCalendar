// pages/read/home/home.js
const util = require('../../utils/util.js')
const timeUtil = require('../../utils/timeutil.js')
import Toast from '../../vant/toast/toast';
import convertSolarLunar from '../../utils/lunar'

Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    minDate: new Date(2021, 2, 1).getTime(),
    maxDate: new Date(2021, 2, 28).getTime(),
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
    formatter: (day) => {
      const year = day.date.getFullYear();
      const month = day.date.getMonth() + 1;
      const date = day.date.getDate();
      var res = convertSolarLunar.solar2lunar(year, month, date);
      var lunaDetail = timeUtil.lunarToReadable(res);
      day.bottomInfo = lunaDetail;

      //console.log(year + '-' + month + '-' + date)
      //console.log(res);

      /**
      if (month === 3) {
        if (date === 1) {
          day.bottomInfo = '劳动节';
        } else if (date === 4) {
          day.bottomInfo = '五四青年节';
        } else if (date === 11) {
          day.text = '今天';
        }
      }

      if (day.type === 'start') {
        day.bottomInfo = '入住';
      } else if (day.type === 'end') {
        day.bottomInfo = '离店';
      }
      */

      return day;
    },
  },
  methods: {
    hcellClickEvent(e) {
      console.log(e)
      Toast('我是提示文案，建议不超过十五字~');
    },
    showCodingTime(date) {
      var self = this;
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      if (month < 10) {
        month = '0' + month;
      }

      var day = date.getDay();
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
              dayStaticByHour: util.transToLevel(res.data.data.dayStaticByHour),
              codeTime: util.readTimeDesc(codeTimeSecond)
            })
            // 接入来获取最新列表
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