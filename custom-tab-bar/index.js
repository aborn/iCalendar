Component({
  data: {
    selected: 0,
    color: "#2D2C2E",
    selectedColor: "#FAB32A",
    borderStyle: "black",
    backgroundColor: "#ffffff",
    callback: null,
    list: [
      {
        "pagePath": "/pages/index/index",
        "iconPath": "../images/tabbar/home.png",
        "selectedIconPath": "../images/tabbar/home-filling.png",
        "text": "极客日历"
      },
      {
        "pagePath": "/pages/index/index",
        "iconPath": "../images/tabbar/user.png",
        "selectedIconPath": "../images/tabbar/user-filling.png",
        "text": "我的"
      }
    ]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      console.log("switchTab", e)
      const data = e.currentTarget.dataset
      const url = data.path
      this.data.callback(data.index)
      // wx.switchTab({url})
      this.setData({
        selected: data.index
      })
    }
  }
})