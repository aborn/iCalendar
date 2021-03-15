// pages/about/home/home.js
const app = getApp()

Component({

  data: {
    token: '',
    id: '',
    desc: '',
  },
  attached() {
    console.log('about is attached.')
  },
  lifetimes: {
    ready() {
      var id = app.globalData.config.id;
      var token = app.globalData.config.token;
      this.setData({id,token})

      console.log(app.globalData.config)
      var testConfig = app.globalData.TestConfig;
      console.log('about page is ready.')
      if (id === testConfig.id && token === testConfig.token) {
        this.setData({
          desc: "当前账号为测试账号，请设置自己的账号！"
        })
      }
    }
  }
})