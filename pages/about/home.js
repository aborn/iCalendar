// pages/about/home/home.js
const app = getApp()

Component({

  /**
   * Page initial data
   */
  data: {
    token: app.globalData.config.token,
    id: app.globalData.config.id,
    desc: '',
  },

  lifetimes: {
    ready() {
      var id = this.data.id;
      var token = this.data.token;
      var testConfig = app.globalData.TestConfig;
      console.log(testConfig)
      if (id === testConfig.id && token === testConfig.token) {
        this.setData({
          desc: "当前账号为测试账号，请设置自己的账号！"
        })
      }
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
  }
})