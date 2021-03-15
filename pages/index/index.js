//index.js
//获取应用实例
const app = getApp()
const timeutil = require('../../utils/timeutil.js')

Page({
  data: {
    pageCur: 'code', // 首次打开时进入的page页
    active: 0, // 激活的tab
    tab: 'code',
  },
  onTabChange(e) {
    var tabIndex = e.detail;
    var pageCur = this.data.pageCur;
    if (tabIndex === 1) {
      pageCur = 'about';
    } else {
      pageCur = 'code';
    }

    this.setData({
      tab: pageCur,
      active: e.detail,
      pageCur
    })
  },
  onLoad: function () {
    var thatThat = this;
    var tab = this.data.tab;
    console.log('tab=' + tab)
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }
  },
  onShow: function () {
    let config = app.globalData.config;
    console.log('on show on show index...')
    console.log(config)
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})