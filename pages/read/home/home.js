// pages/read/home/home.js
const util = require('../../../utils/util.js')
import Toast from '../../../vant/toast/toast';
const app = getApp();
// 引入插件安装器
import plugin from '../../../calendar/plugins/index'
// 设置代办
import todo from '../../../calendar/plugins/todo'
// 农历相关功能
import solarLunar from '../../../calendar/plugins/solarLunar/index'
// 节假日相关功能
import holidays from '../../../calendar/plugins/holidays/index'
plugin
  .use(todo)
  .use(solarLunar)
  .use(holidays)

Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    minDate: new Date(2021, 2, 1).getTime(),
    maxDate: new Date(2021, 2, 28).getTime(),
    dayStaticByHour : [
      {value:0, level:0 },
      {value:0, level:0 },
      {value:0, level:0 },
      {value:0, level:0 },
      {value:0, level:0 },
      {value:0, level:0 },
      {value:0, level:0 },
      {value:0, level:0 },
      {value:0, level:0 },
      {value:0, level:0 },
      {value:0, level:0 },
      {value:0, level:0 },
      {value:0, level:0 },
      {value:0, level:0 },
      {value:0, level:0 },
      {value:0, level:0 },
      {value:0, level:0 },
      {value:0, level:0 },
      {value:0, level:0 },
      {value:0, level:0 },
      {value:0, level:0 },
      {value:0, level:0 },
      {value:0, level:0 },
      {value:0, level:0 },
    ]
  },
  methods: {
    hcellClickEvent(e) {
      console.log(e)
      Toast('我是提示文案，建议不超过十五字~');
    },
    afterSelectDate(e) {
      var self = this;
      // 详情数据对象
      var date = e.detail;
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      if (month < 10) {
        month = '0' + month;
      }
     
      var day = date.getDay();
      if (day < 10) {
        day = '0' + day;
      }
      var dayInfo = year + '-' +  month + '-' + day;
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
    afterCalendarRender(e) {
      var self = this;
      // 获取写代码的时间信息
      wx.request({
        url: 'https://aborn.me/webx/getUserAction?token=8ba394513f8420e',
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
              dayStaticByHour: util.transToLevel(util.initCellData)
            })
            console.log('获取数据失败。')
          }
        }
      })
      console.log('afterCalendarRender', e)
    },
    /**
     * 日期点击事件（此事件会完全接管点击事件），需自定义配置 takeoverTap 值为真才能生效
     * currentSelect 当前点击的日期
     */
    takeoverTap(e) {
      console.log('takeoverTap', e.detail) // => { year: 2019, month: 12, date: 3, ...}
    },
    /**
     * 选择日期后执行的事件
     */
    afterTapDate(e) {
      console.log('afterTapDate', e.detail) // => { year: 2019, month: 12, date: 3, ...}
      var self = this;
      var year = e.detail.year;
      var month = e.detail.month;
      if (month < 10) {
        month = '0' + month;
      }
      var date = e.detail.date;
      if (date < 10) {
        date = '0' + date;
      }
      var dayInfo = year + '-' +  month + '-' + date;
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
    /**
     * 当日历滑动时触发(适用于周/月视图)
     * 可在滑动时按需在该方法内获取当前日历的一些数据
     */
    onSwipe(e) {
      console.log('onSwipe', e.detail)
    },
    /**
     * 当改变月份时触发
     * => current 当前年月 / next 切换后的年月
     */
    whenChangeMonth(e) {
      console.log('whenChangeMonth', e.detail)
      // => { current: { month: 3, ... }, next: { month: 4, ... }}
    },
  },

  data: {
    // 此处为日历自定义配置字段
    calendarConfig: {
      multi: false, // 是否开启多选,
      weekMode: false, // 周视图模式
      theme: 'default', // 日历主题，目前共两款可选择，默认 default 及 elegant，自定义主题色在参考 /theme 文件夹
      showLunar: true, // 是否显示农历，此配置会导致 setTodoLabels 中 showLabelAlways 配置失效
      showHolidays: true, // 显示法定节假日班/休情况，需引入holidays插件
      showFestival: true, // 显示节日信息（如教师节等），需引入holidays插件
      inverse: false, // 单选模式下是否支持取消选中,
      emphasisWeek: true, // 是否高亮显示周末日期
      highlightToday: true, // 是否高亮显示当天，区别于选中样式（初始化时当天高亮并不代表已选中当天）
      preventSwipe: true, // 是否禁用日历滑动切换月份
      onlyShowCurrentMonth: true, // 日历面板是否只显示本月日期
    },
    codeTime: "0分钟"
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

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