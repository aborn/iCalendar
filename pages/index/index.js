//index.js
//获取应用实例
const app = getApp()
const timeutil = require('../../utils/timeutil.js')

Page({
  data: {
    read: '读书打卡',
    records: '打卡历史',
    userInfo: {},
    hasUserInfo: false,
    PageCur: 'read',
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  NavChange(e) {
    var currentData = e.currentTarget.dataset.cur;

    if (currentData === 'about') {
      wx.getClipboardData({
        success(res) {
          var data = res.data;
          if (data && !data.startsWith("【")) {
            var transData = '【' + timeutil.formatDay(new Date(), '.') + ' 阅读笔记】' + data;
            console.log(transData);
            wx.setClipboardData({
              data: transData,
            })
          }
        }
      })
    }
    console.log(currentData);
    this.setData({
      PageCur: e.currentTarget.dataset.cur
    })
  },

  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../records/records'
    })
  },
  goToReadPage: function () {
    wx.navigateTo({
      url: '../reads/read'
    })
  },
  goToRecordsPage: function () {
    wx.navigateTo({
      url: '../records/records'
    })
  },
  onLoad: function () {
    var thatThat = this;
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.userInfo']) {
          console.log('还没授权222？？')
          wx.authorize({
            scope: 'scope.userInfo',
            success: function (obj) {
              console.log('授权成功!')
              var thatThat2 = thatThat;
              wx.getUserInfo({
                success: res => {
                  // 可以将 res 发送给后台解码出 unionId
                  app.globalData.userInfo = res.userInfo
                  thatThat2.setData({
                    userInfo: app.globalData.userInfo,
                    hasUserInfo: true
                  })
                }
              })
            },
            fail: function (fobj) {
              console.log('失败2')
              //wx.navigateBack()
            }
          })
        }
      }
    })

    // 登录
    wx.login({
      success: res => {
        if (res.code) {
          //发起网络请求
          //console.log('login...')
          wx.request({
            url: 'https://aborn.me/api/wechart/jscode2session?code=' + res.code,
            data: {
              code: res.code
            },
            success: function (res) {
              //console.log(res);
              if (res.data.code === 200) {
                app.globalData.openid = res.data.openid;
                //console.log(app.globalData.userInfo);
                //console.log('login success.')

                // 接入来获取最新列表
              } else {
                console.log('login failed.')
              }
            }
          })
        } else {
          console.log('用户登录态失败！' + res.errMsg)
        }
        //console.log(res)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
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