//input.js
const util = require('../../utils/util.js')
const app = getApp()
Page({
  data: {
    hint: '',
    bookName: '',
    percentHint: '完成比例(如56,表示完成全书56%)'
  },
  switch2Page: function(e) {
    this.setData({
      percentHint: e.detail.value ?
       '完成页码(如56,表示阅读到第56页)' :
        '完成比例(如56,表示完成全书56%)'
    })
  },
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  submitRecord: function(e) {
    var formJson = e.detail.value;
    var reg = new RegExp("》$");
    if (formJson.bookName.indexOf("《") == 0) {
      formJson.bookName = formJson.bookName.substr(1);
    }
    if (reg.test(formJson.bookName)) {
      formJson.bookName = formJson.bookName.substr(0, formJson.bookName.length - 1);
    }

    var title = '《' + formJson.bookName + '》 ';
    var currentDate = new Date();
    var dateInfo = (currentDate.getMonth() + 1) + '.' + currentDate.getDate() + ' ' + currentDate.getDate() + '天 ';
    wx.setClipboardData({data:dateInfo + title + formJson.progress + "%"});
    var progressHint = '已经完成全书的' + formJson.progress + "%！";
    if (formJson.switchValue) {
      progressHint = '已经阅读到第' + formJson.progress + '页！';
      wx.setClipboardData({ data: dateInfo + title + formJson.progress + "页"});
    }
    var hintMessage = title + progressHint;

    // 做一下简单的校验，校验不通过，不处理
    if (formJson.bookName == null || formJson.bookName=='') {
      hintMessage = '书名不能为空';
      this.setData({
        hint: hintMessage
      })
      return;
    } else if (formJson.progress == null || formJson.progress=='') {
      hintMessage = '进度不能为空';
      this.setData({
        hint: hintMessage
      })
      return;
    } else {
      this.setData({
        hint: hintMessage
      })
    }

    console.log(formJson)
    var reads = wx.getStorageSync('reads') || {}
    var records = reads.records || []
    var record = {
      "bookName": formJson.bookName,
      "progress": formJson.progress,
      "type": formJson.switchValue ? 1 : 2,   // 1 表示页码，2 表示百分比
      "time": Date.now()
      }

    // 同一本书在同一天只记录最后一次
    var records = records.filter(function(item){
      return formJson.bookName != item.bookName
        || util.formatDay(new Date(item.time)) != util.formatDay(new Date(record.time)); 
    });

    records.unshift(record)
    reads.records = records
    reads.openid = app.globalData.openid
    wx.setStorageSync('reads', reads)
    this.setData({
      bookName: formJson.bookName
    })
    // 接下来是将打卡记录保存下来
    //console.log('###openid=' + app.globalData.openid);
    var postData = {};
    var book = {};
    book.bookName = record.bookName;
    book.progress = record.progress;
    book.type = record.type;
    book.time = record.time;
    postData.openid = app.globalData.openid;
    postData.records = [];
    postData.records.push(book);

    var user = {
      "openid": app.globalData.openid,
      "userName": app.globalData.userInfo.nickName,
      "avatar": app.globalData.userInfo.avatarUrl,
      "city": app.globalData.userInfo.city,
      "country": app.globalData.userInfo.country,
      "gender": app.globalData.userInfo.gender,
      "province": app.globalData.userInfo.province,
      "language": app.globalData.userInfo.language
    };
    postData.user = user;

    wx.request({
      url: 'https://pelpa.popkit.org/geekpen/api/record.json',
      data: JSON.stringify(postData),
      method:'POST',
      success: function (res) {
        var data = res.data;
        if (data.success) {
          console.log("操作成功")
          // 操作成功后 进入自己打卡历史
          wx.navigateTo({
            url: '../records/records'
          })
        } else {
          console.log(data.info);
        }
      },
      fail : function(res) {
        console.log("操作失败failed");
      }
    })
  },

  bindReplaceInput: function (e) {
    var value = e.detail.value
    var pos = e.detail.cursor
    if (pos != -1) {
      //光标在中间
      var left = e.detail.value.slice(0, pos)
      //计算光标的位置
      pos = left.replace(/11/g, '2').length
    }

    //直接返回对象，可以对输入进行过滤处理，同时可以控制光标的位置
    return {
      value: value.replace(/11/g, '2'),
      cursor: pos
    }

    //或者直接返回字符串,光标在最后边
    //return value.replace(/11/g,'2'),
  }
})