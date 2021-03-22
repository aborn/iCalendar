// pages/setting/index.js
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    token: '',
    id: '',
    ctoken: '',
    cid: '',
    buttonDisabledStatus: true,
  },

  methods: {
  },

  onClickLeft() {
    wx.navigateBack({})
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
    var that = this;
    var token = this.data.token;
    var id = this.data.id;
    var ctoken = this.data.ctoken;
    var cid = this.data.cid;

    console.log('token=' + token + ', id=' + id +
      ', 当前表单值：ctoken=' + ctoken + ', cid=' + cid)

    var url = 'https://aborn.me/webx/user/postUserConfig'
    console.log('url=' + url);

    // 提交token与id的配置信息
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
          config.token = data.token
          config.id = data.id
          config.regDate = data.createDate
          config.type = data.type;

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
                }
              })

            },
            fail: () => {
              wx.showToast({
                title: '配置提交失败！原因：本地存储失败。',
                icon: 'none'
              });
            }
          })
        } else if (res.data.code === 201) {
          wx.showModal({
            title: "帐号token或id不正确！",
            showCancel: false
          })
        } else {
          wx.showToast({
            title: '服务器忙，请稍后重试！',
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
    var token = app.globalData.config.token
    var id =app.globalData.config.id
    var ctoken = app.globalData.config.token
    var cid = app.globalData.config.id
    this.setData({token,id,ctoken,cid})

    /**
    var testConfig = app.globalData.TestConfig;    
    if (id === testConfig.id && token === testConfig.token) {
      console.log('当前账号为测试账号')
    }
     */
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