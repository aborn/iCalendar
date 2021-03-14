// pages/setting/index.js
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    token: app.globalData.config.token,
    id: app.globalData.config.id,
  },

  methods: {

  },

  onClickLeft() {
    wx.navigateTo({
      url: "/pages/index/index?pageCur=about"
    })
    //wx.showToast({ title: '点击返回', icon: 'none' });
  },
  onClickRight() {
    wx.showToast({
      title: '点击按钮',
      icon: 'none'
    });
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    var id = this.data.id;
    var token = this.data.token;
    var testConfig = app.globalData.TestConfig;
    if (id === testConfig.id && token === testConfig.token) {
      console.log('测试账号')      
    }
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