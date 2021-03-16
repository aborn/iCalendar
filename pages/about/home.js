// pages/about/home/home.js
const app = getApp()

Component({
  data: {
    token: '',
    id: '',
    desc: '',
  },
  attached() {
  },
  methods: {
    updateConfigInfo() {
      var id = app.globalData.config.id;
      var token = app.globalData.config.token;
      var desc = '';
      var testConfig = app.globalData.TestConfig;
      if (id === testConfig.id && token === testConfig.token) {
        desc = "当前账号为测试账号，请设置自己的账号！";
      }
      this.setData({id, token, desc})
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