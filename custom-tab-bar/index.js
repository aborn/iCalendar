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
        "iconPath": "../images/tabbar/basics.png",
        "selectedIconPath": "../images/tabbar/basics_cur.png",
        "text": "极客日历"
      },
      {
        "pagePath": "/pages/index/index",
        "iconPath": "../images/tabbar/about.png",
        "selectedIconPath": "../images/tabbar/about_cur.png",
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