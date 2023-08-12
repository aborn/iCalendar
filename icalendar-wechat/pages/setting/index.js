// pages/setting/index.js
const app = getApp()
const util = require('../../utils/util.js')

Page({
  /**
   * Page initial data
   */
  data: {
    token: '',
    id: '',
    ctoken: '',
    cid: '',
    disabled: true,
    loading: false,
    isTest: false
  },
  methods: {},
  onChange(e) {
    var cvalue = e.detail;
    const {
      field,
      value,
      actiontype
    } = e.currentTarget.dataset
    console.log('当前值为：' + cvalue + ", field=" + field + ", value=" + value + ", actiontype=" + actiontype)

    this.setData({
      disabled: cvalue === value
    })

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
    var that = this;
    var token = this.data.token;
    var id = this.data.id;
    var ctoken = this.data.ctoken;
    var cid = this.data.cid;

    this.setData({
      loading: true,
      disabled: true
    })

    console.log('token=' + token + ', id=' + id +
      ', 当前表单值：ctoken=' + ctoken + ', cid=' + cid)

    // 有可能这个config还有其他信息
    var config = wx.getStorageSync('config') || {}
    config.token = ctoken
    config.id = cid

    // 更新下全局信息
    app.globalData.config = config;

    // 数据保存起来
    wx.setStorage({
      key: "config",
      data: config,
      success: () => {
        wx.navigateBack({
          success: () => {
            wx.showToast({
              title: '配置信息更新成功！',
              icon: 'none'
            });
            util.updateTabBarTipsInfo();
          }
        })
        that.setData({
          loading: false,
          disabled: false
        })
      },
      fail: () => {
        wx.showToast({
          title: '配置提交失败！原因：本地存储失败。',
          icon: 'none'
        });
        that.setData({
          loading: false,
          disabled: false
        })
      }
    })
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    var token = app.globalData.config.token
    var id = app.globalData.config.id
    var ctoken = app.globalData.config.token
    var cid = app.globalData.config.id
    this.setData({
      token,
      id,
      ctoken,
      cid
    })
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