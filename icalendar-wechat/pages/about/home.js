// pages/about/home/home.js
const app = getApp()
const util = require('../../utils/util.js')

Component({
  data: {
    token: '',
    id: '',
    desc: '',
    arrow: 'arrow-down',
    arrowShow: false,
    activeNames: ['0'],
    typemap: {
      "NORMAL": "普通帐号",
      "VIP": "VIP帐号",
      "TEST": "测试帐号"
    },
    show: false,
    isTest: false,
    token: '',
    id: '',
    ctoken: '',
    cid: '',
    beforeClose: (action) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          if (action === 'confirm') {
            resolve(true);
          } else {
            // 拦截取消操作
            resolve(false);
          }
        }, 1000);
      });
    },
  },
  attached() {},
  methods: {
    onChange(event) {
      this.setData({
        activeNames: event.detail,
      });
    },
    onShowDetail(e) {
      console.log("show detail", e)
      const {
        name
      } = e.currentTarget.dataset
      if (name === "arrow-down") {
        this.setData({
          arrow: "arrow-up",
          arrowShow: true
        })
      } else {
        this.setData({
          arrow: "arrow-down",
          arrowShow: false
        })
      }
    },
    updateConfigInfo() {
      var id = app.globalData.config.id;
      var token = app.globalData.config.token;
      var regDate = app.globalData.config.regDate;
      var type = this.data.typemap[app.globalData.config.type] || "普通帐号";
      var desc = '';
      this.setData({
        isTest: false
      })
      this.setData({
        id,
        token,
        desc,
        regDate,
        type
      })
    },
  },
  lifetimes: {
    ready() {
      this.updateConfigInfo()
      util.updateTabBarTipsInfo()
      wx.setNavigationBarTitle({
        title: '个人中心',
      })
    }
  },
  pageLifetimes: {
    show() {
      this.updateConfigInfo()
    }
  }
})