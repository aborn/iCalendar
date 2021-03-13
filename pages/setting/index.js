// pages/setting/index.js
Page({

  /**
   * Page initial data
   */
  data: {

  },

  methods: {

  },

  onClickLeft() {
    wx.navigateTo({
      url: "/pages/index/index"
    })
    //wx.showToast({ title: '点击返回', icon: 'none' });
  },
  onClickRight() {
    wx.showToast({ title: '点击按钮', icon: 'none' });
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