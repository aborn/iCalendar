//index.js
//获取应用实例
const app = getApp()
const timeutil = require('../../utils/timeutil.js')

Page({
  data: {
    pageCur: 'code', // 首次打开时进入的page页
    active: 0, // 激活的tab
  },
  onTabChange(e) {
    var tabIndex = e.detail;
    var pageCur = 'code';
    if (tabIndex === 1) {
      pageCur = 'about';
    }

    this.setData({
      active: e.detail,
      pageCur
    })
  },
  onLoad: function () {
    var thatThat = this;
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }
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