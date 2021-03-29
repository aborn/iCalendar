// pages/about/home/home.js
const app = getApp()

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
    }
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
        desc = "当前账号为测试账号，请设置自己的账号！";
      }
      this.setData({
        id,
        token,
        desc,
        regDate,
        type
      })
    }
  },
  lifetimes: {
    ready() {
      this.updateConfigInfo()
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