//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    pageCur: 'code', // 首次打开时进入的page页
    active: 0, // 激活的tab
    dot: false
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
      active: e.detail,
      pageCur
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }
  },
  onShow: function () {
    this.setData({
      dot: app.globalData.TestConfig.token === app.getToken()
    })

    var that = this;
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {

      this.getTabBar().setData({
        callback: (tabIndex) => {
          console.log('callbak called.' + tabIndex)
          var pageCur = 'code';
          if (tabIndex === 1) {
            pageCur = 'about';
          } else {
            pageCur = 'code';
          }
      
          that.setData({
            pageCur
          })
        }
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