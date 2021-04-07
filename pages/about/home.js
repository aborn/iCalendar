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
      var testConfig = app.globalData.TestConfig;
      if (id === testConfig.id && token === testConfig.token) {
        desc = "当前为测试帐号，请申请自己的帐号！";
        this.setData({
          isTest: true
        })
      }
      this.setData({
        id,
        token,
        desc,
        regDate,
        type
      })
    },
    applyAccount(e) {
      this.setData({
        show: true
      })
    },
    onChange(e) {
      var cvalue = e.detail;
      const {
        field,
        value
      } = e.currentTarget.dataset
      console.log('当前值为：' + cvalue + ", field=" + field + ", value=" + value)

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
    onSubmit(event) {
      var that = this;
      var token = this.data.token;
      var id = this.data.id;
      var ctoken = this.data.ctoken;
      var cid = this.data.cid;

      console.log('token=' + token + ', id=' + id +
        ', 当前表单值：ctoken=' + ctoken + ', cid=' + cid)
      console.log(event.detail);
    },
    onClose() {
      this.setData({
        show: false
      });
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