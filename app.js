//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var config = wx.getStorageSync('config') || this.globalData.TestConfig
    this.globalData.config = config;

    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          this.globalData.Custom = capsule;
          this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
          this.globalData.CustomBar = e.statusBarHeight + 50;
        }
      }
    })
  },
  getToken() {
    return this.globalData.config.token;
  },
  globalData: {
    userInfo: null,
    openid: null,
    config: null,
    TestConfig: {
      token: "8ba394513f8420e",
      id: "webx",
      type: "TEST",
      regDate: "2021-03-18"
    },
  }
})