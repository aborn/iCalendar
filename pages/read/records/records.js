//logs.js
const util = require('../../../utils/util.js')

Page({
  data: {
    records: []
  },
  onLoad: function () {
    var reads = wx.getStorageSync('reads') || {}
    var records = reads.records || []
    this.setData({
      records: records.map(record => {
        var timeStr = util.formatTime(new Date(record.time));
        var hint = record.type == 1 ? ('第' + record.progress + '页') 
          : ' ' + record.progress + '%';
        return  timeStr + '《' + record.bookName + '》' + hint;
      })
    })
  }
})