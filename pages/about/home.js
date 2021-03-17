// pages/about/home/home.js
const app = getApp()

Component({
  data: {
    token: '',
    id: '',
    desc: '',
    typemap: {
      "NORMAL" : "普通帐号",
      "VIP" : "VIP帐号",
      "TEST" : "测试帐号"
    }
  },
  attached() {
  },
  methods: {
    updateConfigInfo() {
      var id = app.globalData.config.id;
      var token = app.globalData.config.token;
      var regDate = app.globalData.config.regDate;
      var type = this.data.typemap[app.globalData.config.type] || "普通帐号";
      var desc = '';
      var testConfig = app.globalData.TestConfig;
      if (id === testConfig.id && token === testConfig.token) {
        desc = "当前账号为测试账号，请设置自己的账号！";
      }
      this.setData({id, token, desc, regDate, type})
    }
  },
  lifetimes: {
    ready() {
      this.updateConfigInfo()
    }
  },
  pageLifetimes: {
    show() {
      this.updateConfigInfo()
    }
  }
})