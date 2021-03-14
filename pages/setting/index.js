// pages/setting/index.js
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    token: app.globalData.config.token,
    id: app.globalData.config.id,
    ctoken: app.globalData.config.token,
    cid: app.globalData.config.id,
    buttonDisabledStatus: true,
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
  onChange(e) {
    var cvalue = e.detail;
    const {
      field,
      value
    } = e.currentTarget.dataset
    // console.log('当前值为：' + cvalue + ", field=" + field + ", value=" + value)
    if (cvalue !== value) {
      this.setData({
        buttonDisabledStatus: false
      })
    }

    if (field === 'id') {
      this.setData({
        cid: cvalue
      })
    } else if (field === 'token') {
      this.setData({
        ctoken: cvalue
      })
    }
  },
  onSubmit(e) {
    var token = this.data.token;
    var id = this.data.id;
    var ctoken = this.data.ctoken;
    var cid = this.data.cid;

    console.log('token=' + token + ', id=' + id +
      ', 当前表单值：ctoken=' + ctoken + ', cid=' + cid)

    var url = 'https://aborn.me/webx/postUserConfig'
    console.log('url=' + url);

    // 获取写代码的时间信息
    wx.request({
      url: url,
      method: "POST",
      data: {
        token: ctoken,
        id: cid
      },
      success: function (res) {
        console.log(res);
        var data = res.data.data;
        var message = res.data.msg;
        console.log('data=' + data + ", message=" + message)

        if (res.data.code === 200) {
          // 有可能这个config还有其他信息
          var config = wx.getStorageSync('config') || {}
          config.token = ctoken
          config.id = cid

          wx.setStorage({
            key: "config",
            data: config,
            success: (data) => {              
              wx.showToast({
                title: '配置提交成功！',
                icon: 'none'
              });
            },
            fail: (data) => {
              wx.showToast({
                title: '配置提交失败！原因：本地存储失败。',
                icon: 'none'
              });
            }
          })
        } else {
          wx.showToast({
            title: '配置提交失败！',
            icon: 'none'
          });
        }
      }
    })
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    var id = this.data.id;
    var token = this.data.token;
    var testConfig = app.globalData.TestConfig;
    if (id === testConfig.id && token === testConfig.token) {
      console.log('当前账号为测试账号')
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